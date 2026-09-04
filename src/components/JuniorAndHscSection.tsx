import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { IMAGES } from '../lib/images';
import { Check, Layers, TestTube2, ArrowRight } from 'lucide-react';

interface JuniorAndHscSectionProps {
  onSelectService?: (serviceId: string) => void;
  onOpenBooking?: () => void;
}

export const JuniorAndHscSection: React.FC<JuniorAndHscSectionProps> = ({
  onSelectService,
  onOpenBooking,
}) => {
  const { t } = useLanguage();

  const handleTriggerBooking = (type: 'junior' | 'hsc') => {
    if (onSelectService) {
      onSelectService(type === 'junior' ? 'srv-junior' : 'srv-hsc');
    } else if (onOpenBooking) {
      onOpenBooking();
    }
  };

  return (
    <div id="curriculum" className="py-16 sm:py-24 space-y-16 sm:space-y-28 bg-[#FDFCF8] dark:bg-[#171714] border-b border-[#E8E4D9] dark:border-[#2D2D24] transition-colors duration-200">
      {/* 1. Junior Year Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual card */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm border border-[#E8E4D9] dark:border-[#313128] bg-[#F5F2ED] dark:bg-[#20201A]">
              <img
                src={IMAGES.juniorScience.url}
                alt={IMAGES.juniorScience.alt}
                className="w-full h-[260px] sm:h-[380px] object-cover"
                loading="lazy"
              />
              <div className="p-4 sm:p-5 bg-[#F5F2ED] dark:bg-[#20201A] border-t border-[#E8E4D9] dark:border-[#313128] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#5A5A40] dark:text-[#A3B18A] uppercase tracking-[0.2em] block">
                    NSW Stage 4 & 5
                  </span>
                  <span className="text-sm font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                    Years 7, 8, 9 & 10 Science
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#C6D4AB] rounded-full border border-[#D1C9BC] dark:border-[#38382E]">
                  Core Foundations
                </span>
              </div>
            </div>
          </div>

          {/* Text details */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E] text-[#5A5A40] dark:text-[#A3B18A] text-[10px] font-semibold uppercase tracking-[0.25em]">
              <Layers className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>NSW Science Foundations</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight leading-tight">
              {t('deep.junior.title')}
            </h2>

            <p className="text-base sm:text-lg text-[#6B6658] dark:text-[#A6A295] leading-relaxed font-light">
              {t('deep.junior.desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128]">
                <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('deep.junior.f1')}
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128]">
                <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('deep.junior.f2')}
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128]">
                <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('deep.junior.f3')}
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128]">
                <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('deep.junior.f4')}
                </span>
              </div>
            </div>

            <div className="pt-2 sm:pt-3">
              <button
                onClick={() => handleTriggerBooking('junior')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs uppercase tracking-widest font-semibold text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] bg-white dark:bg-[#20201A] hover:bg-[#F5F2ED] dark:hover:bg-[#282820] border border-[#E8E4D9] dark:border-[#313128] rounded-full transition-all cursor-pointer shadow-xs w-full sm:w-auto min-h-[44px]"
              >
                <span>Schedule Junior Science Lesson</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HSC Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E] text-[#5A5A40] dark:text-[#A3B18A] text-[10px] font-semibold uppercase tracking-[0.25em]">
              <TestTube2 className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>Stage 6 HSC Preparation</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight leading-tight">
              {t('deep.hsc.title')}
            </h2>

            <p className="text-base sm:text-lg text-[#6B6658] dark:text-[#A6A295] leading-relaxed font-light">
              {t('deep.hsc.desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128]">
                <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('deep.hsc.f1')}
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128]">
                <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('deep.hsc.f2')}
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128]">
                <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('deep.hsc.f3')}
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128]">
                <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('deep.hsc.f4')}
                </span>
              </div>
            </div>

            <div className="pt-2 sm:pt-3">
              <button
                onClick={() => handleTriggerBooking('hsc')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full transition-all cursor-pointer shadow-sm w-full sm:w-auto min-h-[44px]"
              >
                <span>Schedule HSC Science Lesson</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E8E4D9] dark:text-[#171714]" />
              </button>
            </div>
          </div>

          {/* Dual photo card */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 mt-6 lg:mt-0">
            <div className="rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#E8E4D9] dark:border-[#313128] shadow-xs bg-[#F5F2ED] dark:bg-[#20201A]">
              <img
                src={IMAGES.chemistryStudy.url}
                alt={IMAGES.chemistryStudy.alt}
                className="w-full h-44 sm:h-64 object-cover"
                loading="lazy"
              />
              <div className="p-3.5 sm:p-4 bg-[#F5F2ED] dark:bg-[#20201A] text-center border-t border-[#E8E4D9] dark:border-[#313128]">
                <span className="text-xs font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] block">
                  HSC Chemistry
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#8C867A] dark:text-[#A6A295] mt-0.5 block">
                  Equilibrium & Organic
                </span>
              </div>
            </div>

            <div className="rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#E8E4D9] dark:border-[#313128] shadow-xs bg-[#F5F2ED] dark:bg-[#20201A] mt-4 sm:mt-6">
              <img
                src={IMAGES.biologyStudy.url}
                alt={IMAGES.biologyStudy.alt}
                className="w-full h-44 sm:h-64 object-cover"
                loading="lazy"
              />
              <div className="p-3.5 sm:p-4 bg-[#F5F2ED] dark:bg-[#20201A] text-center border-t border-[#E8E4D9] dark:border-[#313128]">
                <span className="text-xs font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] block">
                  HSC Biology
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#8C867A] dark:text-[#A6A295] mt-0.5 block">
                  Genetics & Disease
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
