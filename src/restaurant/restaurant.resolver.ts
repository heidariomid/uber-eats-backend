import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  createRestaurantArgs,
  updateRestaurantArgsType,
} from './args/restaurant.args';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Resolver()
export class RestaurantResolver {
  //init
  constructor(private readonly restaurantService: RestaurantService) {}

  // get all Restaurant
  @Query(() => [Restaurant])
  async getAllRestaurant(): Promise<Restaurant[]> {
    return await this.restaurantService.getAllRestaurant();
  }
  // create Restaurant
  @Mutation(() => Restaurant)
  async createRestaurant(
    @Args('data') args: createRestaurantArgs,
  ): Promise<Restaurant> {
    return await this.restaurantService.createResuran(args);
  }
  // update Restaurant
  @Mutation(() => Boolean)
  async updateRestaurant(@Args() args: updateRestaurantArgsType) {
    return await this.restaurantService.updateResuran(args);
  }
}
