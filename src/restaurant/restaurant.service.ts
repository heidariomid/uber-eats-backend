import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  createRestaurantInput,
  createRestaurantOutput,
} from './args/restaurant.args';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}

  async createResuran(
    owner: User,
    args: createRestaurantInput,
  ): Promise<createRestaurantOutput> {
    try {
      const newRestaurant = this.restaurant.create(args);
      newRestaurant.owner = owner;

      await this.restaurant.save(newRestaurant);
      return { ok: true, message: 'Restaurants Created successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
}
