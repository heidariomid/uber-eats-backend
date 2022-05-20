import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/core.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  transactionId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @RelationId((payment: Payment) => payment.user)
  userId?: number;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;

  @Field(() => Int)
  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId?: number;
  ownerId: number;
  isPromoted: boolean;
  promotedUntil: Date;
}
