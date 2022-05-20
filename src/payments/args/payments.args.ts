import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreArgs } from 'src/common/core.args';
import { Payment } from '../entities/payments.entity';

// ----------------CREATE PAYMENT ARGS----------------
@ObjectType()
export class CreatePaymentOutput extends CoreArgs {}

@InputType()
export class CreatePaymentInputType extends PickType(Payment, [
  'transactionId',
  'restaurantId',
]) {}

// ----------------GET PAYMENTS ARGS----------------
@ObjectType()
export class PaymentsOutput extends CoreArgs {
  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}

@InputType()
export class PaymentsInput extends PickType(Payment, [
  'transactionId',
  'restaurantId',
]) {}
