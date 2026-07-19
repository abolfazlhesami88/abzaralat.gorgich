import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UploadService } from '../upload/upload.service';
export declare class UsersController {
    private readonly usersService;
    private readonly uploadService;
    constructor(usersService: UsersService, uploadService: UploadService);
    getDashboard(userId: string): Promise<{
        data: {
            totalOrders: number;
            totalSpent: number;
            wishlistCount: number;
        };
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        data: import("./entities/user.entity").User;
    }>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<{
        data: {
            avatarUrl: string;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        data: null;
        message: string;
    }>;
}
