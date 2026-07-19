export function formatPrice(priceInRials: number): string {
  const toman = Math.floor(priceInRials / 10);
  return new Intl.NumberFormat('fa-IR').format(toman);
}

export function toPersianDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}
