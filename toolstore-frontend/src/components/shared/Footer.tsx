import { Link } from 'react-router-dom';
import { MessageCircle, Send, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-text-primary text-white mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl font-bold mb-3">
            ToolStore<span className="text-gold">Pro</span>
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            فروشگاه تخصصی ابزار و یراقآلات حرفهای با ضمانت اصالت کالا
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-text-primary transition-colors">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-text-primary transition-colors">
              <Send size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-gold">راهنمای خرید</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/faq" className="hover:text-gold transition-colors">سوالات متداول</Link></li>
            <li><Link to="/shipping" className="hover:text-gold transition-colors">نحوه ارسال کالا</Link></li>
            <li><Link to="/returns" className="hover:text-gold transition-colors">رویه بازگرداندن کالا</Link></li>
            <li><Link to="/terms" className="hover:text-gold transition-colors">شرایط و قوانین</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-gold">خدمات مشتریان</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/contact" className="hover:text-gold transition-colors">تماس با ما</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">درباره ما</Link></li>
            <li><Link to="/guarantee" className="hover:text-gold transition-colors">گارانتی محصولات</Link></li>
            <li><Link to="/privacy" className="hover:text-gold transition-colors">حریم خصوصی</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-gold">ارتباط با ما</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin size={18} className="shrink-0 text-gold" />
              <span>تهران، خیابان امام خمینی، میدان حسنآباد، پاساژ ابزار، پلاک ۱۲</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="shrink-0 text-gold" />
              <span dir="ltr">۰۲۱ - ۶۶۷۰ ۱۲۳۴</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} className="shrink-0 text-gold" />
              <span>info@toolstorepro.ir</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
        تمامی حقوق برای فروشگاه ToolStore Pro محفوظ است. &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
