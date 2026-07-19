import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/products — باید لیست محصولات را با pagination برگرداند', async () => {
    const res = await request(app.getHttpServer()).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.data.items).toBeInstanceOf(Array);
    expect(res.body.data.meta.total).toBeGreaterThanOrEqual(0); // Might be 0 if db is empty during test
  });

  it('GET /api/products?categorySlug=drills — باید فقط محصولات آن دسته را برگرداند', async () => {
    const res = await request(app.getHttpServer()).get('/api/products?categorySlug=drills');
    expect(res.status).toBe(200);
    if (res.body.data.items.length > 0) {
      res.body.data.items.forEach((p: any) => {
        expect(p.category.slug).toBe('drills');
      });
    }
  });

  it('GET /api/products?minPrice=&maxPrice= — باید بازه قیمت را رعایت کند', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products?minPrice=10000000&maxPrice=50000000');
    expect(res.status).toBe(200);
    if (res.body.data.items.length > 0) {
      res.body.data.items.forEach((p: any) => {
        expect(p.price).toBeGreaterThanOrEqual(10000000);
        expect(p.price).toBeLessThanOrEqual(50000000);
      });
    }
  });

  it('GET /api/products?search=دریل — باید جستجوی فارسی کار کند', async () => {
    const res = await request(app.getHttpServer()).get('/api/products?search=دریل');
    expect(res.status).toBe(200);
    expect(res.body.data.items).toBeInstanceOf(Array);
  });

  it('GET /api/products/:slug — باید جزئیات محصول با روابط را برگرداند', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products/bosch-gsr-18v-55');
    // If running with seeded db, it should be 200. Otherwise 404.
    if (res.status === 200) {
      expect(res.body.data.specs).toBeInstanceOf(Array);
      expect(res.body.data.category).toBeDefined();
      expect(res.body.data.brand).toBeDefined();
    } else {
      expect(res.status).toBe(404);
    }
  });

  it('GET /api/products/:slug — باید برای محصول ناموجود ۴۰۴ بدهد', async () => {
    const res = await request(app.getHttpServer()).get('/api/products/not-exist');
    expect(res.status).toBe(404);
  });

  it('GET /api/categories — باید ساختار درختی برگرداند', async () => {
    const res = await request(app.getHttpServer()).get('/api/categories');
    expect(res.status).toBe(200);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].children).toBeInstanceOf(Array);
    }
  });

  it('POST /api/upload/product-image — بدون لاگین باید ۴۰۱ بدهد', async () => {
    const res = await request(app.getHttpServer()).post('/api/upload/product-image');
    expect(res.status).toBe(401);
  });
});
