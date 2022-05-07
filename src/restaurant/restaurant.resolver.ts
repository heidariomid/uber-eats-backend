import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizeRole, AuthUser } from 'src/auth/auth.decorator';
import { User } from 'src/users/entities/users.entity';
import {
  createRestaurantInput,
  createRestaurantOutput,
} from './args/restaurant.args';
import { RestaurantService } from './restaurant.service';

@Resolver()
export class RestaurantResolver {
  //init
  constructor(private readonly restaurantService: RestaurantService) {}

  // create Restaurant
  @Mutation(() => createRestaurantOutput)
  @AuthorizeRole(['Owner'])
  async createRestaurant(
    @AuthUser() user: User,
    @Args('data') args: createRestaurantInput,
  ): Promise<createRestaurantOutput> {
    return await this.restaurantService.createResuran(user, args);
  }
}
