import { Brand } from '../../brands/entities/brand.entity';
import { Repository } from 'typeorm';
export declare class AdminBrandsController {
    private readonly brandRepo;
    constructor(brandRepo: Repository<Brand>);
    findAll(): Promise<{
        data: Brand[];
    }>;
    create(dto: any): Promise<{
        data: Brand;
    }>;
    update(id: string, dto: any): Promise<{
        data: Brand | null;
    }>;
    remove(id: string): Promise<{
        data: null;
    }>;
}
