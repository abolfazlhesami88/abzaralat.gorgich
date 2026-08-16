import { HeroSection } from '../../components/home/HeroSection';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import { BannerGrid } from '../../components/home/BannerGrid';
import { PowerToolsSection } from '../../components/home/PowerToolsSection';
import { BrandStorySection } from '../../components/home/BrandStorySection';
import { BestSellers } from '../../components/home/BestSellers';
import { ValueProps } from '../../components/home/ValueProps';
import { NewArrivals } from '../../components/home/NewArrivals';
import { BrandsStrip } from '../../components/home/BrandsStrip';
import { AllProducts } from '../../components/home/AllProducts';
import { NewsletterSection } from '../../components/home/NewsletterSection';

export function HomePage() {
  return (
    <div className="bg-[#fdfcfa] min-h-screen font-body text-[#221c12]">
      {/* ۱. هیرو پرمیوم معلق */}
      <HeroSection />

      <div className="container mx-auto px-4">
        {/* ۲. دسته‌بندی‌ها */}
        <CategoryGrid />

        {/* ۳. محصولات ویژه (پنل طلایی) */}
        <FeaturedProducts />

        {/* ۴. گرید بنرهای تبلیغاتی ۱ */}
        <BannerGrid />

        {/* ۵. ابزار برقی و شارژی (پنل آبی-فولادی) */}
        <PowerToolsSection />

        {/* ۶. داستان و تخصص برند */}
        <BrandStorySection />

        {/* ۷. پرفروش‌ترین‌ها (پنل مسی گرم) */}
        <BestSellers />

        {/* ۸. برندها و ارزش‌ها */}
        <BrandsStrip />
        <ValueProps />

        {/* ۹. جدیدترین‌ها (پنل خاکستری تیره / برنز) */}
        <NewArrivals />

        {/* ۱۰. همه محصولات */}
        <AllProducts />
      </div>

      {/* ۱۱. خبرنامه */}
      <NewsletterSection />
    </div>
  );
}
