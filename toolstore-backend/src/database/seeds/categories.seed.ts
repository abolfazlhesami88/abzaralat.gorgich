import { DataSource } from 'typeorm';
import { Category } from '../../modules/categories/entities/category.entity';

export async function seedCategories(dataSource: DataSource) {
  const repo = dataSource.getRepository(Category);
  const existing = await repo.count();
  if (existing > 0) return;

  const main = await repo.save([
    { name: 'ابزار برقی', slug: 'power-tools', iconName: 'Zap', sortOrder: 1, isActive: true },
    { name: 'ابزار دستی', slug: 'hand-tools', iconName: 'Wrench', sortOrder: 2, isActive: true },
    { name: 'ابزار اندازهگیری', slug: 'measuring-tools', iconName: 'Ruler', sortOrder: 3, isActive: true },
    { name: 'تجهیزات ایمنی', slug: 'safety-equipment', iconName: 'ShieldCheck', sortOrder: 4, isActive: true },
    { name: 'لوازم کارگاه', slug: 'workshop-accessories', iconName: 'Box', sortOrder: 5, isActive: true },
  ]);

  const [powerTools, handTools, measuring, safety, workshop] = main;

  await repo.save([
    { name: 'دریل و پیچگوشتی', slug: 'drills', parent: powerTools, sortOrder: 1, isActive: true },
    { name: 'ارههای برقی', slug: 'saws', parent: powerTools, sortOrder: 2, isActive: true },
    { name: 'فرزکاری', slug: 'grinders', parent: powerTools, sortOrder: 3, isActive: true },
    { name: 'سنباده برقی', slug: 'sanders', parent: powerTools, sortOrder: 4, isActive: true },
    { name: 'آچار و پیچگوشتی', slug: 'wrenches', parent: handTools, sortOrder: 1, isActive: true },
    { name: 'چکش و تبر', slug: 'hammers', parent: handTools, sortOrder: 2, isActive: true },
    { name: 'انبردست و گیره', slug: 'pliers', parent: handTools, sortOrder: 3, isActive: true },
    { name: 'متر و خطکش', slug: 'tapes', parent: measuring, sortOrder: 1, isActive: true },
    { name: 'تراز و شاقول', slug: 'levels', parent: measuring, sortOrder: 2, isActive: true },
    { name: 'دستکش ایمنی', slug: 'gloves', parent: safety, sortOrder: 1, isActive: true },
    { name: 'عینک و ماسک', slug: 'eye-protection', parent: safety, sortOrder: 2, isActive: true },
  ]);
}
