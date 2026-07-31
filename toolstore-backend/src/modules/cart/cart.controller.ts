import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, ApplyCouponDto } from './dto/add-to-cart.dto';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { Request } from 'express';

// این guard اگر token بود user را ست میکند، اگر نبود null برمیگرداند
// سبد خرید هم برای Guest و هم لاگینکرده کار میکند
@ApiTags('Cart')
@Controller('cart')
@UseGuards(OptionalJwtGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getIds(user: any, req: Request) {
    return {
      userId: user?.sub ?? undefined,
      sessionId: !user?.sub ? req.headers['x-session-id'] as string : undefined,
    };
  }

  @Get()
  @ApiOperation({ summary: 'دریافت سبد خرید' })
  async getCart(@CurrentUser() user: any, @Req() req: any) {
    const { userId, sessionId } = this.getIds(user, req);
    return { data: await this.cartService.getCartSummary(userId, sessionId) };
  }

  @Post('items')
  @ApiOperation({ summary: 'افزودن محصول به سبد' })
  async addItem(
    @Body() dto: AddToCartDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const { userId, sessionId } = this.getIds(user, req);
    return { data: await this.cartService.addItem(dto, userId, sessionId) };
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'تغییر تعداد آیتم' })
  async updateItem(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const { userId, sessionId } = this.getIds(user, req);
    return { data: await this.cartService.updateItem(id, quantity, userId, sessionId) };
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'حذف آیتم از سبد' })
  async removeItem(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const { userId, sessionId } = this.getIds(user, req);
    return { data: await this.cartService.removeItem(id, userId, sessionId) };
  }

  @Post('apply-coupon')
  @ApiOperation({ summary: 'اعمال کد تخفیف' })
  async applyCoupon(
    @Body() dto: ApplyCouponDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const { userId, sessionId } = this.getIds(user, req);
    return { data: await this.cartService.applyCoupon(dto.couponCode, userId, sessionId) };
  }

  @Delete('coupon')
  @ApiOperation({ summary: 'حذف کد تخفیف' })
  async removeCoupon(
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const { userId, sessionId } = this.getIds(user, req);
    return { data: await this.cartService.removeCoupon(userId, sessionId) };
  }

  @Post('remove-coupon')
  @ApiOperation({ summary: 'حذف کد تخفیف' })
  async removeCouponPost(
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    const { userId, sessionId } = this.getIds(user, req);
    return { data: await this.cartService.removeCoupon(userId, sessionId) };
  }

  @Post('merge-guest')
  @ApiOperation({ summary: 'همگامسازی سبد Guest بعد از لاگین' })
  async mergeGuest(
    @Body('sessionId') sessionId: string,
    @CurrentUser() user: any,
  ) {
    if (!user?.sub) return { data: null };
    await this.cartService.mergeGuestCart(sessionId, user.sub);
    return { data: await this.cartService.getCartSummary(user.sub) };
  }
}
