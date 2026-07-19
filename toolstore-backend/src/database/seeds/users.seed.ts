import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '../../common/constants/app.constants';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);

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
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      email: 'ali@example.com',
      passwordHash: await bcrypt.hash('User@1234', 12),
      firstName: 'علی',
      lastName: 'احمدی',
      phone: '09121234567',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
    {
      email: 'sara@example.com',
      passwordHash: await bcrypt.hash('User@1234', 12),
      firstName: 'سارا',
      lastName: 'محمدی',
      phone: '09351234567',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
    {
      email: 'reza@example.com',
      passwordHash: await bcrypt.hash('User@1234', 12),
      firstName: 'رضا',
      lastName: 'کریمی',
      phone: '09011234567',
      role: UserRole.CUSTOMER,
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
