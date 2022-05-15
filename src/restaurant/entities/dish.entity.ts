import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne, RelationId } from 'typeorm';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/core.entity';
import { Restaurant } from './restaurant.entity';
import { Order } from 'src/orders/entities/orders.entity';

@InputType('DishChoiceInput', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  extra?: number;
}
@InputType('DishOptionInput', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field(() => String)
  name: string;

  @Field(() => [String], { nullable: true })
  choices?: DishChoice[];

  @Field(() => Int, { nullable: true })
  extra?: number;
}

@InputType('DishInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  photo?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  @Length(5, 50)
  description?: string;

  @Field(() => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  @Field(() => [DishOption], { nullable: true })
  @Column('json', { nullable: true })
  options?: DishOption[];
}
