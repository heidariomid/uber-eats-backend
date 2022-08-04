import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { NEW_PENDING_ORDER } from 'src/common/core.constants';
import { Order, OrderStatus } from 'src/orders/entities/orders.entity';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  CreatePaymentInputType,
  CreatePaymentOutput,
  PaymentsOutput,
  VerifyPaymentInputType,
  VerifyPaymentOutput,
} from './args/payments.args';
import { Payment } from './entities/payments.entity';
import OnlinePayment from './methods/OnlinePayment';
import OnlineGatewayFactory from './OnlineGatewayFactory';
import PaymentMethodFactory from './PaymentMethodFactory';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @Inject('PUB_SUB') private readonly pubsub: PubSub,
    private readonly paymentMethodFactory: PaymentMethodFactory,
    private readonly onlineGatewayFactory: OnlineGatewayFactory,
  ) {}
  async createPayment(
    owner: User,
    { payment_method, orderId }: CreatePaymentInputType,
  ): Promise<CreatePaymentOutput> {
    try {
      const order = await this.orders.findOne(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      const payment = await this.payments.save(
        this.payments.create({
          payment_method,
          payment_amount: order.totalPrice,
          transactionId: uuid(),
          user: owner,
          order,
        }),
      );
      const paymentProvider = this.paymentMethodFactory.make('online');
      if (paymentProvider instanceof OnlinePayment) {
        paymentProvider.setGateway('zarinpal');
      }
      const paymentResult = await paymentProvider.doPayment(payment);

      if (!paymentResult.success) {
        throw new Error('Something went wrong');
      }
      return {
        ok: paymentResult.success,
        message: 'Payment Created successfully',
        url: paymentResult.url,
      };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async verifyPayment(
    user: User,
    { refID, transactionId }: VerifyPaymentInputType,
  ): Promise<VerifyPaymentOutput> {
    try {
      const isUserValid = await this.payments.findOne({ user });
      if (!isUserValid) {
        throw new Error('User not found');
      }
      const payment = await this.payments.findOne({ transactionId });
      if (!payment) {
        throw new Error('Payment Reserve not found');
      }
      const verifyData = {
        amount: payment.payment_amount,
        refID,
      };
      const onlineGatewayProvider = this.onlineGatewayFactory.make('zarinpal');
      const paymentVerifyResult = await onlineGatewayProvider.paymentVerify(
        verifyData,
      );
      if (!paymentVerifyResult.success) {
        const orderId = payment.orderId;
        await this.orders.update(orderId, { status: OrderStatus.Failed });
        throw new Error('Something went wrong');
      }
      await this.pubsub.publish(NEW_PENDING_ORDER, {
        pendingPayments: { payment },
      });

      return {
        ok: paymentVerifyResult.success,
        message: 'Payment Created successfully',
        orderId: payment.orderId,
      };
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
}
