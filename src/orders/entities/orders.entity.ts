import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/core.entity';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
  Delivered = 'Delivered',
  PickedUp = 'PickedUp',
  Cooking = 'Cooking',
}
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@InputType('OrdersInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  customer?: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.rides, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  driver?: User;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  restaurant?: Restaurant;

  @Field(() => [Dish])
  @ManyToMany(() => Dish)
  @JoinTable()
  dishes: Dish[];

  @Field(() => OrderStatus)
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  totalPrice?: number;
}
