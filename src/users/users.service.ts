import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { addUserArgs } from './args/addUser.args';
import { UpdateUserInput, UpdateUserOutput } from './args/updateUser.args';
import { UserProfileInput, UserProfileOutput } from './args/userProfile.args';
import {
  ValidateEmailInput,
  ValidateEmailOutput,
} from './args/userValidate.args';
import { User } from './entities/users.entity';
import { UsersValidation } from './entities/usersValidation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UsersValidation)
    private readonly usersValidation: Repository<UsersValidation>,
    private readonly mailService: MailService,
  ) {}
  // get all users
  allUsers(): Promise<User[]> {
    return this.users.find();
  }
  //add user
  addUser(args: addUserArgs): Promise<User> {
    const newResturan = this.users.create(args);
    return this.users.save(newResturan);
  }

  //find user
  async findUser({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail(userId);
      return { ok: true, message: 'User profile found', user };
    } catch (error) {
      return { ok: false, message: 'User does not exist' };
    }
  }

  // update user
  async updateUser(
    { id }: User,
    newUser: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    try {
      const user = await this.users.findOne(id);
      if (!user) {
        throw new Error('User does not exist');
      }
      if (newUser?.email) {
        user.email = newUser?.email;
        user.verified = false;
        this.usersValidation.delete({ user: { id: user.id } });
        const validation = await this.usersValidation.save(
          this.usersValidation.create({ user }),
        );
        this.mailService.sendVerificationMail(user?.email, validation?.code);
      }
      newUser?.password && (user.password = newUser?.password);
      newUser?.role && (user.role = newUser?.role);
      await this.users.save(user);
      return { ok: true, message: 'User Updated Successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  // verify email
  async validateEmail({
    code,
  }: ValidateEmailInput): Promise<ValidateEmailOutput> {
    try {
      const validation = await this.usersValidation.findOne(
        { code },
        { relations: ['user'] },
      );
      if (!validation) {
        throw new Error('Invalid Code');
      }
      validation.user.verified = true;
      this.users.save(validation.user);
      this.usersValidation.delete(validation.id);
      return { ok: true, message: 'Email verified successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
}
