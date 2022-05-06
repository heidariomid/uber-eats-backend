import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entities/users.entity';

@InputType('RestaurantInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(3, 10)
  name: string;

  @Field(() => String)
  @Column()
  @IsString()
  @Length(3, 10)
  coverImg: string;

  @Field(() => String)
  @Column()
  @IsString()
  @Length(3, 10)
  address: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.restaurants)
  owner: User;
}
