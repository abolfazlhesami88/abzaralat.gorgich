import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProductImage(file: Express.Multer.File): Promise<{
        data: {
            url: string;
            thumbnailUrl: string;
            originalUrl: string;
            filename: string | undefined;
            originalName: string | undefined;
            path: string | undefined;
        };
    }>;
}
