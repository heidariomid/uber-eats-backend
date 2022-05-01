import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { coreArgs } from 'src/common/core.args';
import { User } from 'src/users/entities/users.entity';

@InputType()
export class createAccountInput extends PickType(User, [
  'password',
  'email',
  'role',
]) {}

@ObjectType()
export class createAccountOutput extends coreArgs {}

@InputType()
export class loginInput extends PickType(User, ['password', 'email']) {}

@ObjectType()
export class loginOutput extends coreArgs {
  @Field(() => String, { nullable: true })
  token?: string;
}
