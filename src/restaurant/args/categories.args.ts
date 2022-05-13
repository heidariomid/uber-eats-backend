import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreArgs } from 'src/common/core.args';
import { PaginationInput, PaginationOutput } from 'src/common/pagination.args';
import { Category } from '../entities/category.entity';

@ObjectType()
export class CategoriesOutput extends CoreArgs {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field(() => Category, { nullable: true })
  category?: Category;
}

@InputType()
export class CategoryInputType extends PaginationInput {
  @Field(() => String)
  slug: string;
}