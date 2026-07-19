import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    findTree(): Promise<Category[]>;
    findBySlug(slug: string): Promise<Category>;
}
