

export function StockStatus({ stock, lowStockThreshold = 5 }: { stock: number; lowStockThreshold?: number }) {
  if (stock === 0) {
    return <span className="text-xs font-medium text-danger">ناموجود</span>;
  }
  if (stock <= lowStockThreshold) {
    return <span className="text-xs font-medium text-warning">تنها {stock} عدد باقیمانده</span>;
  }
  return <span className="text-xs font-medium text-success">موجود در انبار</span>;
}
