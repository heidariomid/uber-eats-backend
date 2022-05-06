import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { UsersValidation } from '../users/entities/usersValidation.entity';
import { HashPasswordService } from 'src/services/hashPassword';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersValidation])],
  providers: [
    AuthService,
    AuthResolver,
    HashPasswordService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
