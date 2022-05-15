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
} from './args/orders.args';
import { OrdersService } from './orders.service';

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  // create order
  @Mutation(() => CreateOrderOutput)
  @AuthorizeRole(['Client'])
  async createOrder(
    @AuthUser() owner: User,
    @Args('data') args: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return await this.ordersService.createOrder(owner, args);
  }

  // delete order
  @Mutation(() => DeleteOrderOutput)
  @AuthorizeRole(['Owner'])
  async deleteOrder(
    @AuthUser() owner: User,
    @Args() args: DeleteOrderInput,
  ): Promise<DeleteOrderOutput> {
    return await this.ordersService.deleteOrder(owner, args);
  }

  // edit order
  @Mutation(() => EditOrderOutput)
  @AuthorizeRole(['Owner'])
  async editOrder(
    @AuthUser() owner: User,
    @Args('data') args: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return await this.ordersService.editOrder(owner, args);
  }
}
