import { HeroSection } from '../../components/home/HeroSection';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import { BrandsStrip } from '../../components/home/BrandsStrip';
import { NewArrivals } from '../../components/home/NewArrivals';
import { ValueProps } from '../../components/home/ValueProps';
import { BestSellers } from '../../components/home/BestSellers';
import { NewsletterSection } from '../../components/home/NewsletterSection';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandsStrip />
      <ValueProps />
      <NewArrivals />
      <BestSellers />
      <NewsletterSection />
    </div>
  );
}
