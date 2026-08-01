export function formatPrice(priceInRials: number): string {
  const toman = Math.floor(priceInRials / 10);
  return new Intl.NumberFormat('en-US').format(toman);
}

export function toLatinDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let str = String(input);
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(persianDigits[i], 'g'), String(i));
  }
  return str;
}

// برای همگام‌سازی، تابع قدیمی هم ارقام لاتین (0-9) برمی‌گرداند
export const toPersianDigits = toLatinDigits;
