import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
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
} from './args/restaurant.args';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repo/category.repo';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
    private readonly categories: CategoryRepository,
  ) {}

  async createResuran(
    owner: User,
    args: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurant.create(args);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(args.categoryName);
      newRestaurant.category = category;
      await this.restaurant.save(newRestaurant);
      return { ok: true, message: 'Restaurants Created successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async editRestaurant(
    owner: User,
    args: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurant.findOne(args.restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      if (owner.id !== restaurant.ownerId) {
        throw new Error('You are not authorized to edit this restaurant');
      }
      let category: Category = null;
      if (args?.categoryName) {
        category = await this.categories.getOrCreate(args.categoryName);
      }
      await this.restaurant.save([
        {
          id: args.restaurantId,
          ...args,
          ...(category && { category }),
        },
      ]);
      return { ok: true, message: 'Restaurants Updated successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async deleteRestaurant(
    owner: User,
    args: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurant.findOne(args.restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      if (owner.id !== restaurant.ownerId) {
        throw new Error('You are not authorized to delete this restaurant');
      }
      await this.restaurant.delete(args.restaurantId);
      return { ok: true, message: 'Restaurant Deleted successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async getCategories(): Promise<CategoriesOutput> {
    try {
      const categories = await this.categories.find();
      if (!categories) {
        throw new Error('Categories not found');
      }

      return {
        ok: true,
        message: 'Categories Founded Successfully',
        categories,
      };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async restaurantCount(category: Category): Promise<number> {
    return this.restaurant.count({ category });
  }
  async getCategory({
    slug,
    page,
  }: CategoryInputType): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne(
        { slug },
        { relations: ['restaurants'] },
      );
      if (!category) {
        throw new Error('category not found');
      }

      return {
        ok: true,
        message: 'category Founded Successfully',
        category,
        totalPages: 2,
      };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
}
