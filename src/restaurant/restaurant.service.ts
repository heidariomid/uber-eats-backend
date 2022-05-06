import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createRestaurantArgs,
  updateRestaurantArgsType,
} from './args/restaurant.args';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}
  getAllRestaurant(): Promise<Restaurant[]> {
    return this.restaurant.find();
  }
  createResuran(args: createRestaurantArgs): Promise<Restaurant> {
    const newRestaurant = this.restaurant.create(args);
    return this.restaurant.save(newRestaurant);
  }
  async updateResuran(args: updateRestaurantArgsType): Promise<boolean> {
    const updated = await this.restaurant.update(args.id, { ...args.data });
    if (updated.affected > 0) {
      return true;
    }
    return false;
  }
}
