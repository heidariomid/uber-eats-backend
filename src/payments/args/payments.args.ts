import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreArgs } from 'src/common/core.args';
import { Payment } from '../entities/payments.entity';

// ----------------CREATE PAYMENT ARGS----------------
@ObjectType()
export class CreatePaymentOutput extends CoreArgs {
  @Field({ nullable: true })
  url?: string;
}

@InputType()
export class CreatePaymentInputType extends PickType(Payment, [
  'payment_method',
  'orderId',
]) {}

// ----------------VERIFY PAYMENT ARGS----------------
@ObjectType()
export class VerifyPaymentOutput extends CoreArgs {
  @Field({ nullable: true })
  orderId?: number;
}

@InputType()
export class VerifyPaymentInputType {
  @Field()
  transactionId: string;
  @Field()
  refID: string;
}

// ----------------GET PAYMENTS ARGS----------------
@ObjectType()
export class PaymentsOutput extends CoreArgs {
  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}

@InputType()
export class PaymentsInput extends PickType(Payment, [
  'payment_method',
  'orderId',
]) {}
