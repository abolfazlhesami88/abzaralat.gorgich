import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    return { data: await this.wishlistService.findAll(userId) };
  }

  @Post(':productId')
  async toggle(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    return { data: await this.wishlistService.toggle(userId, productId) };
  }

  @Get(':productId/check')
  async check(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    return { data: await this.wishlistService.check(userId, productId) };
  }

  @Delete(':productId')
  async remove(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    return { data: await this.wishlistService.remove(userId, productId) };
  }
}
