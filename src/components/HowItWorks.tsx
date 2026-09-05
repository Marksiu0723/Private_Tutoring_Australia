import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Calendar, UserCheck, Smartphone } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: BookOpen,
      title: t('how.step1.title'),
      desc: t('how.step1.desc'),
    },
    {
      num: '02',
      icon: Calendar,
      title: t('how.step2.title'),
      desc: t('how.step2.desc'),
    },
    {
      num: '03',
      icon: UserCheck,
      title: t('how.step3.title'),
      desc: t('how.step3.desc'),
    },
    {
      num: '04',
      icon: Smartphone,
      title: t('how.step4.title'),
      desc: t('how.step4.desc'),
    },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#FDFCF8] dark:bg-[#171714] border-b border-[#E8E4D9] dark:border-[#2D2D24] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5A5A40] dark:text-[#A3B18A] px-4 py-1.5 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E]">
            {t('how.title')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight mt-4">
            {t('how.transparentHeading')}
          </h2>
          <p className="text-base sm:text-lg text-[#6B6658] dark:text-[#A6A295] mt-3.5 leading-relaxed font-light">
            {t('how.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 border border-[#E8E4D9] dark:border-[#313128] shadow-xs relative group hover:border-[#5A5A40] dark:hover:border-[#A3B18A] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#A3B18A] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-serif text-[#D1C9BC] dark:text-[#38382E] group-hover:text-[#5A5A40] dark:group-hover:text-[#A3B18A] transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B6658] dark:text-[#A6A295] leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 border-t border-[#E8E4D9] dark:border-[#313128] flex items-center text-[10px] uppercase tracking-widest font-semibold text-[#8C867A] dark:text-[#A6A295]">
                  <span>{t('how.stepIndicator').replace('{n}', String(idx + 1))}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
