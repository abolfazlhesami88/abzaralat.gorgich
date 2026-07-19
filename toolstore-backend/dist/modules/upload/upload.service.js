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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const image_processor_1 = require("./utils/image-processor");
const app_constants_1 = require("../../common/constants/app.constants");
let UploadService = class UploadService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async uploadProductImage(file, productId) {
        this.validateFile(file);
        const uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
        const random8 = Math.random().toString(36).substring(2, 10);
        const filename = `${Date.now()}_${random8}`;
        const processed = await (0, image_processor_1.processProductImage)(file.buffer, filename, uploadDir, productId);
        return {
            url: processed.medium,
            thumbnailUrl: processed.thumbnail,
            originalUrl: processed.original,
            filename: processed.filename,
            originalName: processed.originalName,
            path: processed.path,
        };
    }
    async uploadAvatarImage(file) {
        this.validateFile(file);
        const uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
        const random8 = Math.random().toString(36).substring(2, 10);
        const filename = `${Date.now()}_${random8}`;
        const processed = await (0, image_processor_1.processProductImage)(file.buffer, filename, uploadDir, 'avatars');
        return { url: processed.medium };
    }
    validateFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('فایلی ارسال نشده است');
        }
        if (!app_constants_1.UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('فرمت فایل مجاز نیست. فقط JPG، PNG، WebP پذیرفته میشود');
        }
        if (file.size > app_constants_1.UPLOAD.MAX_SIZE) {
            throw new common_1.BadRequestException('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map