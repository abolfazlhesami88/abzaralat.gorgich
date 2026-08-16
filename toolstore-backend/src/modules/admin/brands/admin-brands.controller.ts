import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { Repository } from 'typeorm';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/constants/app.constants';

@ApiTags('Admin — Brands')
@Controller('admin/brands')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminBrandsController {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
  ) {}

  @Get() async findAll() {
    return { data: await this.brandRepo.find({ order: { name: 'ASC' } }) };
  }

  @Post() async create(@Body() dto: any) {
    return { data: await this.brandRepo.save(this.brandRepo.create(dto as object)) };
  }

  @Patch(':id') async update(@Param('id') id: string, @Body() dto: any) {
    await this.brandRepo.update(id, dto);
    return { data: await this.brandRepo.findOne({ where: { id } }) };
  }

  @Delete(':id') async remove(@Param('id') id: string) {
    await this.brandRepo.delete(id);
    return { data: null };
  }
}
