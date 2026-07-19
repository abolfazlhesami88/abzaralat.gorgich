import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Repository } from 'typeorm';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/constants/app.constants';

@ApiTags('Admin — Categories')
@Controller('admin/categories')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminCategoriesController {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) {}

  @Get() async findAll() {
    return { data: await this.categoryRepo.find({ relations: { children: true, parent: true }, order: { sortOrder: 'ASC' } }) };
  }

  @Post() async create(@Body() dto: any) {
    const category = this.categoryRepo.create(dto as object);
    return { data: await this.categoryRepo.save(category) };
  }

  @Patch(':id') async update(@Param('id') id: string, @Body() dto: any) {
    await this.categoryRepo.update(id, dto);
    return { data: await this.categoryRepo.findOne({ where: { id } }) };
  }

  @Delete(':id') async remove(@Param('id') id: string) {
    await this.categoryRepo.delete(id);
    return { data: null };
  }
}
