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
import { Order } from '../entities/orders.entity';

//create
@InputType()
export class CreateOrderInput extends PickType(Order, [
  'customer',
  'dishes',
  'driver',
  'restaurant',
  'status',
]) {
  @Field(() => Int)
  restaurantId: number;
}

@ObjectType()
export class CreateOrderOutput extends CoreArgs {}

// get orders
@ObjectType()
export class OrdersOutput extends CoreArgs {
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
// get order
@ObjectType()
export class OrderOutput extends PaginationOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}

@InputType()
export class OrderInputType extends PaginationInput {
  @Field(() => String)
  name: string;
}

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
export class EditOrderInput extends PartialType(CreateOrderInput) {
  @Field()
  orderId: number;
}

@ObjectType()
export class EditOrderOutput extends CoreArgs {}
