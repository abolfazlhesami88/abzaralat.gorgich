import { ShieldCheck, Award, Wrench } from 'lucide-react';

export function BrandStorySection() {
  return (
    <div className="my-10 md:my-14 select-none">
      <div className="rounded-[24px] bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#f7f2e7] border border-[#ece4d3] shadow-[0_10px_36px_rgba(34,28,18,0.03)] p-8 md:p-12 relative overflow-hidden">
        {/* گلوی دکوراتیو شعاعی */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[radial-gradient(circle,rgba(217,184,105,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5edd6] border border-[#d9b869]/30 text-[#a67d34] text-xs font-bold mb-4 shadow-sm">
            <Wrench size={15} />
            <span>تخصص، اعتبار و اصالت ابزار</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#221c12] leading-tight mb-4">
            تأمین‌کننده رسمی ابزارآلات صنعت و کارگاه در ایران
          </h2>

          <p className="text-[#8c8272] text-sm md:text-base leading-relaxed mb-8 font-normal max-w-2xl mx-auto">
            مجموعه «ابزارآلات گرگیچ» با بیش از دو دهه تجربه تخصصی در تامین و توزیع تجهیزات برقی، شارژی و دستی، مرجع مطمئن انتخاب صنعتگران، تکنسین‌ها و استادکاران ایرانی است.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#ece4d3]">
            <div className="flex items-center justify-center gap-3 p-3 rounded-[16px] bg-white/80 border border-[#ece4d3]">
              <ShieldCheck size={22} className="text-[#c79a4b] shrink-0" />
              <div className="text-right">
                <h3 className="font-extrabold text-sm text-[#221c12]">۱۰۰٪ اصالت کالا</h3>
                <p className="text-[11px] text-[#8c8272]">ضمانت تعویض و اصالت برندها</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-3 rounded-[16px] bg-white/80 border border-[#ece4d3]">
              <Award size={22} className="text-[#c79a4b] shrink-0" />
              <div className="text-right">
                <h3 className="font-extrabold text-sm text-[#221c12]">گارانتی معتبر</h3>
                <p className="text-[11px] text-[#8c8272]">خدمات پس از فروش واقعی</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-3 rounded-[16px] bg-white/80 border border-[#ece4d3]">
              <Wrench size={22} className="text-[#c79a4b] shrink-0" />
              <div className="text-right">
                <h3 className="font-extrabold text-sm text-[#221c12]">مشاوره تخصصی</h3>
                <p className="text-[11px] text-[#8c8272]">پاسخگویی کارشناسان فنی</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
