export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  filename?: string;
  originalName?: string;
  path?: string;
}

export interface ProductSpec {
  id: string;
  specKey: string;
  specValue: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string | null;
  imageUrl: string | null;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  countryOfOrigin: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured: boolean;
  isNew: boolean;
  soldCount: number;
  averageRating: number;
  reviewCount: number;
  category: Category | null;
  brand: Brand | null;
  images: ProductImage[];
  variants?: ProductVariant[];
  specs?: ProductSpec[];
}

export type ProductSortBy = 
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'best_selling'
  | 'rating'
  | 'name_asc';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sortBy?: ProductSortBy;
  search?: string;
}
