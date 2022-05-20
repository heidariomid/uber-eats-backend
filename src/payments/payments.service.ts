import { Inject, Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { NEW_PENDING_ORDER } from 'src/common/core.constants';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/users/entities/users.entity';
import { LessThan, Repository } from 'typeorm';
import {
  CreatePaymentInputType,
  CreatePaymentOutput,
  PaymentsOutput,
} from './args/payments.args';
import { Payment } from './entities/payments.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Payment>,
    @Inject('PUB_SUB') private readonly pubsub: PubSub,
  ) {}
  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInputType,
  ): Promise<CreatePaymentOutput> {
    try {
      // find restaurant
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      if (restaurant.ownerId !== owner.id) {
        throw new Error('you are not the owner of this restaurant');
      }
      restaurant.isPromoted = true;
      const date = new Date();
      date.setDate(date.getDate() + 7);
      restaurant.promotedUntil = date;

      const payment = await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );
      this.restaurants.save(restaurant);
      await this.pubsub.publish(NEW_PENDING_ORDER, {
        pendingPayments: { payment },
      });
      return { ok: true, message: 'Payment Created successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
  async Payments(user: User): Promise<PaymentsOutput> {
    try {
      const payments = await this.payments.find({ user });
      return { ok: true, payments };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  // @Interval(2000)
  async checkPromotion() {
    const restaurants = await this.restaurants.find({
      isPromoted: true,
      promotedUntil: LessThan(new Date()),
    });

    restaurants.forEach(async (restaurant) => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurants.save(restaurant);
    });
  }
}
