import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, CheckCircle, ArrowRight, RotateCw, KeyRound, Lock } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { AuthBrandPanel } from '../../components/auth/AuthBrandPanel';
import { toast } from 'react-hot-toast';

export function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ایمیل/پسورد سنتی
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // تایمر ۶۰ ثانیه‌ای برای ارسال مجدد کد
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // درخواست کد OTP (مرحله اول)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim();
    if (!/^09\d{9}$/.test(cleanPhone)) {
      setError('شماره موبایل معتبر نیست. (مثال: 09123456789)');
      return;
    }

    setLoading(true);
    try {
      await authApi.requestOtp({ phone: cleanPhone });
      toast.success('کد تأیید پیامک شد');
      setStep('otp');
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'خطا در ارسال کد تأیید');
    } finally {
      setLoading(false);
    }
  };

  // تأیید کد OTP (مرحله دوم)
  const handleVerifyOtp = async (codeString?: string) => {
    const fullCode = codeString ?? otp.join('');
    if (fullCode.length !== 6) {
      setError('لطفاً کد ۶ رقمی را به طور کامل وارد کنید');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ phone: phone.trim(), code: fullCode });
      setAuth(res.user, res.accessToken);
      await mergeGuestCart();

      toast.success('خوش آمدید!');
      const defaultPath = res.user.role === 'admin' ? '/admin' : '/account';
      const from = (location.state as any)?.from ?? defaultPath;
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'کد وارد شده نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  // تغییرات باکس‌های ۶ رقمی کد
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join('');
    if (fullCode.length === 6 && !newOtp.includes('')) {
      handleVerifyOtp(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      digits.forEach((d, i) => {
        if (inputRefs.current[i]) inputRefs.current[i]!.value = d;
      });
      handleVerifyOtp(pastedData);
    }
  };

  // ورود سنتی ایمیل/رمز
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setAuth(res.user, res.accessToken);
      await mergeGuestCart();

      const defaultPath = res.user.role === 'admin' ? '/admin' : '/account';
      const from = (location.state as any)?.from ?? defaultPath;
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'ایمیل یا رمز عبور اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfa] flex flex-col lg:flex-row select-none">
      {/* نیمه راست — پنل برند هویتی */}
      <AuthBrandPanel />

      {/* نیمه چپ — فرم دو مرحله‌ای OTP */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#8c8272] hover:text-[#c79a4b] transition-colors"
        >
          <span>بازگشت به فروشگاه</span>
          <ArrowRight size={15} />
        </Link>

        <div className="w-full max-w-md my-auto py-6">
          {/* مرحله ۱: ورود شماره موبایل */}
          {step === 'phone' && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdfbf7] via-[#f9f4ea] to-[#f5edd6] border border-[#f0e6cc] flex items-center justify-center mx-auto mb-4 text-[#c79a4b] shadow-sm">
                  <Smartphone size={26} />
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#221c12]">
                  ورود / ثبت‌نام سریع
                </h1>
                <p className="text-sm text-[#8c8272] mt-2 font-normal">
                  لطفاً شماره تلفن همراه خود را وارد نمایید
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-[#221c12] block mb-1.5">
                    شماره موبایل *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    dir="ltr"
                    maxLength={11}
                    className="w-full h-12 px-4 rounded-[13px] border border-[#ece4d3] bg-[#faf7f2] text-[#221c12] text-center tracking-widest text-base font-extrabold placeholder:text-[#8c8272]/40 shadow-[inset_0_2px_4px_rgba(34,28,18,0.04)] focus:outline-none focus:border-[#c79a4b] focus:bg-white focus:shadow-[0_0_14px_rgba(199,154,75,0.22)] transition-all duration-200"
                  />
                  {error && <p className="text-xs text-danger mt-2 font-medium bg-danger/10 border border-danger/20 rounded-[10px] px-3 py-2">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold text-sm sm:text-base rounded-[13px] shadow-[0_4px_18px_rgba(199,154,75,0.35)] hover:shadow-[0_6px_26px_rgba(199,154,75,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>{loading ? 'در حال ارسال کد...' : 'دریافت کد تأیید (SMS)'}</span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#ece4d3] text-center">
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); }}
                  className="text-xs font-bold text-[#a67d34] hover:underline"
                >
                  ورود با ایمیل و رمز عبور
                </button>
              </div>
            </div>
          )}

          {/* مرحله ۲: ورود کد ۶ رقمی OTP */}
          {step === 'otp' && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdfbf7] via-[#f9f4ea] to-[#f5edd6] border border-[#f0e6cc] flex items-center justify-center mx-auto mb-4 text-[#c79a4b] shadow-sm">
                  <KeyRound size={26} />
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#221c12]">
                  کد تأیید را وارد کنید
                </h1>
                <p className="text-sm text-[#8c8272] mt-2 font-normal">
                  کد ۶ رقمی به شماره <span className="font-extrabold text-[#221c12]" dir="ltr">{phone}</span> ارسال شد.{' '}
                  <button
                    onClick={() => { setStep('phone'); setError(''); }}
                    className="text-[#a67d34] font-bold hover:underline mr-1"
                  >
                    ویرایش شماره
                  </button>
                </p>
              </div>

              {/* ۶ باکس جداگانه کد ۶ رقمی */}
              <div className="mb-6" dir="ltr">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-11 h-13 sm:w-12 sm:h-14 rounded-[12px] border border-[#ece4d3] bg-[#faf7f2] text-center font-extrabold text-xl text-[#221c12] shadow-[inset_0_2px_4px_rgba(34,28,18,0.04)] focus:outline-none focus:border-[#c79a4b] focus:bg-white focus:shadow-[0_0_14px_rgba(199,154,75,0.25)] transition-all duration-200"
                    />
                  ))}
                </div>
                {error && <p className="text-xs text-danger mt-3 text-center font-medium bg-danger/10 border border-danger/20 rounded-[10px] px-3 py-2" dir="rtl">{error}</p>}
              </div>

              {/* تایمر و دکمه ارسال مجدد */}
              <div className="text-center mb-6">
                {timer > 0 ? (
                  <p className="text-xs text-[#8c8272] font-medium">
                    ارسال مجدد کد تا <span className="font-extrabold text-[#a67d34]">{timer}</span> ثانیه دیگر
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a67d34] hover:text-[#c79a4b] hover:underline"
                  >
                    <RotateCw size={14} />
                    <span>ارسال مجدد کد پیامکی</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.includes('')}
                className="w-full h-12 bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold text-sm sm:text-base rounded-[13px] shadow-[0_4px_18px_rgba(199,154,75,0.35)] hover:shadow-[0_6px_26px_rgba(199,154,75,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <CheckCircle size={18} />
                <span>{loading ? 'در حال تأیید...' : 'تأیید و ورود به حساب'}</span>
              </button>
            </div>
          )}

          {/* ورود سنتی ایمیل/رمز */}
          {step === 'email' && (
            <div>
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#221c12]">
                  ورود با ایمیل
                </h1>
                <p className="text-sm text-[#8c8272] mt-2 font-normal">
                  پست الکترونیک و رمز عبور خود را وارد نمایید
                </p>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-[#221c12] block mb-1.5">ایمیل</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    dir="ltr"
                    className="w-full h-12 px-4 rounded-[13px] border border-[#ece4d3] bg-[#faf7f2] text-[#221c12] text-sm shadow-[inset_0_2px_4px_rgba(34,28,18,0.04)] focus:outline-none focus:border-[#c79a4b]"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-[#221c12] block mb-1.5">رمز عبور</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full h-12 px-4 rounded-[13px] border border-[#ece4d3] bg-[#faf7f2] text-[#221c12] text-sm shadow-[inset_0_2px_4px_rgba(34,28,18,0.04)] focus:outline-none focus:border-[#c79a4b]"
                  />
                </div>
                {error && <p className="text-xs text-danger font-medium bg-danger/10 p-2.5 rounded-[10px]">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold text-sm rounded-[13px] shadow-md flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  <span>ورود با ایمیل</span>
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setStep('phone'); setError(''); }}
                  className="text-xs font-bold text-[#a67d34] hover:underline"
                >
                  بازگشت به ورود سریع با شماره موبایل
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
