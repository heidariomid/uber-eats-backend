import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/core.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  payment_method: string;

  @Field(() => Number, { nullable: true })
  @Column('decimal', { nullable: true })
  payment_amount?: number;

  @Field(() => String)
  @Column()
  @IsString()
  transactionId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @RelationId((payment: Payment) => payment.user)
  userId?: number;

  @Field(() => Order)
  @ManyToOne(() => Order)
  order: Order;

  @Field(() => Int)
  @RelationId((payment: Payment) => payment.order)
  orderId?: number;
}
