import {
  Controller, Get, Post, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'ثبت سفارش از سبد خرید' })
  async checkout(
    @Body() dto: CheckoutDto,
    @CurrentUser('sub') userId: string,
  ) {
    return { data: await this.ordersService.checkout(userId, dto) };
  }

  @Get()
  @ApiOperation({ summary: 'لیست سفارشات کاربر' })
  async findAll(@CurrentUser('sub') userId: string) {
    return { data: await this.ordersService.findUserOrders(userId) };
  }

  @Get(':orderNumber')
  @ApiOperation({ summary: 'جزئیات یک سفارش' })
  async findOne(
    @Param('orderNumber') orderNumber: string,
    @CurrentUser('sub') userId: string,
  ) {
    return { data: await this.ordersService.findByOrderNumber(orderNumber, userId) };
  }

  @Post(':orderNumber/cancel')
  @ApiOperation({ summary: 'لغو سفارش' })
  async cancel(
    @Param('orderNumber') orderNumber: string,
    @CurrentUser('sub') userId: string,
  ) {
    return { data: await this.ordersService.cancelOrder(orderNumber, userId) };
  }
}
