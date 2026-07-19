import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { seedCategories } from './categories.seed';
import { seedBrands } from './brands.seed';
import { seedProducts } from './products.seed';
import { seedCoupons } from './coupons.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 شروع seed دادهها...');

  try {
    await seedUsers(dataSource);
    console.log('✅ کاربران seed شدند');

    await seedCategories(dataSource);
    console.log('✅ دستهبندیها seed شدند');

    await seedBrands(dataSource);
    console.log('✅ برندها seed شدند');

    await seedProducts(dataSource);
    console.log('✅ محصولات seed شدند');

    await seedCoupons(dataSource);
    console.log('✅ کد تخفیفها seed شدند');

    console.log('🎉 تمام دادهها با موفقیت seed شدند');
  } catch (error) {
    console.error('❌ خطا در seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
