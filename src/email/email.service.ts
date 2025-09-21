import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { emailDesing } from './emailDesign';
import { FirebaseService } from '../firebase/firebase.service';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import { cacheSet } from '../utils/cache.util';
import { RedisService } from '../redis/redis.service';

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

  async sendRefactorCodeMail(to: string): Promise<void> {
    const user = await this.firebaseService.getUserByEmail(to);
    if (!user) {
      this.logger.warn('User not found to send email');
      return;
    }
    const recoveryKey = this.generateVerificationCode();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: 'Here is your verification code',
      html: emailDesing(user.displayName!, recoveryKey),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);

      if (info) {
        const attemptsKey = `app:recovery:attempts:${to}`;
        const key = `app:recovery:token:${to}`;
        const TTL_10_MINUTES = 600;
        await cacheSet(this.redis.client, key, TTL_10_MINUTES, recoveryKey);
        await cacheSet(this.redis.client, attemptsKey, TTL_10_MINUTES, '1');
        return;
      }
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw new HttpException('Error sending code', 500);
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
