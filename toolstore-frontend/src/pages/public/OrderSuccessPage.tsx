import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export function OrderSuccessPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="bg-white border border-border rounded-card p-8 md:p-12 shadow-sm">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        
        <h1 className="font-display text-h2 text-text-primary mb-4">سفارش شما با موفقیت ثبت شد!</h1>
        <p className="text-text-secondary mb-8">
          از خرید شما سپاسگزاریم. سفارش شما دریافت شد و در حال پردازش است.
        </p>

        <div className="bg-background rounded-button p-6 mb-8 flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
          <span className="text-text-muted">شماره پیگیری سفارش:</span>
          <span className="font-bold text-lg text-gold-dark tracking-wider">{orderNumber}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/account/orders"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary font-bold px-8 py-3.5 rounded-button transition-colors"
          >
            <Package size={20} />
            پیگیری سفارش
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-border hover:border-gold text-text-primary font-bold px-8 py-3.5 rounded-button transition-colors"
          >
            بازگشت به خانه
            <ArrowRight size={20} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
