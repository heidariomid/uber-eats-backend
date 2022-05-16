import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User, UserRole } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
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
import { OrderItem } from './entities/orderItem.entity';
import { Order, OrderStatus } from './entities/orders.entity';

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
      const orderItems: OrderItem[] = [];
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

        const orderItemCreate = this.orderItem.create({
          dish,
          options: item.options,
        });
        const orderItem = await this.orderItem.save(orderItemCreate);
        orderItems.push(orderItem);
      }

      // create order
      const orderCreate = this.orders.create({
        customer,
        restaurant,
        totalPrice,
        items: orderItems,
      });

      const order = await this.orders.save(orderCreate);

      return { ok: true, message: 'Order Created successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async editOrder(
    user: User,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['restaurant'],
      });
      if (!order) {
        throw new Error('Order not found');
      }
      if (!this.canSeeOrder(user, order)) {
        throw new Error('You are not authorized to view this order');
      }
      let canEdit = false;

      //client
      if (user.role === UserRole.Client) {
        canEdit = false;
        throw new Error('You are not authorized to edit this order');
      }
      //owner
      if (user.role === UserRole.Owner) {
        if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
          canEdit = false;
          throw new Error('You are not authorized to edit this order');
        }
      }
      //delivery
      if (user.role === UserRole.Delivery) {
        if (
          status !== OrderStatus.PickedUp &&
          status !== OrderStatus.Delivered
        ) {
          canEdit = false;
          throw new Error('You are not authorized to edit this order');
        }
      }
      if (!canEdit) {
        throw new Error('You are not authorized to edit this order');
      }
      await this.orders.save([
        {
          id: orderId,
          status,
        },
      ]);
      return { ok: true, message: 'Order Updated successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async getOrderById(user: User, { id }: OrderInputType): Promise<OrderOutput> {
    try {
      const order = await this.orders.findOne(id, {
        relations: ['restaurant'],
      });
      if (!order) {
        throw new Error('Order not found');
      }
      if (!this.canSeeOrder(user, order)) {
        throw new Error('You are not authorized to view this order');
      }
      return { ok: true, message: 'Order Found successfully', order };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async getOrders(
    user: User,
    { status }: OrdersInputFilter,
  ): Promise<OrdersOutput> {
    try {
      let orders;
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: { customer: user, ...(status && { status }) },
        });
        return { ok: true, message: 'Orders Found successfully', orders };
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: { driver: user, ...(status && { status }) },
        });
        return { ok: true, message: 'Orders Found successfully', orders };
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.restaurant.find({
          relations: ['orders'],

          where: { owner: user },
        });
        orders = restaurants.map((restaurant) => restaurant.orders).flat(1);
        if (status) {
          orders = orders.filter((order: Order) => order.status === status);
        }
        return {
          ok: true,
          message: 'Orders Found successfully',
          orders,
        };
      }

      return { ok: true, message: 'Orders Found successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  canSeeOrder(user: User, order: Order): boolean {
    let canSee = true;
    if (user.role === UserRole.Client && order.customerId !== user.id) {
      canSee = false;
    } else if (user.role === UserRole.Delivery && order.driverId !== user.id) {
      canSee = false;
    } else if (
      user.role === UserRole.Owner &&
      order.restaurant.ownerId !== user.id
    ) {
      canSee = false;
    }
    return canSee;
  }
}
