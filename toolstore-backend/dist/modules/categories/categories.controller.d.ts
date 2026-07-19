import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findTree(): Promise<{
        data: import("./entities/category.entity").Category[];
    }>;
    findBySlug(slug: string): Promise<{
        data: import("./entities/category.entity").Category;
    }>;
}
