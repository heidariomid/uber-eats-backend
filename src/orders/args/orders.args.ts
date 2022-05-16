import {
  ArgsType,
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreArgs } from 'src/common/core.args';
import { PaginationInput, PaginationOutput } from 'src/common/pagination.args';
import { OrderItemOption } from '../entities/orderItem.entity';
import { Order, OrderStatus } from '../entities/orders.entity';

//create custom
@InputType()
class CreateOrderItemInput {
  @Field(() => Int)
  dishId: number;

  @Field(() => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}
//create
@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  restaurantId: number;

  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreArgs {}

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
