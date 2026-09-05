import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { IMAGES } from '../lib/images';
import { Brain, Target, Activity } from 'lucide-react';

export const WhySection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#FDFCF8] dark:bg-[#171714] border-b border-[#E8E4D9] dark:border-[#2D2D24] overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5A5A40] dark:text-[#A3B18A] px-4 py-1.5 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E]">
            {t('why.methodologyTag')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight mt-4">
            {t('why.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#6B6658] dark:text-[#A6A295] mt-3.5 leading-relaxed font-light">
            {t('why.subtitle')}
          </p>
        </div>

        {/* 3 Pillars Grid with Visual Storytelling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: 3 Pillars */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Pillar 1 */}
            <div className="p-5 sm:p-7 rounded-[22px] sm:rounded-[28px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] hover:border-[#5A5A40] dark:hover:border-[#A3B18A] transition-colors shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#A3B18A] flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                    {t('why.point1.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6658] dark:text-[#A6A295] mt-1.5 sm:mt-2 leading-relaxed font-light">
                    {t('why.point1.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 sm:p-7 rounded-[22px] sm:rounded-[28px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] hover:border-[#5A5A40] dark:hover:border-[#A3B18A] transition-colors shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#A3B18A] flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                    {t('why.point2.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6658] dark:text-[#A6A295] mt-1.5 sm:mt-2 leading-relaxed font-light">
                    {t('why.point2.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 sm:p-7 rounded-[22px] sm:rounded-[28px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] hover:border-[#5A5A40] dark:hover:border-[#A3B18A] transition-colors shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#A3B18A] flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                    {t('why.point3.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6658] dark:text-[#A6A295] mt-1.5 sm:mt-2 leading-relaxed font-light">
                    {t('why.point3.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Curated Photo Story */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#E8E4D9] dark:border-[#313128] shadow-md bg-[#F5F2ED] dark:bg-[#20201A] relative">
              <img
                src={IMAGES.oneOnOne.url}
                alt={IMAGES.oneOnOne.alt}
                className="w-full h-[320px] sm:h-[420px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171714]/90 via-[#171714]/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-[#E8E4D9] dark:text-[#C6D4AB]">
                  {t('why.mentorshipTitle')}
                </p>
                <p className="text-xs sm:text-sm font-light mt-1.5 leading-relaxed text-[#FDFCF8]/95">
                  {t('why.mentorshipDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
