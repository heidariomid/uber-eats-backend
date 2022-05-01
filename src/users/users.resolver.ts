import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { addUserArgs } from './args/addUser.args';
import { UpdateUserInput, UpdateUserOutput } from './args/updateUser.args';
import { UserProfileInput, UserProfileOutput } from './args/userProfile.args';
import {
  ValidateEmailInput,
  ValidateEmailOutput,
} from './args/userValidate.args';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  //init
  constructor(private readonly usersService: UsersService) {}

  // get all User
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.usersService.allUsers();
  }

  // get logged in User
  @Query(() => User)
  @UseGuards(AuthGuard)
  async loggedInUser(@AuthUser() user: User) {
    return user;
  }

  // get user profile
  @Query(() => UserProfileOutput)
  @UseGuards(AuthGuard)
  async userProfile(
    @Args() args: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return await this.usersService.findUser(args);
  }

  // add user
  @Mutation(() => User)
  async addUser(@Args('data') args: addUserArgs): Promise<User> {
    return await this.usersService.addUser(args);
  }

  // update user
  @Mutation(() => UpdateUserOutput)
  async updateUser(
    @AuthUser() user: User,
    @Args('data') args: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    return await this.usersService.updateUser(user, args);
  }

  // add user
  @Mutation(() => ValidateEmailOutput)
  async validateEmail(
    @Args('data') args: ValidateEmailInput,
  ): Promise<ValidateEmailOutput> {
    return await this.usersService.validateEmail(args);
  }
}
