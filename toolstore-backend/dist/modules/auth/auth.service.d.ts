import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto, res: Response): Promise<{
        data: {
            accessToken: string;
            user: {
                id: any;
                email: any;
                firstName: any;
                lastName: any;
                role: any;
                avatarUrl: any;
            };
        };
        message: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        data: {
            accessToken: string;
            user: {
                id: any;
                email: any;
                firstName: any;
                lastName: any;
                role: any;
                avatarUrl: any;
            };
        };
        message: string;
    }>;
    logout(userId: string, res: Response): Promise<{
        message: string;
    }>;
    refreshTokens(userId: string, refreshToken: string, res: Response): Promise<{
        data: {
            accessToken: string;
            user: {
                id: any;
                email: any;
                firstName: any;
                lastName: any;
                role: any;
                avatarUrl: any;
            };
        };
        message: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("../../common/constants/app.constants").UserRole;
        avatarUrl: string;
        phone: string;
        createdAt: Date;
    }>;
    private generateTokensAndSetCookie;
}
