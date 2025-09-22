import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { emailDesign } from './emailDesign';
import { FirebaseService } from '../firebase/firebase.service';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import { cacheSet } from '../utils/cache.util';
import { RedisService } from '../redis/redis.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter<
    SentMessageInfo,
    Options
  >;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly redis: RedisService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendCodeToEmail(email: string, recovery: boolean): Promise<void> {
    const user: UserRecord | null =
      await this.firebaseService.getUserByEmail(email);
    if (user && !recovery) {
      throw new HttpException('Account with this email already exist', 400);
    }
    const shouldSend = (recovery && !!user) || (!recovery && !user);

    const recoveryKey = this.generateVerificationCode();

    if (shouldSend) {
      const displayName = user?.displayName ?? 'there';
      const subject = recovery
        ? 'Here is your verification code to recover your password'
        : 'Verify your KamiGuide account';

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: emailDesign(displayName, recoveryKey, recovery),
      };

      try {
        const TTL_10_MINUTES = 600;
        const info = await this.transporter.sendMail(mailOptions);

        if (info) {
          if (user && recovery) {
            const attemptsKey = `app:recovery:attempts:${user.email}`;
            const key = `app:recovery:token:${user.email}`;
            await cacheSet(this.redis.client, key, TTL_10_MINUTES, recoveryKey);
            await cacheSet(this.redis.client, attemptsKey, TTL_10_MINUTES, '1');
            return;
          } else {
            const key = `app:verification:token:${email}`;
            const attemptsKey = `app:verification:attempts:${email}`;
            await cacheSet(this.redis.client, key, TTL_10_MINUTES, recoveryKey);
            await cacheSet(this.redis.client, attemptsKey, TTL_10_MINUTES, '1');
            return;
          }
        }
      } catch (error) {
        this.logger.error('Error sending email', error);
        throw new HttpException('Error sending code.', 500);
      }
    }
  }

  async invalidateRecoveryCode(email: string): Promise<void> {
    const key = `app:recovery:token:${email}`;
    await this.redis.client.del(key);
  }

  //creates a code of 5 random numbers
  generateVerificationCode(): string {
    const num = crypto.randomInt(0, 100_000);
    return num.toString().padStart(5, '0');
  }
}
