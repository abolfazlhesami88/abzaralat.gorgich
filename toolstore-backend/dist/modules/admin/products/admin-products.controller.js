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
exports.AdminProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const admin_products_service_1 = require("./admin-products.service");
const upload_service_1 = require("../../upload/upload.service");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const app_constants_1 = require("../../../common/constants/app.constants");
let AdminProductsController = class AdminProductsController {
    adminProductsService;
    uploadService;
    constructor(adminProductsService, uploadService) {
        this.adminProductsService = adminProductsService;
        this.uploadService = uploadService;
    }
    async findAll(query) {
        return { data: await this.adminProductsService.findAll(query) };
    }
    async findOne(id) {
        return { data: await this.adminProductsService.findOne(id) };
    }
    async create(dto) {
        return { data: await this.adminProductsService.create(dto) };
    }
    async update(id, dto) {
        return { data: await this.adminProductsService.update(id, dto) };
    }
    async remove(id) {
        await this.adminProductsService.remove(id);
        return { data: null, message: 'محصول حذف شد' };
    }
    async addImage(id, file, primary) {
        const imageData = await this.uploadService.uploadProductImage(file, id);
        return { data: await this.adminProductsService.addImage(id, imageData, primary === 'true') };
    }
    async removeImage(id, imageId) {
        await this.adminProductsService.removeImage(imageId);
        return { data: null };
    }
    async reorderImages(id, imageIds) {
        await this.adminProductsService.reorderImages(id, imageIds);
        return { data: null };
    }
    async bulkUpdateStatus(ids, status) {
        return { data: await this.adminProductsService.bulkUpdateStatus(ids, status) };
    }
};
exports.AdminProductsController = AdminProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Query)('primary')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "removeImage", null);
__decorate([
    (0, common_1.Post)(':id/images/reorder'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('imageIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "reorderImages", null);
__decorate([
    (0, common_1.Post)('bulk-status'),
    __param(0, (0, common_1.Body)('ids')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "bulkUpdateStatus", null);
exports.AdminProductsController = AdminProductsController = __decorate([
    (0, swagger_1.ApiTags)('Admin — Products'),
    (0, common_1.Controller)('admin/products'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(app_constants_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_products_service_1.AdminProductsService,
        upload_service_1.UploadService])
], AdminProductsController);
//# sourceMappingURL=admin-products.controller.js.map