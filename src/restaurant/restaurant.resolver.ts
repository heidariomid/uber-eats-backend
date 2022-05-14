import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorizeRole, AuthUser } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/users.entity';
import {
  CategoriesOutput,
  CategoryInputType,
  CategoryOutput,
} from './args/categories.args';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './args/deleteRestaurant.args';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './args/editRestaurant.args';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
  RestaurantInputType,
  RestaurantOutput,
  RestaurantsInput,
  RestaurantsOutput,
} from './args/restaurant.args';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './args/searchRestaurants.args';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  //init
  constructor(private readonly restaurantService: RestaurantService) {}

  // create Restaurant
  @Mutation(() => CreateRestaurantOutput)
  @AuthorizeRole(['Owner'])
  async createRestaurant(
    @AuthUser() user: User,
    @Args('data') args: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantService.createResuran(user, args);
  }

  // edit Restaurant
  @Mutation(() => EditRestaurantOutput)
  @AuthorizeRole(['Owner'])
  async editRestaurant(
    @AuthUser() user: User,
    @Args('data') args: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return await this.restaurantService.editRestaurant(user, args);
  }

  // delete Restaurant
  @Mutation(() => DeleteRestaurantOutput)
  @AuthorizeRole(['Owner'])
  async deleteRestaurant(
    @AuthUser() user: User,
    @Args('data') args: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return await this.restaurantService.deleteRestaurant(user, args);
  }

  // get all restaurants
  @Query(() => RestaurantsOutput)
  async getRestaurants(
    @Args('data') args: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return await this.restaurantService.getRestaurants(args);
  }

  // get restaurant by id
  @Query(() => RestaurantOutput)
  async getRestaurant(
    @Args('data') args: RestaurantInputType,
  ): Promise<RestaurantOutput> {
    return await this.restaurantService.getRestaurant(args);
  }

  // search restaurant by query
  @Query(() => SearchRestaurantOutput)
  async searchRestaurants(
    @Args('data') args: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return await this.restaurantService.searchRestaurants(args);
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @ResolveField(() => Int)
  async restaurantCount(@Parent() category: Category): Promise<number> {
    return await this.restaurantService.restaurantCount(category);
  }
  @Query(() => CategoriesOutput)
  async getCategories(): Promise<CategoriesOutput> {
    return await this.restaurantService.getCategories();
  }
  @Query(() => CategoryOutput)
  async getCategory(
    @Args('data') args: CategoryInputType,
  ): Promise<CategoryOutput> {
    return await this.restaurantService.getCategory(args);
  }
}
