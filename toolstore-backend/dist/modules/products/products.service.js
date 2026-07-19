"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const query_products_dto_1 = require("./dto/query-products.dto");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let ProductsService = class ProductsService {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async findAll(query, includeInactive = false) {
        const qb = this.buildBaseQuery(includeInactive);
        if (query.categorySlug) {
            qb.andWhere('category.slug = :categorySlug', { categorySlug: query.categorySlug });
        }
        if (query.brandSlug) {
            qb.andWhere('brand.slug = :brandSlug', { brandSlug: query.brandSlug });
        }
        if (query.minPrice !== undefined) {
            qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
        }
        if (query.maxPrice !== undefined) {
            qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
        }
        if (query.minRating !== undefined) {
            qb.andWhere('product.averageRating >= :minRating', { minRating: query.minRating });
        }
        if (query.inStockOnly) {
            qb.andWhere('product.stock > 0');
        }
        if (query.search) {
            qb.andWhere(`product.search_vector @@ plainto_tsquery('simple', :search)`, { search: query.search });
            qb.addSelect(`ts_rank(product.search_vector, plainto_tsquery('simple', :search))`, 'search_rank');
        }
        this.applySorting(qb, query.sortBy, !!query.search);
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const [items, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findBySlug(slug) {
        const product = await this.productRepo.findOne({
            where: { slug, status: 'active' },
            relations: { category: true, brand: true, images: true, variants: true, specs: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('محصول یافت نشد');
        }
        this.incrementViewCount(product.id).catch(() => { });
        return product;
    }
    async findFeatured(limit = 8) {
        return this.productRepo.find({
            where: { status: 'active', isFeatured: true },
            relations: { category: true, brand: true, images: true },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async findNewArrivals(limit = 8) {
        return this.productRepo.find({
            where: { status: 'active', isNew: true },
            relations: { category: true, brand: true, images: true },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async findBestSellers(limit = 8) {
        return this.productRepo.find({
            where: { status: 'active' },
            relations: { category: true, brand: true, images: true },
            order: { soldCount: 'DESC' },
            take: limit,
        });
    }
    async findRelated(slug, limit = 4) {
        const product = await this.productRepo.findOne({ where: { slug } });
        if (!product || !product.categoryId)
            return [];
        return this.productRepo.find({
            where: {
                categoryId: product.categoryId,
                status: 'active',
            },
            relations: { category: true, brand: true, images: true },
            take: limit + 1,
        }).then((products) => products.filter((p) => p.id !== product.id).slice(0, limit));
    }
    buildBaseQuery(includeInactive) {
        const qb = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.brand', 'brand')
            .leftJoinAndSelect('product.images', 'images');
        if (!includeInactive) {
            qb.where('product.status = :status', { status: 'active' });
        }
        return qb;
    }
    applySorting(qb, sortBy, hasSearch) {
        if (hasSearch && !sortBy) {
            qb.orderBy('search_rank', 'DESC');
            return;
        }
        switch (sortBy) {
            case query_products_dto_1.ProductSortBy.PRICE_ASC:
                qb.orderBy('product.price', 'ASC');
                break;
            case query_products_dto_1.ProductSortBy.PRICE_DESC:
                qb.orderBy('product.price', 'DESC');
                break;
            case query_products_dto_1.ProductSortBy.BEST_SELLING:
                qb.orderBy('product.soldCount', 'DESC');
                break;
            case query_products_dto_1.ProductSortBy.RATING:
                qb.orderBy('product.averageRating', 'DESC');
                break;
            case query_products_dto_1.ProductSortBy.NAME_ASC:
                qb.orderBy('product.name', 'ASC');
                break;
            case query_products_dto_1.ProductSortBy.NEWEST:
            default:
                qb.orderBy('product.createdAt', 'DESC');
                break;
        }
    }
    async incrementViewCount(productId) {
        await this.productRepo.increment({ id: productId }, 'viewCount', 1);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map