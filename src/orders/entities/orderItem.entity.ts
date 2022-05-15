import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/core.entity';
import { Dish, DishOption } from 'src/restaurant/entities/dish.entity';
import { Column, Entity } from 'typeorm';

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  @Field(() => Dish)
  dishe: Dish;

  @Field(() => [DishOption], { nullable: true })
  @Column('json', { nullable: true })
  options?: DishOption[];
}
