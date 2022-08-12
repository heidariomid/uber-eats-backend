import {
  ArgsType,
  Field,
  InputType,
  Int,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { CoreArgs } from 'src/common/core.args';
import { PaginationOutput } from 'src/common/pagination.args';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { Order, OrderStatus } from '../entities/orders.entity';

@InputType('DishQuantityInputType', { isAbstract: true })
export class DishQuantity {
  @Field(() => Number)
  id: number;
  @Field(() => Number)
  quantity: number;
}

@InputType('DishOptionQuantitInputType', { isAbstract: true })
export class DishOptionQuantity {
  @Field(() => Number)
  id: number;
  @Field(() => Number)
  quantity: number;
}
//create
@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  restaurantId: number;

  @Field(() => Number)
  totalPrice: number;

  @Field(() => [DishOptionQuantity], { nullable: true })
  dishOptionQuantity: [DishOptionQuantity];

  @Field(() => [DishQuantity])
  dishQuantity: [DishQuantity];
}

@ObjectType()
export class CreateOrderOutput extends CoreArgs {
  @Field(() => Int, { nullable: true })
  orderId?: number;
}

// get orders
@ObjectType()
export class OrdersOutput extends CoreArgs {
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
// get orders
@InputType()
export class OrdersInputFilter extends CoreArgs {
  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;
}
// get order
@ObjectType()
export class OrderOutput extends PaginationOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}

@InputType()
export class OrderInputType extends PickType(Order, ['id']) {}

// delete order
@ArgsType()
export class DeleteOrderInput {
  @Field()
  orderId: number;
}

@ObjectType()
export class DeleteOrderOutput extends CoreArgs {}

// edit order
@InputType()
export class EditOrderInput extends PickType(Order, ['id', 'status']) {}

@ObjectType()
export class EditOrderOutput extends CoreArgs {}
