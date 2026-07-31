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
    <div className="space-y-6">
      <div className="space-y-2">
        {product.brand && (
          <span className="inline-block bg-gold-light/30 text-gold-dark text-xs font-semibold px-3 py-1 rounded-badge tracking-wider uppercase border border-gold/20">
            {product.brand.name}
          </span>
        )}
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
          {product.name}
        </h1>
        <p className="text-xs text-text-muted">کد محصول: {product.sku}</p>
      </div>

      {product.reviewCount > 0 && (
        <RatingStars rating={product.averageRating} reviewCount={product.reviewCount} />
      )}

      <div className="p-4 bg-surface rounded-card border border-border/70 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <PriceDisplay price={effectivePrice} compareAtPrice={product.compareAtPrice} size="lg" />
        <StockStatus stock={effectiveStock} />
      </div>

      {product.shortDescription && (
        <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{product.shortDescription}</p>
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
          type="button"
          onClick={() => onAddToCart(product.id, selectedVariant?.id ?? null, quantity)}
          disabled={effectiveStock === 0 || isAddingToCart}
          className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary font-bold py-3.5 px-6 rounded-button shadow-gold-glow hover:shadow-lg transition-all duration-200 disabled:opacity-50 active:scale-[0.99]"
        >
          <ShoppingCart size={18} />
          {effectiveStock === 0 ? 'موجودی تمام شده' : isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
        </button>

        <button type="button" aria-label="افزودن به علاقه مندی ها" className="w-12 h-12 flex items-center justify-center border border-border/80 rounded-button bg-surface hover:border-gold hover:text-gold-dark hover:bg-gold-light/20 transition-all duration-200">
          <Heart size={18} />
        </button>

        <button type="button" aria-label="اشتراک گذاری" className="w-12 h-12 flex items-center justify-center border border-border/80 rounded-button bg-surface hover:border-gold hover:text-gold-dark hover:bg-gold-light/20 transition-all duration-200">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
