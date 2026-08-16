export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  stock: number;
  image: string | null;
}

export interface CartItemSummary {
  id: string;
  product: CartItemProduct | null;
  variant: { id: string; name: string } | null;
  quantity: number;
  priceAtTime: number;
  totalPrice: number;
}

export interface CartSummary {
  cartId: string;
  items: CartItemSummary[];
  subtotal: number;
  shippingCost: number;
  freeShippingRemaining: number;
  total: number;
  itemCount: number;
  coupon?: { code: string; type: string; value: number } | null;
  discountAmount?: number;
}
