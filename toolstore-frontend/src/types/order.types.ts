export interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  productImage: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode: string;
  };
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  couponCode: string | null;
  trackingCode: string | null;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
}
