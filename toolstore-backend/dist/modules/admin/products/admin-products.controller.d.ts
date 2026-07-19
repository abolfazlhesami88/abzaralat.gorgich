import { AdminProductsService } from './admin-products.service';
import type { AdminProductQuery, CreateProductDto } from './admin-products.service';
import { UploadService } from '../../upload/upload.service';
export declare class AdminProductsController {
    private readonly adminProductsService;
    private readonly uploadService;
    constructor(adminProductsService: AdminProductsService, uploadService: UploadService);
    findAll(query: AdminProductQuery): Promise<{
        data: import("../../../common/dto/pagination.dto").PaginatedResult<import("../../products/entities/product.entity").Product>;
    }>;
    findOne(id: string): Promise<{
        data: import("../../products/entities/product.entity").Product;
    }>;
    create(dto: CreateProductDto): Promise<{
        data: import("../../products/entities/product.entity").Product;
    }>;
    update(id: string, dto: Partial<CreateProductDto>): Promise<{
        data: import("../../products/entities/product.entity").Product;
    }>;
    remove(id: string): Promise<{
        data: null;
        message: string;
    }>;
    addImage(id: string, file: Express.Multer.File, primary?: string): Promise<{
        data: import("../../products/entities/product-image.entity").ProductImage;
    }>;
    removeImage(id: string, imageId: string): Promise<{
        data: null;
    }>;
    reorderImages(id: string, imageIds: string[]): Promise<{
        data: null;
    }>;
    bulkUpdateStatus(ids: string[], status: string): Promise<{
        data: {
            updated: number;
        };
    }>;
}
