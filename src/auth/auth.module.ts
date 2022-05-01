import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { UsersValidation } from 'src/users/entities/usersValidation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersValidation])],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
