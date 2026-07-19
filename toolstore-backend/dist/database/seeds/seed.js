"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../../app.module");
const typeorm_1 = require("typeorm");
const users_seed_1 = require("./users.seed");
const categories_seed_1 = require("./categories.seed");
const brands_seed_1 = require("./brands.seed");
const products_seed_1 = require("./products.seed");
const coupons_seed_1 = require("./coupons.seed");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    console.log('🌱 شروع seed دادهها...');
    try {
        await (0, users_seed_1.seedUsers)(dataSource);
        console.log('✅ کاربران seed شدند');
        await (0, categories_seed_1.seedCategories)(dataSource);
        console.log('✅ دستهبندیها seed شدند');
        await (0, brands_seed_1.seedBrands)(dataSource);
        console.log('✅ برندها seed شدند');
        await (0, products_seed_1.seedProducts)(dataSource);
        console.log('✅ محصولات seed شدند');
        await (0, coupons_seed_1.seedCoupons)(dataSource);
        console.log('✅ کد تخفیفها seed شدند');
        console.log('🎉 تمام دادهها با موفقیت seed شدند');
    }
    catch (error) {
        console.error('❌ خطا در seed:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map