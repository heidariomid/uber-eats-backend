import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const user = await this.users.findOne(userId);
    try {
      if (!user) {
        throw new Error('User not found');
      }

      return { ok: true, message: 'User Updated Successfully', user };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  // update user
  async updateUser(
    user: User,
    args: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    try {
      const findUser = await this.users.findOne(user.id);
      if (!findUser) {
        throw new Error('User not found');
      }

      if (args?.email) {
        findUser.email = args.email;
        await this.usersValidation.save(
          this.usersValidation.create({ user: findUser }),
        );
      }
      args?.password && (findUser.password = args.password);
      args?.role && (findUser.role = args.role);

      await this.users.save(findUser);
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
