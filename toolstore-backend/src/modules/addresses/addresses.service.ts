import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

const MAX_ADDRESSES = 5;

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async findAll(userId: string) {
    return this.addressRepo.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    const count = await this.addressRepo.count({ where: { userId } });
    if (count >= MAX_ADDRESSES) {
      throw new BadRequestException(`حداکثر ${MAX_ADDRESSES} آدرس میتوانید ثبت کنید`);
    }

    if (dto.isDefault || count === 0) {
      await this.addressRepo.update({ userId }, { isDefault: false });
    }

    const address = this.addressRepo.create({
      ...dto,
      userId,
      isDefault: dto.isDefault ?? count === 0,
    });

    return this.addressRepo.save(address);
  }

  async update(addressId: string, userId: string, dto: UpdateAddressDto) {
    const address = await this.findOne(addressId, userId);

    if (dto.isDefault) {
      await this.addressRepo.update({ userId }, { isDefault: false });
    }

    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  async remove(addressId: string, userId: string) {
    const address = await this.findOne(addressId, userId);
    await this.addressRepo.remove(address);

    if (address.isDefault) {
      const first = await this.addressRepo.findOne({
        where: { userId },
        order: { createdAt: 'ASC' },
      });
      if (first) {
        first.isDefault = true;
        await this.addressRepo.save(first);
      }
    }
  }

  async setDefault(addressId: string, userId: string) {
    await this.findOne(addressId, userId);
    await this.addressRepo.update({ userId }, { isDefault: false });
    await this.addressRepo.update(addressId, { isDefault: true });
    return this.findAll(userId);
  }

  private async findOne(addressId: string, userId: string) {
    const address = await this.addressRepo.findOne({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundException('آدرس یافت نشد');
    return address;
  }
}
