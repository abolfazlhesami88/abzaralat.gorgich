import { Category } from '../../categories/entities/category.entity';
import { Repository } from 'typeorm';
export declare class AdminCategoriesController {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    findAll(): Promise<{
        data: Category[];
    }>;
    create(dto: any): Promise<{
        data: Category;
    }>;
    update(id: string, dto: any): Promise<{
        data: Category | null;
    }>;
    remove(id: string): Promise<{
        data: null;
    }>;
}
