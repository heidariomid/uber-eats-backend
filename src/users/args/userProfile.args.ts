import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { coreArgs } from '../../common/core.args';
import { User } from '../entities/users.entity';

@ArgsType()
export class UserProfileInput {
  @Field()
  userId: number;
}
@ObjectType()
export class UserProfileOutput extends coreArgs {
  @Field(() => User, { nullable: true })
  user?: User;
}
