import * as firebaseAdmin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;

@Injectable()
export class FirebaseService {
  async createUser(props: CreateRequest): Promise<UserRecord> {
    return firebaseAdmin.auth().createUser(props);
  }
}

