import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/constants/app.constants';

@ApiTags('Admin — Dashboard')
@Controller('admin/dashboard')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return { data: await this.dashboardService.getStats() };
  }

  @Get('revenue')
  async getRevenue(@Query('period') period: '7d' | '30d' | '90d' = '30d') {
    return { data: await this.dashboardService.getRevenueChart(period) };
  }

  @Get('top-products')
  async getTopProducts() {
    return { data: await this.dashboardService.getTopProducts() };
  }

  @Get('low-stock')
  async getLowStock() {
    return { data: await this.dashboardService.getLowStockAlerts() };
  }

  @Get('recent-orders')
  async getRecentOrders() {
    return { data: await this.dashboardService.getRecentOrders() };
  }
}
