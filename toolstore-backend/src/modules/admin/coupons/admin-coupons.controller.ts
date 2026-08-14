import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Repository } from 'typeorm';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/constants/app.constants';
import { paginate } from '../../../common/dto/pagination.dto';

@ApiTags('Admin — Coupons')
@Controller('admin/coupons')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminCouponsController {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepo: Repository<Coupon>,
  ) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    const safeLimit = Math.min(Number(limit) || 20, 500);
    const [items, total] = await this.couponRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (Number(page) - 1) * safeLimit,
      take: safeLimit,
    });
    return { data: paginate(items, total, Number(page), safeLimit) };
  }

  @Post()
  async create(@Body() dto: any) {
    if (dto.code) dto.code = dto.code.toUpperCase();
    return { data: await this.couponRepo.save(this.couponRepo.create(dto as object)) };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    await this.couponRepo.update(id, dto);
    return { data: await this.couponRepo.findOne({ where: { id } }) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponRepo.delete(id);
    return { data: null };
  }
}
