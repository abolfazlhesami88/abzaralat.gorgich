import { HeroSection } from '../../components/home/HeroSection';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import { BrandsStrip } from '../../components/home/BrandsStrip';
import { ValueProps } from '../../components/home/ValueProps';
import { NewArrivals } from '../../components/home/NewArrivals';
import { BestSellers } from '../../components/home/BestSellers';
import { AllProducts } from '../../components/home/AllProducts';
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
      <AllProducts />
      <NewsletterSection />
    </div>
  );
}
