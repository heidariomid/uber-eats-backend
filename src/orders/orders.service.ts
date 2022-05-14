import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateOrderInput,
  CreateOrderOutput,
  DeleteOrderInput,
  DeleteOrderOutput,
  EditOrderInput,
  EditOrderOutput,
} from './args/orders.args';
import { Order } from './entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}
  async createOrder(
    owner: User,
    args: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      // find restaurant
      const restaurant = await this.restaurant.findOne(args.restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      // check restaurant owner is same as user
      if (owner.id !== restaurant.ownerId) {
        throw new Error('You are not authorized to create this order');
      }
      // create new order
      const order = this.orders.create({ ...args, restaurant });
      await this.orders.save(order);
      // return result
      return { ok: true, message: 'Order Created successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async deleteOrder(
    owner: User,
    args: DeleteOrderInput,
  ): Promise<DeleteOrderOutput> {
    try {
      const order = await this.orders.findOne(args.orderId, {
        relations: ['restaurant'],
      });
      if (!order) {
        throw new Error('Order not found');
      }
      if (owner.id !== order.restaurant.ownerId) {
        throw new Error('You are not authorized to edit this order');
      }
      await this.orders.delete(args.orderId);
      return { ok: true, message: 'Order Deleted successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async editOrder(owner: User, args: EditOrderInput): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(args.orderId, {
        relations: ['restaurant'],
      });
      if (!order) {
        throw new Error('Order not found');
      }
      if (owner.id !== order.restaurant.ownerId) {
        throw new Error('You are not authorized to edit this order');
      }
      await this.orders.save([
        {
          id: args.orderId,
          ...args,
        },
      ]);
      return { ok: true, message: 'Order Updated successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
}
