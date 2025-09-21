import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [AuthGuard, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
