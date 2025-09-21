import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createUser(registerUser: RegisterUserDto): Promise<UserRecord> {
    return this.firebaseService.createUser({
      displayName: registerUser.firstName,
      email: registerUser.email,
      password: registerUser.password,
    });
  }
}
