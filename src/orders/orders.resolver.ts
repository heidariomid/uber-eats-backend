import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizeRole, AuthUser } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/users.entity';
import {
  CreateOrderInput,
  CreateOrderOutput,
  DeleteOrderInput,
  DeleteOrderOutput,
  EditOrderInput,
  EditOrderOutput,
  OrderInputType,
  OrderOutput,
  OrdersInputFilter,
  OrdersOutput,
} from './args/orders.args';
import { OrdersService } from './orders.service';

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  // create order
  @Mutation(() => CreateOrderOutput)
  @AuthorizeRole(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('data') args: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return await this.ordersService.createOrder(customer, args);
  }

  // edit order
  @Mutation(() => EditOrderOutput)
  @AuthorizeRole(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('data') args: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return await this.ordersService.editOrder(user, args);
  }

  // get all orders
  @Mutation(() => OrdersOutput)
  @AuthorizeRole(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('data') args: OrdersInputFilter,
  ): Promise<OrderOutput> {
    return await this.ordersService.getOrders(user, args);
  }

  // get order by id
  @Mutation(() => OrderOutput)
  @AuthorizeRole(['Client', 'Owner'])
  async getOrderById(
    @AuthUser() user: User,
    @Args('data') args: OrderInputType,
  ): Promise<OrderOutput> {
    return await this.ordersService.getOrderById(user, args);
  }
}
