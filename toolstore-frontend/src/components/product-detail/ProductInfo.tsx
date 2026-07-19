import { useState } from 'react';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import type { Product, ProductVariant } from '../../types/product.types';
import { PriceDisplay } from '../shared/PriceDisplay';
import { RatingStars } from '../shared/RatingStars';
import { StockStatus } from '../shared/StockStatus';
import { QuantitySelector } from './QuantitySelector';
import { VariantSelector } from './VariantSelector';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (productId: string, variantId: string | null, quantity: number) => void;
  isAddingToCart?: boolean;
}

export function ProductInfo({ product, onAddToCart, isAddingToCart }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null,
  );

  const effectivePrice = product.price + (selectedVariant?.priceModifier ?? 0);
  const effectiveStock = selectedVariant?.stock ?? product.stock;

  return (
    <div className="space-y-5">
      <div>
        {product.brand && (
          <span className="text-sm font-medium text-gold-dark uppercase tracking-wide">
            {product.brand.name}
          </span>
        )}
        <h1 className="font-display text-h1 text-text-primary mt-1">{product.name}</h1>
        <p className="text-xs text-text-muted mt-1">کد محصول: {product.sku}</p>
      </div>

      {product.reviewCount > 0 && (
        <RatingStars rating={product.averageRating} reviewCount={product.reviewCount} />
      )}

      <PriceDisplay price={effectivePrice} compareAtPrice={product.compareAtPrice} size="lg" />

      <StockStatus stock={effectiveStock} />

      {product.shortDescription && (
        <p className="text-text-secondary leading-relaxed">{product.shortDescription}</p>
      )}

      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selected={selectedVariant}
          onSelect={setSelectedVariant}
        />
      )}

      <div className="flex items-center gap-3 pt-2">
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={effectiveStock} />

        <button
          onClick={() => onAddToCart(product.id, selectedVariant?.id ?? null, quantity)}
          disabled={effectiveStock === 0 || isAddingToCart}
          className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary font-bold py-3.5 rounded-button disabled:opacity-50 transition-colors"
        >
          <ShoppingCart size={18} />
          {effectiveStock === 0 ? 'ناموجود' : isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
        </button>

        <button className="w-12 h-12 flex items-center justify-center border border-border rounded-button hover:border-gold transition-colors">
          <Heart size={18} />
        </button>

        <button className="w-12 h-12 flex items-center justify-center border border-border rounded-button hover:border-gold transition-colors">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
