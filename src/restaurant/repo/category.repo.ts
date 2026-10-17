import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getOrCreate(args): Promise<Category> {
    const categoryName = args.name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/\s+/g, '-');
    let category = await this.findOne({
      where: { slug: categorySlug },
    });
    if (!category) {
      category = this.create({
        name: categoryName,
        slug: categorySlug,
        iconImg: args.iconImg,
      });
      await this.save(category);
    }
    return category;
  }
}
