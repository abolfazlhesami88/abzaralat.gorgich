import { useState } from 'react';
import { Mail } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="bg-gold py-14">
      <div className="container mx-auto px-4 text-center">
        <Mail size={32} className="mx-auto mb-3 text-text-primary" />
        <h2 className="font-display text-h2 text-text-primary mb-2">
          از تخفیفهای ویژه باخبر شوید
        </h2>
        <p className="text-text-primary/70 mb-6">عضویت در خبرنامه ToolStore Pro</p>
        <form className="flex max-w-md mx-auto gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل شما"
            className="flex-1 h-12 px-4 rounded-button border-0 focus:outline-none focus:ring-2 focus:ring-text-primary"
          />
          <button className="bg-text-primary text-white px-6 rounded-button font-semibold hover:bg-text-primary/90 transition-colors">
            عضویت
          </button>
        </form>
      </div>
    </section>
  );
}
