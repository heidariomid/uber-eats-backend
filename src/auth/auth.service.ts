import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { comparehashPassword } from 'src/services/hashPassword';
import { User } from 'src/users/entities/users.entity';
import { UsersValidation } from 'src/users/entities/usersValidation.entity';
import { Repository } from 'typeorm';
import {
  createAccountInput,
  createAccountOutput,
  loginInput,
  loginOutput,
} from './auth.args';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UsersValidation)
    private readonly usersValidation: Repository<UsersValidation>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<createAccountOutput> {
    try {
      const userExist = await this.users.findOne({ email });
      if (userExist) {
        throw new Error('User already exist');
      }
      const savedUser = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verification = await this.usersValidation.save(
        this.usersValidation.create({ user: savedUser }),
      );
      this.mailService.sendVerificationMail(
        savedUser?.email,
        verification?.code,
      );
      return {
        ok: true,
        message: 'User created Successfully',
      };
    } catch (error) {
      return {
        ok: true,
        message: 'User not created',
      };
    }
  }

  async login({ email, password }: loginInput): Promise<loginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        throw new Error('User not found');
      }
      const isValid = await comparehashPassword(password, user.password);
      if (!isValid) {
        throw new Error('Password is not valid');
      }

      const token = this.jwtService.generateToken({ id: user?.id });
      return {
        ok: true,
        message: 'User created Successfully',
        token,
      };
    } catch (error) {
      return {
        ok: true,
        message: 'User not created',
      };
    }
  }
}
