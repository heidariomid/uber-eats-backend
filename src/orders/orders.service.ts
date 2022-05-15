import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurant/entities/dish.entity';
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
import { OrderItem } from './entities/orderItem.entity';
import { Order } from './entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
    @InjectRepository(OrderItem)
    private readonly orderItem: Repository<OrderItem>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}
  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      // find restaurant
      const restaurant = await this.restaurant.findOne(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      // create order item
      let totalPrice = 0;
      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          throw new Error('Dish not found');
        }

        let dishFinalPrice = dish.price;
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );

          if (!dishOption) {
            throw new Error('Dish Option not found');
          }
          if (dishOption.extra) {
            dishFinalPrice += dishOption.extra;
          }
          if (dishOption.choices) {
            const dishOptionChoice = dishOption.choices.find(
              (dishOptionChoice) => dishOptionChoice.name === itemOption.choice,
            );
            if (dishOptionChoice && dishOptionChoice.extra) {
              dishFinalPrice += dishOptionChoice.extra;
            }
          }
        }
        totalPrice += dishFinalPrice;

        const orderItem = this.orderItem.create({
          dish,
          options: item.options,
        });
        await this.orderItem.save(orderItem);
      }

      // create order
      const order = this.orders.create({ customer, restaurant, totalPrice });

      await this.orders.save(order);

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
