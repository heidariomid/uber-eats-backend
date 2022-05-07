import { InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreArgs } from 'src/common/core.args';
import { CreateRestaurantInput } from './restaurant.args';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {}

@ObjectType()
export class EditRestaurantOutput extends CoreArgs {}
