import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminCustomersService } from './admin-customers.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/constants/app.constants';

@ApiTags('Admin — Customers')
@Controller('admin/customers')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminCustomersController {
  constructor(private readonly service: AdminCustomersService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return { data: await this.service.findAll(Number(page) || 1, Number(limit) || 20, search) };
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return { data: await this.service.getDetail(id) };
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return { data: await this.service.toggleActive(id) };
  }
}
