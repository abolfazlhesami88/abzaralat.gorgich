import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async findAll() {
    return this.brandRepo.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findBySlug(slug: string) {
    const brand = await this.brandRepo.findOne({ where: { slug, isActive: true } });
    if (!brand) {
      throw new NotFoundException('برند یافت نشد');
    }
    return brand;
  }
}
