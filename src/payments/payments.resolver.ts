import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthorizeRole, AuthUser } from 'src/auth/auth.decorator';
import { NEW_PENDING_ORDER } from 'src/common/core.constants';
import { User } from 'src/users/entities/users.entity';
import {
  CreatePaymentInputType,
  CreatePaymentOutput,
  PaymentsInput,
  PaymentsOutput,
} from './args/payments.args';
import { Payment } from './entities/payments.entity';
import { PaymentsService } from './payments.service';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject('PUB_SUB') private readonly pubsub: PubSub,
  ) {}

  // create payment
  @Mutation(() => CreatePaymentOutput)
  @AuthorizeRole(['Owner'])
  async createPayment(
    @AuthUser() owner: User,
    @Args('data') args: CreatePaymentInputType,
  ): Promise<CreatePaymentOutput> {
    return await this.paymentsService.createPayment(owner, args);
  }

  // get payment by id
  @Query(() => PaymentsOutput)
  @AuthorizeRole(['Owner'])
  async Payments(@AuthUser() user: User): Promise<PaymentsOutput> {
    return await this.paymentsService.Payments(user);
  }

  // --------------------SUBSCRIPTION----------------------

  // create payment subscription
  @Subscription(() => Payment, {
    filter: ({ pendingPayments }, _, { user }) =>
      pendingPayments?.ownerId === user?.id,

    resolve: ({ pendingPayments }) => pendingPayments.payment,
  })
  @AuthorizeRole(['Owner'])
  pendingPayments() {
    return this.pubsub.asyncIterator(NEW_PENDING_ORDER);
  }
}
