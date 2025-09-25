import * as firebaseAdmin from 'firebase-admin';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;
import { FirebaseConfigService } from './firebase-config.service';
import axios from 'axios';
import { DecodedIdToken } from 'firebase-admin/lib/auth';
import { FirebaseSignInResponse } from './interface/firebaseSignInResponse.interface';
import { FirebaseRefreshTokenResponse } from './interface/firebaseRefreshToken.interface';

@Injectable()
export class FirebaseService {
  private readonly apiKey: string;

  constructor(firebaseConfig: FirebaseConfigService) {
    this.apiKey = firebaseConfig.apiKey;
  }

  async createUser(props: CreateRequest): Promise<UserRecord> {
    return firebaseAdmin
      .auth()
      .createUser(props)
      .catch((error): never => this.handleFirebaseAuthError(error));
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    try {
      return await firebaseAdmin.auth().getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw error;
    }
  }

  async changePassword(
    email: string,
    newPassword: string,
  ): Promise<UserRecord> {
    const user = await firebaseAdmin
      .auth()
      .getUserByEmail(email)
      .catch((error): never => this.handleFirebaseAuthError(error));
    if (user.disabled) {
      throw new HttpException('User disabled', 403);
    }
    return firebaseAdmin
      .auth()
      .updateUser(user.uid, { password: newPassword })
      .catch((error): never => this.handleFirebaseAuthError(error));
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    return firebaseAdmin
      .auth()
      .verifyIdToken(token)
      .catch((error): never => this.handleFirebaseAuthError(error));
  }

  async refreshIdToken(
    refreshToken: string,
  ): Promise<FirebaseRefreshTokenResponse> {
    const url = `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`;
    return await this.sendPostRequest(url, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).catch((error) => {
      this.handleRestApiError(error);
    });
  }

  async singInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<FirebaseSignInResponse> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    }).catch((error) => {
      this.handleRestApiError(error);
    });
  }

  private async sendPostRequest(url: string, body: any) {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  private handleFirebaseAuthError(error: any): never {
    if (error.code?.startsWith('auth/')) {
      throw new BadRequestException(error.message);
    }
    throw new Error(error.message);
  }

  private handleRestApiError(error: any) {
    if (error.response?.data?.error?.code === 400) {
      const messageKey = error.response?.data?.error?.message;
      const message =
        {
          INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials',
          INVALID_REFRESH_TOKEN: 'Invalid refresh token',
          TOKEN_EXPIRED: 'Token expired',
          USER_DISABLED: 'User disabled',
        }[messageKey] ?? messageKey;

      throw new BadRequestException(message);
    }

    throw new Error(error?.message);
  }
}
