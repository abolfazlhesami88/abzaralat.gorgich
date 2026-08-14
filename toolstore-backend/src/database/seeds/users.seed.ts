import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '../../common/constants/app.constants';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);

  // بررسی یا ایجاد حساب ادمین اصلی
  const existingAdmin = await repo.findOne({ where: { email: 'admin@admin.com' } });

  if (existingAdmin) {
    // UPDATE: هوک @BeforeInsert اجرا نمی‌شود، پس باید خودمان هش کنیم
    existingAdmin.passwordHash = await bcrypt.hash('admin', 12);
    existingAdmin.role = UserRole.ADMIN;
    existingAdmin.isActive = true;
    await repo.save(existingAdmin);
    console.log('  ✅ کاربر مدیر (admin@admin.com) با رمز admin به‌روزرسانی شد');
  } else {
    // INSERT: هوک @BeforeInsert خودش هش می‌کند، پس رمز را به صورت متن ساده می‌دهیم
    const adminUser = repo.create({
      email: 'admin@admin.com',
      passwordHash: 'admin',
      firstName: 'مدیر',
      lastName: 'سیستم',
      role: UserRole.ADMIN,
      isActive: true,
    });
    await repo.save(adminUser);
    console.log('  ✅ کاربر مدیر (admin@admin.com) ایجاد شد');
  }

  const existingCount = await repo.count();
  if (existingCount > 1) {
    console.log('  ⏭️  سایر کاربران قبلاً وجود داشتند، رد شد');
    return;
  }

  const defaultPasswordHash = await bcrypt.hash('User@1234', 12);
  const sampleUsers = [
    {
      email: 'ali@example.com',
      passwordHash: defaultPasswordHash,
      firstName: 'علی',
      lastName: 'احمدی',
      phone: '09121234567',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
    {
      email: 'sara@example.com',
      passwordHash: defaultPasswordHash,
      firstName: 'سارا',
      lastName: 'محمدی',
      phone: '09351234567',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
    {
      email: 'reza@example.com',
      passwordHash: defaultPasswordHash,
      firstName: 'رضا',
      lastName: 'کریمی',
      phone: '09011234567',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
  ];

  for (const u of sampleUsers) {
    const exists = await repo.findOne({ where: { email: u.email } });
    if (!exists) {
      await repo.save(repo.create(u));
    }
  }
}
