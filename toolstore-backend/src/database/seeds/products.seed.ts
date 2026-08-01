import { DataSource } from 'typeorm';
import { Product } from '../../modules/products/entities/product.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Brand } from '../../modules/brands/entities/brand.entity';

export async function seedProducts(dataSource: DataSource) {
  const productRepo = dataSource.getRepository(Product);

  // ۱. آپدیت یکباره محصولات موجود در دیتابیس که روی draft مانده‌اند
  await dataSource.query("UPDATE products SET status = 'active' WHERE status = 'draft'").catch(() => {});

  const existing = await productRepo.count();
  if (existing > 0) return;

  const categoryRepo = dataSource.getRepository(Category);
  const brandRepo = dataSource.getRepository(Brand);

  const drills = await categoryRepo.findOne({ where: { slug: 'drills' } });
  const saws = await categoryRepo.findOne({ where: { slug: 'saws' } });
  const wrenches = await categoryRepo.findOne({ where: { slug: 'wrenches' } });
  const hammers = await categoryRepo.findOne({ where: { slug: 'hammers' } });
  const levels = await categoryRepo.findOne({ where: { slug: 'levels' } });
  const gloves = await categoryRepo.findOne({ where: { slug: 'gloves' } });
  const grinders = await categoryRepo.findOne({ where: { slug: 'grinders' } });

  const bosch = await brandRepo.findOne({ where: { slug: 'bosch' } });
  const dewalt = await brandRepo.findOne({ where: { slug: 'dewalt' } });
  const makita = await brandRepo.findOne({ where: { slug: 'makita' } });
  const stanley = await brandRepo.findOne({ where: { slug: 'stanley' } });
  const bahco = await brandRepo.findOne({ where: { slug: 'bahco' } });

  const productsData = [
    {
      name: 'دریل شارژی بوش GSR 18V-55',
      slug: 'bosch-gsr-18v-55',
      sku: 'BSH-GSR18V55',
      shortDescription: 'دریل پیچگوشتی شارژی حرفهای با باتری ۱۸ ولت',
      description: `دریل شارژی بوش GSR 18V-55 با موتور قدرتمند ۵۵ نیوتون متر گشتاور، مناسب برای تمام کارهای حرفهای ساختمانی و صنعتی است. سیستم هوشمند Electronic Cell Protection از باتری در برابر اضافهبار محافظت میکند.`,
      price: 45000000,
      compareAtPrice: 52000000,
      stock: 25,
      category: drills,
      brand: bosch,
      isFeatured: true,
      isNew: false,
      weight: 1.9,
      soldCount: 145,
      averageRating: 4.7,
      reviewCount: 38,
      specs: [
        { specKey: 'ولتاژ باتری', specValue: '۱۸ ولت', sortOrder: 1 },
        { specKey: 'گشتاور حداکثر', specValue: '۵۵ نیوتون متر', sortOrder: 2 },
        { specKey: 'دور بیباری', specValue: '۰-۵۰۰ / ۰-۱۹۰۰ RPM', sortOrder: 3 },
        { specKey: 'قطر گیره', specValue: '۱۳ میلیمتر', sortOrder: 4 },
        { specKey: 'وزن', specValue: '۱.۹ کیلوگرم', sortOrder: 5 },
        { specKey: 'ظرفیت باتری', specValue: '۲ آمپرساعت', sortOrder: 6 },
      ],
    },
    {
      name: 'دریل چکشی بوش GSB 18V-55',
      slug: 'bosch-gsb-18v-55',
      sku: 'BSH-GSB18V55',
      shortDescription: 'دریل چکشی شارژی با قابلیت حفاری در بتن',
      price: 58000000,
      compareAtPrice: null,
      stock: 15,
      category: drills,
      brand: bosch,
      isFeatured: true,
      isNew: true,
      weight: 2.1,
      soldCount: 89,
      averageRating: 4.8,
      reviewCount: 24,
      specs: [
        { specKey: 'ولتاژ باتری', specValue: '۱۸ ولت', sortOrder: 1 },
        { specKey: 'گشتاور حداکثر', specValue: '۵۵ نیوتون متر', sortOrder: 2 },
        { specKey: 'حفاری در بتن', specValue: 'حداکثر ۱۳ میلیمتر', sortOrder: 3 },
        { specKey: 'وزن', specValue: '۲.۱ کیلوگرم', sortOrder: 4 },
      ],
    },
    {
      name: 'اره آهنبر دیوالت DCS391',
      slug: 'dewalt-dcs391',
      sku: 'DWT-DCS391',
      shortDescription: 'اره دیسکی شارژی ۱۸۵ میلیمتر با باتری ۲۰ ولت',
      price: 78000000,
      compareAtPrice: 89000000,
      stock: 8,
      category: saws,
      brand: dewalt,
      isFeatured: true,
      isNew: false,
      weight: 3.4,
      soldCount: 67,
      averageRating: 4.6,
      reviewCount: 18,
      specs: [
        { specKey: 'قطر تیغه', specValue: '۱۸۵ میلیمتر', sortOrder: 1 },
        { specKey: 'ولتاژ باتری', specValue: '۲۰ ولت', sortOrder: 2 },
        { specKey: 'عمق برش در ۹۰ درجه', specValue: '۵۵ میلیمتر', sortOrder: 3 },
        { specKey: 'دور بیباری', specValue: '۳۷۰۰ RPM', sortOrder: 4 },
        { specKey: 'وزن', specValue: '۳.۴ کیلوگرم', sortOrder: 5 },
      ],
    },
    {
      name: 'دریل شارژی ماکیتا DDF481',
      slug: 'makita-ddf481',
      sku: 'MKT-DDF481',
      shortDescription: 'دریل ۱۸ ولت ماکیتا با کلاچ ۲۱ مرحلهای',
      price: 52000000,
      compareAtPrice: null,
      stock: 20,
      category: drills,
      brand: makita,
      isFeatured: false,
      isNew: true,
      weight: 1.8,
      soldCount: 112,
      averageRating: 4.5,
      reviewCount: 31,
      specs: [
        { specKey: 'ولتاژ باتری', specValue: '۱۸ ولت', sortOrder: 1 },
        { specKey: 'گشتاور حداکثر', specValue: '۶۵ نیوتون متر', sortOrder: 2 },
        { specKey: 'مراحل کلاچ', specValue: '۲۱ مرحله', sortOrder: 3 },
        { specKey: 'وزن', specValue: '۱.۸ کیلوگرم', sortOrder: 4 },
      ],
    },
    {
      name: 'آچار فرانسه استنلی 10 اینچ',
      slug: 'stanley-adjustable-wrench-10',
      sku: 'STN-AW10',
      shortDescription: 'آچار فرانسه استنلی با فک کروم-وانادیوم ۲۵۰ میلیمتری',
      price: 8500000,
      compareAtPrice: 10000000,
      stock: 45,
      category: wrenches,
      brand: stanley,
      isFeatured: false,
      isNew: false,
      weight: 0.4,
      soldCount: 278,
      averageRating: 4.4,
      reviewCount: 65,
      specs: [
        { specKey: 'طول', specValue: '۲۵۰ میلیمتر (۱۰ اینچ)', sortOrder: 1 },
        { specKey: 'حداکثر باز شدن فک', specValue: '۳۰ میلیمتر', sortOrder: 2 },
        { specKey: 'جنس', specValue: 'کروم-وانادیوم', sortOrder: 3 },
        { specKey: 'وزن', specValue: '۴۰۰ گرم', sortOrder: 4 },
      ],
    },
    {
      name: 'ست آچار رینگ باهکو S22',
      slug: 'bahco-s22-wrench-set',
      sku: 'BHC-S22',
      shortDescription: 'ست ۲۲ عددی آچار رینگ یکسر تخت استیل Bahco',
      price: 95000000,
      compareAtPrice: 110000000,
      stock: 12,
      category: wrenches,
      brand: bahco,
      isFeatured: true,
      isNew: false,
      weight: 3.2,
      soldCount: 54,
      averageRating: 4.9,
      reviewCount: 22,
      specs: [
        { specKey: 'تعداد قطعات', specValue: '۲۲ عدد', sortOrder: 1 },
        { specKey: 'سایزها', specValue: '۶ تا ۳۲ میلیمتر', sortOrder: 2 },
        { specKey: 'جنس', specValue: 'استیل CrV', sortOrder: 3 },
        { specKey: 'وزن کل', specValue: '۳.۲ کیلوگرم', sortOrder: 4 },
      ],
    },
    {
      name: 'چکش نجاری استنلی 20 اونس',
      slug: 'stanley-hammer-20oz',
      sku: 'STN-HMR20',
      shortDescription: 'چکش نجاری با دسته فایبرگلاس و سر فولادی سختکاریشده',
      price: 12500000,
      compareAtPrice: null,
      stock: 35,
      category: hammers,
      brand: stanley,
      isFeatured: false,
      isNew: false,
      weight: 0.57,
      soldCount: 189,
      averageRating: 4.3,
      reviewCount: 47,
      specs: [
        { specKey: 'وزن سر', specValue: '۵۶۷ گرم (۲۰ اونس)', sortOrder: 1 },
        { specKey: 'طول کل', specValue: '۳۳۵ میلیمتر', sortOrder: 2 },
        { specKey: 'جنس دسته', specValue: 'فایبرگلاس ضدلرزش', sortOrder: 3 },
      ],
    },
    {
      name: 'تراز لیزری بوش GLL 3-80',
      slug: 'bosch-gll-3-80',
      sku: 'BSH-GLL380',
      shortDescription: 'تراز لیزری ۳ خطه ۳۶۰ درجه برد ۸۰ متر',
      price: 185000000,
      compareAtPrice: 210000000,
      stock: 7,
      category: levels,
      brand: bosch,
      isFeatured: true,
      isNew: true,
      weight: 0.85,
      soldCount: 33,
      averageRating: 4.8,
      reviewCount: 12,
      specs: [
        { specKey: 'تعداد خط', specValue: '۳ خط (افقی، عمودی، بالا)', sortOrder: 1 },
        { specKey: 'برد', specValue: '۸۰ متر', sortOrder: 2 },
        { specKey: 'دقت', specValue: '±۰.۲ میلیمتر/متر', sortOrder: 3 },
        { specKey: 'کلاس لیزر', specValue: 'کلاس ۲، ۶۳۵nm', sortOrder: 4 },
        { specKey: 'وزن', specValue: '۰.۸۵ کیلوگرم', sortOrder: 5 },
      ],
    },
    {
      name: 'فرز آنگلی دیوالت DWE402',
      slug: 'dewalt-dwe402',
      sku: 'DWT-DWE402',
      shortDescription: 'فرز آنگلی ۱۱۵ میلیمتری ۱۰۰۰ وات دیوالت',
      price: 38000000,
      compareAtPrice: 45000000,
      stock: 18,
      category: grinders,
      brand: dewalt,
      isFeatured: false,
      isNew: false,
      weight: 1.9,
      soldCount: 93,
      averageRating: 4.5,
      reviewCount: 28,
      specs: [
        { specKey: 'توان', specValue: '۱۰۰۰ وات', sortOrder: 1 },
        { specKey: 'قطر دیسک', specValue: '۱۱۵ میلیمتر', sortOrder: 2 },
        { specKey: 'دور بیباری', specValue: '۱۱۰۰۰ RPM', sortOrder: 3 },
        { specKey: 'وزن', specValue: '۱.۹ کیلوگرم', sortOrder: 4 },
      ],
    },
    {
      name: 'دستکش ایمنی استنلی S مقاوم',
      slug: 'stanley-safety-gloves-s',
      sku: 'STN-GLV-S',
      shortDescription: 'دستکش ایمنی سطح مقاومت بالا مخصوص کارهای سنگین',
      price: 4500000,
      compareAtPrice: 5000000,
      stock: 100,
      category: gloves,
      brand: stanley,
      isFeatured: false,
      isNew: false,
      weight: 0.1,
      soldCount: 345,
      averageRating: 4.6,
      reviewCount: 50,
      specs: [
        { specKey: 'سایز', specValue: 'کوچک (S)', sortOrder: 1 },
        { specKey: 'جنس', specValue: 'نیتریل', sortOrder: 2 },
        { specKey: 'وزن', specValue: '۱۰۰ گرم', sortOrder: 3 },
      ],
    }
  ];

  const productsToSave = productsData.map((p) => ({
    ...p,
    status: 'active',
  }));

  await productRepo.save(productsToSave as any);
}
