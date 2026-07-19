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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../../products/entities/product.entity");
const product_image_entity_1 = require("../../products/entities/product-image.entity");
const product_spec_entity_1 = require("../../products/entities/product-spec.entity");
const product_variant_entity_1 = require("../../products/entities/product-variant.entity");
const slugify_1 = __importDefault(require("slugify"));
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
let AdminProductsService = class AdminProductsService {
    productRepo;
    imageRepo;
    specRepo;
    variantRepo;
    constructor(productRepo, imageRepo, specRepo, variantRepo) {
        this.productRepo = productRepo;
        this.imageRepo = imageRepo;
        this.specRepo = specRepo;
        this.variantRepo = variantRepo;
    }
    async findAll(query) {
        const qb = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.brand', 'brand')
            .leftJoinAndSelect('product.images', 'images');
        if (query.search) {
            qb.andWhere('(product.name ILIKE :s OR product.sku ILIKE :s)', { s: `%${query.search}%` });
        }
        if (query.categoryId)
            qb.andWhere('product.categoryId = :cid', { cid: query.categoryId });
        if (query.status)
            qb.andWhere('product.status = :status', { status: query.status });
        if (query.lowStock)
            qb.andWhere('product.stock <= product.lowStockThreshold AND product.stock > 0');
        qb.orderBy('product.createdAt', 'DESC');
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const [items, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findOne(id) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: { category: true, brand: true, images: true, specs: true, variants: true },
        });
        if (!product)
            throw new common_1.NotFoundException('محصول یافت نشد');
        return product;
    }
    async create(dto) {
        const existingSku = await this.productRepo.findOne({ where: { sku: dto.sku } });
        if (existingSku)
            throw new common_1.ConflictException('این کد محصول (SKU) قبلاً استفاده شده است');
        const slug = dto.slug ?? (0, slugify_1.default)(dto.name, { locale: 'fa', lower: true, strict: true });
        const existingSlug = await this.productRepo.findOne({ where: { slug } });
        if (existingSlug)
            throw new common_1.ConflictException('این slug قبلاً استفاده شده است');
        const { specs, variants, ...productData } = dto;
        const product = this.productRepo.create({ ...productData, status: productData.status, slug });
        const saved = await this.productRepo.save(product);
        if (specs?.length) {
            const specEntities = specs.map((s, i) => this.specRepo.create({ ...s, productId: saved.id, sortOrder: s.sortOrder ?? i }));
            await this.specRepo.save(specEntities);
        }
        if (variants?.length) {
            const variantEntities = variants.map((v) => this.variantRepo.create({ ...v, productId: saved.id }));
            await this.variantRepo.save(variantEntities);
        }
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        const { specs, variants, ...productData } = dto;
        if (productData.sku && productData.sku !== product.sku) {
            const existing = await this.productRepo.findOne({ where: { sku: productData.sku } });
            if (existing)
                throw new common_1.ConflictException('این SKU قبلاً استفاده شده است');
        }
        Object.assign(product, productData);
        await this.productRepo.save(product);
        if (specs !== undefined) {
            await this.specRepo.delete({ productId: id });
            if (specs.length) {
                const specEntities = specs.map((s, i) => this.specRepo.create({ ...s, productId: id, sortOrder: s.sortOrder ?? i }));
                await this.specRepo.save(specEntities);
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepo.remove(product);
        try {
            const fs = require('fs/promises');
            const path = require('path');
            const uploadDir = process.env.UPLOAD_DIR || './uploads';
            const dir = path.join(uploadDir, 'products', id);
            await fs.rm(dir, { recursive: true, force: true }).catch(() => { });
        }
        catch (e) { }
    }
    async addImage(productId, imageData, isPrimary = false) {
        await this.findOne(productId);
        if (isPrimary) {
            await this.imageRepo.update({ productId }, { isPrimary: false });
        }
        const image = this.imageRepo.create({
            productId,
            url: imageData.url,
            filename: imageData.filename,
            originalName: imageData.originalName,
            path: imageData.path,
            isPrimary
        });
        return this.imageRepo.save(image);
    }
    async removeImage(imageId) {
        const image = await this.imageRepo.findOne({ where: { id: imageId } });
        if (!image)
            return;
        await this.imageRepo.delete(imageId);
        if (image.filename) {
            try {
                const fs = require('fs/promises');
                const path = require('path');
                const uploadDir = process.env.UPLOAD_DIR || './uploads';
                const baseName = path.parse(image.filename).name;
                const dir = path.join(uploadDir, 'products', image.productId);
                await fs.unlink(path.join(dir, `${baseName}-thumbnail.webp`)).catch(() => { });
                await fs.unlink(path.join(dir, `${baseName}-medium.webp`)).catch(() => { });
                await fs.unlink(path.join(dir, `${baseName}-original.webp`)).catch(() => { });
            }
            catch (e) { }
        }
    }
    async reorderImages(productId, imageIds) {
        for (let i = 0; i < imageIds.length; i++) {
            await this.imageRepo.update({ id: imageIds[i], productId }, { sortOrder: i, isPrimary: i === 0 });
        }
    }
    async bulkUpdateStatus(ids, status) {
        await this.productRepo.update(ids, { status: status });
        return { updated: ids.length };
    }
};
exports.AdminProductsService = AdminProductsService;
exports.AdminProductsService = AdminProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __param(2, (0, typeorm_1.InjectRepository)(product_spec_entity_1.ProductSpec)),
    __param(3, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminProductsService);
//# sourceMappingURL=admin-products.service.js.map