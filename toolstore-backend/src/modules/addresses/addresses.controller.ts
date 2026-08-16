import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    return { data: await this.addressesService.findAll(userId) };
  }

  @Post()
  async create(@CurrentUser('sub') userId: string, @Body() dto: CreateAddressDto) {
    return { data: await this.addressesService.create(userId, dto) };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return { data: await this.addressesService.update(id, userId, dto) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    await this.addressesService.remove(id, userId);
    return { data: null, message: 'آدرس حذف شد' };
  }

  @Post(':id/set-default')
  async setDefault(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return { data: await this.addressesService.setDefault(id, userId) };
  }
}
