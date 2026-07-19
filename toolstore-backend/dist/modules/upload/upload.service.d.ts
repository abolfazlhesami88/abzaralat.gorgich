import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private readonly configService;
    constructor(configService: ConfigService);
    uploadProductImage(file: Express.Multer.File, productId: string): Promise<{
        url: string;
        thumbnailUrl: string;
        originalUrl: string;
        filename: string | undefined;
        originalName: string | undefined;
        path: string | undefined;
    }>;
    uploadAvatarImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    private validateFile;
}
