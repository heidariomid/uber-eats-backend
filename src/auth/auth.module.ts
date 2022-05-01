import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { UsersValidation } from '../users/entities/usersValidation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersValidation])],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
