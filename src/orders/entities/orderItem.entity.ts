import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/core.entity';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field(() => Number)
  id: number;
  @Field(() => String)
  name: string;

  @Field(() => Number)
  extra: number;

}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  @Field(() => Dish)
  @ManyToOne(() => Dish, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  dish: Dish;

  @Field(() => [OrderItemOption], { nullable: true })
  @Column('json', { nullable: true })
  options?: OrderItemOption[];
}
