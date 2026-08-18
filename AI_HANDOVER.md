# سند وضعیت پروژه و راهنمای توسعه‌دهنده (AI Handover Document)

## 👤 پروفایل توسعه‌دهنده (بسیار مهم برای هوش مصنوعیِ خواننده این فایل)
**قابل توجه هر هوش مصنوعی (Agent) که این فایل را می‌خواند:**
توسعه‌دهنده و مدیر این پروژه، دانش برنامه‌نویسی کدنویسی مستقیم و مدیریت سرور لینوکس **ندارد**. تمام چرخه توسعه، دیباگ، استقرار و مدیریت این پروژه صرفاً از طریق **دستور دادن به ایجنت‌های هوش مصنوعی (مثل Cursor، Devin، Copilot، Cline، Antigravity یا ChatGPT)** پیش می‌رود. 
بنابراین:
1. **هرگز** توضیحات تئوریِ صرف ندهید.
2. همیشه کدهای جایگزین (Refactored) را به صورت کامل و آماده‌ی `Copy/Paste` ارائه دهید.
3. در محیط سرور (لینوکس)، دستورات خط فرمان (CLI) را قدم‌به‌قدم و با در نظر گرفتن اینکه کاربر از محیط ترمینال ویندوز (PowerShell) کار می‌کند، ارائه دهید.
4. در مواجهه با ارورها، صبور باشید و با دریافت متن ارور، مستقیماً دستور اصلاحی خودکار را صادر کنید.
5. قبل از هر تغییر ساختاری، راهکار بازگشت اضطراری (Rollback) ارائه دهید.

---

## 🛠️ مشخصات کلی پروژه
- **نام پروژه:** ابزارآلات گرگیچ (ToolStore Pro)
- **نوع پروژه:** فروشگاه اینترنتی (E-commerce) کامل و حرفه‌ای ابزارآلات صنعتی و خانگی.
- **تکنولوژی‌های بک‌اند:** Node.js, NestJS, TypeORM, PostgreSQL.
- **تکنولوژی‌های فرانت‌اند:** React, Vite, TailwindCSS, Zustand, React Query.
- **وضعیت زیرساخت:** داکرایز شده با Docker Compose و مستقر روی سرور لینوکس اوبونتو با SSL فعال.

---

## 🖥️ اطلاعات و مشخصات سرور (Production Server)
- **آی‌پی سرور (IP):** `130.185.77.192`
- **دامنه فعال با SSL:** `https://abzargorgij.com`
- **نام کاربری سرور:** `root`
- **مسیر پروژه روی سرور:** `/root/toolstore`
- **مخزن گیت‌هاب:** `https://github.com/abolfazlhesami88/abzaralat.gorgich.git`
- **دستور اتصال مستقیم از ترمینال ویندوز:**
  ```bash
  ssh root@130.185.77.192
  ```

### 🔗 لینک‌ها و دسترسی‌های سرویس
* **آدرس اصلی فروشگاه (فرانت‌اند):** `https://abzargorgij.com`
* **آدرس پنل مدیریت (ادمین):** `https://abzargorgij.com/adminsite`
* **اطلاعات ورود به پنل ادمین:**
  * **ایمیل / شناسه:** `admin@admin.com`
  * **رمز عبور:** `admin`
* **پورت‌های فعال شبکه:**
  * فرانت‌اند (Nginx): پورت `80` (HTTP) و `443` (HTTPS با گواهی Let's Encrypt)
  * بک‌اند (NestJS API): پورت `3000`
  * دیتابیس (PostgreSQL 15): پورت `5432`
  * پروکسی داخلی سرور (Xray HTTP / SOCKS5): پورت‌های `20809` و `20808`

---

## ✅ کارهایی که تا الان انجام شده (Completed Phases)

### 1. توسعه ساختار اولیه، ممیزی امنیتی و داکرایز کامل
* راه‌اندازی ساختار ماژولار NestJS و React با دیتابیس PostgreSQL.
* رفع باگ‌های امنیتی (Variant Stock Lock, Stored XSS, Coupon Race Condition, DOMPurify).
* داکرایز کامل سه سرویس (`toolstore_db`, `toolstore_backend`, `toolstore_frontend`).

### 2. اتصال دامنه و فعال‌سازی SSL امن (HTTPS)
* اتصال دامنه `abzargorgij.com` به سرور و راه‌اندازی گواهی Let's Encrypt روی پورت ۴۴۳.
* پیکربندی کانفیگ Nginx اختصاصی (`nginx-custom.conf`) با فشرده‌سازی Gzip و ریدایرکت امن HTTP به HTTPS.
* استفاده از فایل `docker-compose.override.yml` برای تفکیک محیط محلی (ویندوز بدون SSL) و محیط سرور (لینوکس با SSL).

### 3. سیستم مدیریت تخفیف‌های درصدی (تکی و گروهی)
* افزودن قابلیت تنظیم درصد تخفیف با دکمه‌های سریع (۵٪ تا ۵۰٪) و فیلد قیمت خط‌خورده در صفحه هر محصول.
* قابلیت انتخاب چند یا تمام محصولات و اعمال/حذف دسته‌جمعی تخفیف‌ها از طریق پاپ‌آپ عملیات گروهی.
* نمایش بج قرمز درصد تخفیف و قیمت خط‌خورده در جدول مدیریت محصولات.

### 4. پیاده‌سازی ۵ صفحه اختصاصی برای فوتر
* طراحی و راه‌اندازی صفحات: **تماس با ما** (`/contact`)، **درباره ما** (`/about`)، **سوالات متداول** (`/faq`)، **نحوه ارسال کالا** (`/shipping`) و **شرایط و قوانین** (`/terms`).
* حذف لینک‌های اضافه و استانداردسازی ستون‌های فوتر.
* اصلاح پرش تصویر هیرو بنر (Flicker) در هنگام بارگذاری اولیه سایت و کش در `localStorage`.

### 5. پایدارسازی اسکریپت استقرار (`deploy.sh`)
* اضافه شدن مکانیزم بک‌آپ‌گیری قبل از دیپلوی و رول‌بک خودکار.
* دور زدن پروکسی سرور با `--noproxy "*"` در بررسی سلامت جهت جلوگیری از خطای کاذب ۵۰۳.

---

## 🧰 جعبه‌ابزار دستورات حیاتی سرور

### ۱. استقرار و دریافت آخرین آپدیت‌ها:
```bash
cd /root/toolstore
./deploy.sh
```

### ۲. دستور بازیابی و ریست اکانت ادمین (در صورت بروز مشکل لاگین):
```bash
docker compose exec backend node -e "
const bcrypt = require('bcrypt');
const { Client } = require('pg');
async function fixAdmin() {
  const client = new Client({
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'toolstore',
  });
  await client.connect();
  const hash = await bcrypt.hash('admin', 12);
  const check = await client.query('SELECT id FROM users WHERE email = \$1', ['admin@admin.com']);
  if (check.rows.length > 0) {
    await client.query('UPDATE users SET password_hash = \$1, role = \$2, is_active = true WHERE email = \$3', [hash, 'admin', 'admin@admin.com']);
    console.log('✅ اکانت ادمین با موفقیت به‌روزرسانی شد.');
  } else {
    await client.query('INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES (\$1, \$2, \$3, \$4, \$5, true)', ['admin@admin.com', hash, 'مدیر', 'سیستم', 'admin']);
    console.log('✅ اکانت ادمین ایجاد شد.');
  }
  await client.end();
}
fixAdmin().catch(console.error);
"
```

---

## 🚀 کارهایی که در مراحل بعدی باید انجام شود (Upcoming Phases)

- [ ] **پیکربندی پنل پیامک کاوه‌نگار:** قرار دادن کلید اختصاصی در `KAVENEGAR_API_KEY` و تنظیم پترن OTP.
- [ ] **تست نهایی فرآیند خرید (E2E Testing):** ورود با پیامک ➔ افزودن به سبد ➔ کد تخفیف ➔ تسویه حساب ➔ مدیریت سفارش در پنل ادمین.
- [ ] **پشتیبان‌گیری خودکار دیتابیس (Automated Database Backup):** راه‌اندازی CronJob روی سرور برای تهیه بک‌آپ روزانه از PostgreSQL.
