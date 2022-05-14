import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Like, Raw, Repository } from 'typeorm';
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
  CreateDishInput,
  CreateDishOutput,
  DeleteDishInput,
  DeleteDishOutput,
  EditDishInput,
  EditDishOutput,
} from './args/dishes.args';
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
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repo/category.repo';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
    private readonly categories: CategoryRepository,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
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
      const category = await this.categories.findOne({ slug });
      if (!category) {
        throw new Error('category not found');
      }
      const restaurants = await this.restaurant.find({
        where: { category },
        skip: (page - 1) * 10,
        take: 10,
      });
      category.restaurants = restaurants;
      const total = await this.restaurantCount(category);
      return {
        ok: true,
        message: 'category Founded Successfully',
        category,
        totalPages: Math.ceil(total / 10),
      };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
  async getRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalRestaurants] =
        await this.restaurant.findAndCount({
          skip: (page - 1) * 10,
          take: 10,
        });

      return {
        ok: true,
        message: 'Restaurants Founded Successfully',
        restaurants,
        totalRestaurants,
        totalPages: Math.ceil(totalRestaurants / 10),
      };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
  async getRestaurant({
    restaurantId,
  }: RestaurantInputType): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurant.findOne(restaurantId, {
        relations: ['menu'],
      });

      return {
        ok: true,
        message: 'Restaurant Founded Successfully',
        restaurant,
      };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
  async searchRestaurants({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalRestaurants] =
        await this.restaurant.findAndCount({
          where: {
            name: Raw((alias) => `${alias} ILIKE '%${query}%'`),
          },
          skip: (page - 1) * 10,
          take: 10,
        });
      return {
        ok: true,
        message: 'Restaurants Founded Successfully',
        restaurants,
        totalRestaurants,
        totalPages: Math.ceil(totalRestaurants / 10),
      };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async createDish(
    owner: User,
    args: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      // find restaurant
      const restaurant = await this.restaurant.findOne(args.restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      // check restaurant owner is same as user
      if (owner.id !== restaurant.ownerId) {
        throw new Error('You are not authorized to create this dish');
      }
      // create new dish
      const dish = this.dishes.create({ ...args, restaurant });
      await this.dishes.save(dish);
      // return result
      return { ok: true, message: 'Dish Created successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async deleteDish(
    owner: User,
    args: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishes.findOne(args.dishId, {
        relations: ['restaurant'],
      });
      if (!dish) {
        throw new Error('Dish not found');
      }
      if (owner.id !== dish.restaurant.ownerId) {
        throw new Error('You are not authorized to edit this dish');
      }
      await this.dishes.delete(args.dishId);
      return { ok: true, message: 'Dish Deleted successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  async editDish(owner: User, args: EditDishInput): Promise<EditDishOutput> {
    try {
      const dish = await this.dishes.findOne(args.dishId, {
        relations: ['restaurant'],
      });
      if (!dish) {
        throw new Error('Dish not found');
      }
      if (owner.id !== dish.restaurant.ownerId) {
        throw new Error('You are not authorized to edit this dish');
      }
      await this.dishes.save([
        {
          id: args.dishId,
          ...args,
        },
      ]);
      return { ok: true, message: 'Dish Updated successfully' };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
}
