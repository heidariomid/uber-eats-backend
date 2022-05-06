import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { coreArgs } from 'src/common/core.args';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class createRestaurantInput extends PickType(Restaurant, [
  'name',
  'coverImg',
  'address',
]) {
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class createRestaurantOutput extends coreArgs {}
