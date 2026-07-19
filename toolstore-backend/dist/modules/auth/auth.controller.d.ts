import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(user: any, req: Request, res: Response): Promise<{
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
}
