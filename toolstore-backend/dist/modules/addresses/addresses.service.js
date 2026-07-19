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
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("./entities/address.entity");
const MAX_ADDRESSES = 5;
let AddressesService = class AddressesService {
    addressRepo;
    constructor(addressRepo) {
        this.addressRepo = addressRepo;
    }
    async findAll(userId) {
        return this.addressRepo.find({
            where: { userId },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
    }
    async create(userId, dto) {
        const count = await this.addressRepo.count({ where: { userId } });
        if (count >= MAX_ADDRESSES) {
            throw new common_1.BadRequestException(`حداکثر ${MAX_ADDRESSES} آدرس میتوانید ثبت کنید`);
        }
        if (dto.isDefault || count === 0) {
            await this.addressRepo.update({ userId }, { isDefault: false });
        }
        const address = this.addressRepo.create({
            ...dto,
            userId,
            isDefault: dto.isDefault ?? count === 0,
        });
        return this.addressRepo.save(address);
    }
    async update(addressId, userId, dto) {
        const address = await this.findOne(addressId, userId);
        if (dto.isDefault) {
            await this.addressRepo.update({ userId }, { isDefault: false });
        }
        Object.assign(address, dto);
        return this.addressRepo.save(address);
    }
    async remove(addressId, userId) {
        const address = await this.findOne(addressId, userId);
        await this.addressRepo.remove(address);
        if (address.isDefault) {
            const first = await this.addressRepo.findOne({
                where: { userId },
                order: { createdAt: 'ASC' },
            });
            if (first) {
                first.isDefault = true;
                await this.addressRepo.save(first);
            }
        }
    }
    async setDefault(addressId, userId) {
        await this.findOne(addressId, userId);
        await this.addressRepo.update({ userId }, { isDefault: false });
        await this.addressRepo.update(addressId, { isDefault: true });
        return this.findAll(userId);
    }
    async findOne(addressId, userId) {
        const address = await this.addressRepo.findOne({
            where: { id: addressId, userId },
        });
        if (!address)
            throw new common_1.NotFoundException('آدرس یافت نشد');
        return address;
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map