import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import {
  NEW_COOKED_ORDER,
  NEW_PENDING_ORDER,
  NEW_UPDATE_ORDER,
} from 'src/common/core.constants';
import { Dish } from 'src/restaurant/entities/dish.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User, UserRole } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateOrderInput,
  CreateOrderOutput,
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
    @Inject('PUB_SUB') private readonly pubsub: PubSub,
  ) {}

  async createOrder(
    customer: User,
    { items, restaurantId, totalPrice }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      // find restaurant
      const restaurant = await this.restaurant.findOne(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.dishes.findOne(item.id);
        if (!dish) {
          throw new Error('Dish not found');
        }
        if (item?.options) {
          for (const itemOption of item?.options) {
            const dishOption = dish.options.find(
              (dishOption) => dishOption.name === itemOption.name,
            );

            if (!dishOption) {
              throw new Error('Dish Option not found');
            }
          }
        }
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
      await this.pubsub.publish(NEW_PENDING_ORDER, {
        pendingOrders: { order, ownerId: restaurant.ownerId },
      });
      return {
        ok: true,
        message: 'Great ! Order Created successfully',
        orderId: order.id,
      };
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
        loadEagerRelations: true,
      });
      if (!order) {
        throw new Error('Order not found');
      }
      if (!this.canSeeOrder(user, order)) {
        throw new Error('You are not authorized to view this order');
      }
      let canEdit = true;

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
        throw new Error('You are not authorized to seeeeee edit this order');
      }
      await this.orders.save({
        id: orderId,
        status,
      });
      if (user.role === UserRole.Owner) {
        if (status === OrderStatus.Cooked) {
          await this.pubsub.publish(NEW_COOKED_ORDER, {
            cookedOrders: { ...order, status },
          });
        }
      }

      await this.pubsub.publish(NEW_UPDATE_ORDER, {
        updateOrders: { ...order, status },
      });

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

  async takeOrder(driver: User, { id }: OrderInputType): Promise<OrderOutput> {
    try {
      const order = await this.orders.findOne(id, {
        relations: ['restaurant'],
      });
      if (!order) {
        throw new Error('Order not found');
      }
      await this.orders.save({
        id: order.id,
        driver,
      });
      await this.pubsub.publish(NEW_UPDATE_ORDER, {
        updateOrders: { ...order, driver },
      });
      return { ok: true, message: 'Order Updated successfully' };
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
