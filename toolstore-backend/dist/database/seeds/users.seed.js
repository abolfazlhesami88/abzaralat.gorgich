"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = seedUsers;
const user_entity_1 = require("../../modules/users/entities/user.entity");
const app_constants_1 = require("../../common/constants/app.constants");
const bcrypt = __importStar(require("bcrypt"));
async function seedUsers(dataSource) {
    const repo = dataSource.getRepository(user_entity_1.User);
    const existing = await repo.count();
    if (existing > 0) {
        console.log('  ⏭️  کاربران قبلاً seed شدهاند، رد میشود');
        return;
    }
    const users = [
        {
            email: 'admin@toolstore.ir',
            passwordHash: await bcrypt.hash('Admin@1234', 12),
            firstName: 'مدیر',
            lastName: 'سیستم',
            role: app_constants_1.UserRole.ADMIN,
            isActive: true,
        },
        {
            email: 'ali@example.com',
            passwordHash: await bcrypt.hash('User@1234', 12),
            firstName: 'علی',
            lastName: 'احمدی',
            phone: '09121234567',
            role: app_constants_1.UserRole.CUSTOMER,
            isActive: true,
        },
        {
            email: 'sara@example.com',
            passwordHash: await bcrypt.hash('User@1234', 12),
            firstName: 'سارا',
            lastName: 'محمدی',
            phone: '09351234567',
            role: app_constants_1.UserRole.CUSTOMER,
            isActive: true,
        },
        {
            email: 'reza@example.com',
            passwordHash: await bcrypt.hash('User@1234', 12),
            firstName: 'رضا',
            lastName: 'کریمی',
            phone: '09011234567',
            role: app_constants_1.UserRole.CUSTOMER,
            isActive: true,
        },
    ];
    await repo.query(`
    INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at)
    VALUES
      (gen_random_uuid(), 'admin@toolstore.ir', '${users[0].passwordHash}', 'مدیر', 'سیستم', NULL, 'admin', true, NOW(), NOW()),
      (gen_random_uuid(), 'ali@example.com', '${users[1].passwordHash}', 'علی', 'احمدی', '09121234567', 'customer', true, NOW(), NOW()),
      (gen_random_uuid(), 'sara@example.com', '${users[2].passwordHash}', 'سارا', 'محمدی', '09351234567', 'customer', true, NOW(), NOW()),
      (gen_random_uuid(), 'reza@example.com', '${users[3].passwordHash}', 'رضا', 'کریمی', '09011234567', 'customer', true, NOW(), NOW())
  `);
}
//# sourceMappingURL=users.seed.js.map