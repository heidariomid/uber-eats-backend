import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreArgs } from 'src/common/core.args';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'coverImg',
  'address',
]) {
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreArgs {}
