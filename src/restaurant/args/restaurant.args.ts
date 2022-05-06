import {
  ArgsType,
  Field,
  InputType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class createRestaurantArgs extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {}

@InputType()
class updateRestaurantInputType extends PartialType(createRestaurantArgs) {}

@ArgsType()
export class updateRestaurantArgsType {
  @Field(() => Number)
  id: number;
  @Field(() => updateRestaurantInputType)
  data: updateRestaurantInputType;
}
