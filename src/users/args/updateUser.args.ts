import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { coreArgs } from '../../common/core.args';
import { User } from '../entities/users.entity';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['password', 'email', 'role']),
) {}

@ObjectType()
export class UpdateUserOutput extends coreArgs {}
