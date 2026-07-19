import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
export declare class BrandsService {
    private readonly brandRepo;
    constructor(brandRepo: Repository<Brand>);
    findAll(): Promise<Brand[]>;
    findBySlug(slug: string): Promise<Brand>;
}
