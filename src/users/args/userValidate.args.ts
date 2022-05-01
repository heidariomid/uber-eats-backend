import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { coreArgs } from 'src/common/core.args';
import { UsersValidation } from '../entities/usersValidation.entity';

@InputType()
export class ValidateEmailInput extends PickType(UsersValidation, ['code']) {}

@ObjectType()
export class ValidateEmailOutput extends coreArgs {}
