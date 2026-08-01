import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async createByPhone(phone: string): Promise<User> {
    const user = this.userRepository.create({
      phone,
      email: null,
      passwordHash: null,
      firstName: 'کاربر',
      lastName: 'گرگیچ',
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateRefreshToken(id: string, refreshToken: string, expiresAt: Date): Promise<void> {
    await this.userRepository.update(id, {
      refreshToken,
      refreshTokenExpiresAt: expiresAt,
    });
  }

  async clearRefreshToken(id: string): Promise<void> {
    await this.userRepository.update(id, {
      refreshToken: null,
      refreshTokenExpiresAt: null,
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    const isValid = await user.validatePassword(dto.currentPassword);
    if (!isValid) throw new BadRequestException('رمز عبور فعلی اشتباه است');

    user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    return this.userRepository.save(user);
  }

  async getDashboardStats(userId: string) {
    const [totalOrders, totalSpent, wishlistCount] = await Promise.all([
      this.dataSource.getRepository('orders').count({ where: { userId } }),
      this.dataSource.getRepository('orders')
        .createQueryBuilder('order')
        .select('COALESCE(SUM(order.total), 0)', 'total')
        .where('order.userId = :userId', { userId })
        .andWhere('order.paymentStatus = :status', { status: 'paid' })
        .getRawOne()
        .then((r) => Number(r?.total ?? 0)),
      this.dataSource.getRepository('wishlists').count({ where: { userId } }),
    ]);

    return { totalOrders, totalSpent, wishlistCount };
  }
}
