import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, CheckCircle, ArrowRight, RotateCw, KeyRound } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';
import { AuthBrandPanel } from '../../components/auth/AuthBrandPanel';
import { toast } from 'react-hot-toast';

export function RegisterPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

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
      toast.success('حساب کاربری شما فعال شد');
      navigate('/account', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'کد وارد شده نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#fdfcfa] flex flex-col lg:flex-row select-none">
      <AuthBrandPanel />

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#8c8272] hover:text-[#c79a4b] transition-colors"
        >
          <span>بازگشت به فروشگاه</span>
          <ArrowRight size={15} />
        </Link>

        <div className="w-full max-w-md my-auto py-6">
          {step === 'phone' && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdfbf7] via-[#f9f4ea] to-[#f5edd6] border border-[#f0e6cc] flex items-center justify-center mx-auto mb-4 text-[#c79a4b] shadow-sm">
                  <Smartphone size={26} />
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#221c12]">
                  عضویت سریع در ابزارآلات گرگیچ
                </h1>
                <p className="text-sm text-[#8c8272] mt-2 font-normal">
                  با وارد کردن شماره موبایل، حساب جدید برای شما به صورت خودکار ساخته می‌شود
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
                  <span>{loading ? 'در حال ارسال کد...' : 'دریافت کد ثبت‌نام (SMS)'}</span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#ece4d3] text-center">
                <p className="text-sm text-[#8c8272]">
                  قبلاً ثبت‌نام کرده‌اید؟{' '}
                  <Link to="/login" className="text-[#a67d34] font-extrabold hover:underline">
                    ورود به حساب
                  </Link>
                </p>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdfbf7] via-[#f9f4ea] to-[#f5edd6] border border-[#f0e6cc] flex items-center justify-center mx-auto mb-4 text-[#c79a4b] shadow-sm">
                  <KeyRound size={26} />
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#221c12]">
                  کد ۶ رقمی را وارد کنید
                </h1>
                <p className="text-sm text-[#8c8272] mt-2 font-normal">
                  کد به شماره <span className="font-extrabold text-[#221c12]" dir="ltr">{phone}</span> ارسال گردید.
                </p>
              </div>

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
                      className="w-11 h-13 sm:w-12 sm:h-14 rounded-[12px] border border-[#ece4d3] bg-[#faf7f2] text-center font-extrabold text-xl text-[#221c12] shadow-[inset_0_2px_4px_rgba(34,28,18,0.04)] focus:outline-none focus:border-[#c79a4b] focus:bg-white focus:shadow-[0_0_14px_rgba(199,154,75,0.25)] transition-all duration-200"
                    />
                  ))}
                </div>
                {error && <p className="text-xs text-danger mt-3 text-center font-medium bg-danger/10 border border-danger/20 rounded-[10px] px-3 py-2" dir="rtl">{error}</p>}
              </div>

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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a67d34] hover:underline"
                  >
                    <RotateCw size={14} />
                    <span>ارسال مجدد کد</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.includes('')}
                className="w-full h-12 bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold text-sm sm:text-base rounded-[13px] shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <CheckCircle size={18} />
                <span>تکمیل ساخت حساب و ورود</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
