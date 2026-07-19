import { BrandsService } from './brands.service';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    findAll(): Promise<{
        data: import("./entities/brand.entity").Brand[];
    }>;
    findBySlug(slug: string): Promise<{
        data: import("./entities/brand.entity").Brand;
    }>;
}
