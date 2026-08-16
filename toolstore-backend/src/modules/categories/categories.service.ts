import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // ساختار درختی برای نمایش در navbar/sidebar فرانت (مرحله ۴)
  async findTree() {
    const categories = await this.categoryRepo.find({
      where: { isActive: true },
      relations: { children: true },
      order: { sortOrder: 'ASC' },
    });

    // فقط دستههای ریشه (بدون parent) را برمیگردانیم؛ children از قبل join شده
    return categories.filter((cat) => !cat.parentId);
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepo.findOne({
      where: { slug, isActive: true },
      relations: { children: true, parent: true },
    });

    if (!category) {
      throw new NotFoundException('دستهبندی یافت نشد');
    }

    return category;
  }
}
