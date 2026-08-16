import { DataSource } from 'typeorm';
import { Brand } from '../../modules/brands/entities/brand.entity';

export async function seedBrands(dataSource: DataSource) {
  const repo = dataSource.getRepository(Brand);
  const existing = await repo.count();
  if (existing > 0) return;

  await repo.save([
    { name: 'Bosch', slug: 'bosch', countryOfOrigin: 'Germany', isActive: true,
      description: 'پیشرو در تکنولوژی ابزار برقی حرفهای' },
    { name: 'DeWalt', slug: 'dewalt', countryOfOrigin: 'USA', isActive: true,
      description: 'انتخاب پیشهوران حرفهای در سراسر جهان' },
    { name: 'Makita', slug: 'makita', countryOfOrigin: 'Japan', isActive: true,
      description: 'نوآوری ژاپنی در ابزار حرفهای' },
    { name: 'Stanley', slug: 'stanley', countryOfOrigin: 'USA', isActive: true,
      description: 'بیش از ۱۷۵ سال تجربه در ابزار دستی' },
    { name: 'Bahco', slug: 'bahco', countryOfOrigin: 'Sweden', isActive: true,
      description: 'ابزار دقیق سوئدی برای متخصصان' },
    { name: 'Irwin', slug: 'irwin', countryOfOrigin: 'USA', isActive: true,
      description: 'ابزار برش و گیرههای حرفهای' },
    { name: 'Klein Tools', slug: 'klein-tools', countryOfOrigin: 'USA', isActive: true,
      description: 'تخصص در ابزار الکترکاری' },
    { name: 'Hilti', slug: 'hilti', countryOfOrigin: 'Liechtenstein', isActive: true,
      description: 'راهکارهای پیشرفته برای صنعت ساختمان' },
  ]);
}
