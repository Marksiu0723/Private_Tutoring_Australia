import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { IMAGES } from '../lib/images';
import { Mail, Clock } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  const { businessSettings } = useData();

  const businessEmail = businessSettings.business_email || 'shanon.lcm@gmail.com';

  return (
    <section id="about-philosophy" className="py-16 sm:py-24 lg:py-28 bg-[#FDFCF8] dark:bg-[#171714] border-b border-[#E8E4D9] dark:border-[#2D2D24] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Image with scientific desk notes */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm border border-[#E8E4D9] dark:border-[#313128] bg-[#F5F2ED] dark:bg-[#20201A]">
              <img
                src={IMAGES.notesDesk.url}
                alt={IMAGES.notesDesk.alt}
                className="w-full h-[280px] sm:h-[460px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Overlay badge */}
            <div className="absolute -bottom-3 right-3 sm:-bottom-5 sm:-right-5 bg-[#5A5A40] dark:bg-[#242D1F] text-[#FDFCF8] p-3.5 sm:p-4.5 rounded-[20px] sm:rounded-[24px] shadow-lg flex items-center gap-3 border border-[#484833] dark:border-[#3D4C35]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#484833] dark:bg-[#1D2518] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8E4D9] dark:text-[#A3B18A]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#E8E4D9] dark:text-[#C6D4AB]">
                  {t('about.scheduleTitle')}
                </p>
                <p className="text-xs font-serif font-medium text-white dark:text-[#EDEAE1] mt-0.5">
                  {t('about.scheduleHours')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Educational Statement */}
          <div className="lg:col-span-7 space-y-6 mt-4 lg:mt-0">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5A5A40] dark:text-[#A3B18A] px-4 py-1.5 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E]">
              {t('about.approachTag')}
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight leading-tight">
              {t('about.title')}
            </h2>

            <p className="text-base sm:text-lg text-[#6B6658] dark:text-[#A6A295] leading-relaxed font-light">
              {t('about.p1')}
            </p>

            <p className="text-base sm:text-lg text-[#6B6658] dark:text-[#A6A295] leading-relaxed font-light">
              {t('about.p2')}
            </p>

            {/* Direct Contact Card */}
            <div className="mt-8 p-5 sm:p-6 rounded-[22px] sm:rounded-[24px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#A3B18A] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                    {t('about.inquiries')}
                  </h4>
                  <p className="text-xs text-[#8C867A] dark:text-[#A6A295] mt-0.5 break-all">
                    {businessEmail}
                  </p>
                </div>
              </div>

              <a
                id="about-email-cta-link"
                href={`mailto:${businessEmail}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full transition-all shadow-xs cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <span>{t('about.contactCta')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
