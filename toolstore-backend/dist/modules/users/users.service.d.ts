import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersService {
    private readonly userRepository;
    private readonly dataSource;
    constructor(userRepository: Repository<User>, dataSource: DataSource);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateRefreshToken(id: string, refreshToken: string, expiresAt: Date): Promise<void>;
    clearRefreshToken(id: string): Promise<void>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<User>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<User>;
    getDashboardStats(userId: string): Promise<{
        totalOrders: number;
        totalSpent: number;
        wishlistCount: number;
    }>;
}
