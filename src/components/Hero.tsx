import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { IMAGES } from '../lib/images';
import { Calendar, Compass, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenServices?: () => void;
  onExploreServices?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenServices, onExploreServices }) => {
  const { t } = useLanguage();

  const handleExplore = () => {
    if (onOpenServices) onOpenServices();
    else if (onExploreServices) onExploreServices();
    else {
      const el = document.getElementById('services-curriculum') || document.getElementById('tutoring-services');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FDFCF8] dark:bg-[#171714] pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-20 lg:pb-28 bg-natural-pattern border-b border-[#E8E4D9] dark:border-[#2D2D24] transition-colors duration-200">
      {/* Decorative Natural Tones Ambient Aura */}
      <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-[#5A5A40]/15 dark:from-[#A3B18A]/10 to-[#A89F8D]/20 dark:to-[#8F9E72]/10 absolute -right-16 -top-16 blur-3xl pointer-events-none -z-10" />
      <div className="w-80 h-80 rounded-full bg-[#E8E4D9]/60 dark:bg-[#2A2A22]/50 absolute bottom-4 left-6 blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Natural Tones Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E] text-[#5A5A40] dark:text-[#A3B18A] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight leading-[1.15]">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-[#6B6658] dark:text-[#A6A295] leading-relaxed max-w-2xl font-light">
              {t('hero.subtitle')}
            </p>

            {/* Value Indicators - Natural Tones Rounded Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 sm:pt-2">
              <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('hero.feature1')}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('hero.feature2')}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-[20px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#4A4A40] dark:text-[#EDEAE1]">
                  {t('hero.feature3')}
                </span>
              </div>
            </div>

            {/* Action Buttons - Pill Shaped with mobile full-width handling */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 sm:pt-4">
              <button
                id="hero-book-cta-btn"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] hover:bg-[#484833] dark:bg-[#A3B18A] dark:hover:bg-[#8F9E72] active:scale-[0.98] rounded-full shadow-md shadow-[#5A5A40]/15 dark:shadow-none transition-all cursor-pointer min-h-[48px]"
              >
                <Calendar className="w-4 h-4 text-[#E8E4D9] dark:text-[#171714]" />
                <span>{t('hero.ctaBook')}</span>
              </button>

              <button
                id="hero-explore-cta-btn"
                onClick={handleExplore}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-xs uppercase tracking-widest font-semibold text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] bg-white dark:bg-[#20201A] hover:bg-[#F5F2ED] dark:hover:bg-[#282820] rounded-full border border-[#E8E4D9] dark:border-[#313128] transition-all cursor-pointer min-h-[48px]"
              >
                <Compass className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295]" />
                <span>{t('hero.ctaExplore')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Natural Framed Imagery */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Subtle natural framing */}
              <div className="absolute -inset-2.5 sm:-inset-3 rounded-[32px] sm:rounded-[36px] bg-[#E8E4D9]/70 dark:bg-[#2A2A22]/70 transform rotate-1 scale-102 -z-10" />

              <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-xl border border-[#E8E4D9] dark:border-[#313128] bg-[#F5F2ED] dark:bg-[#20201A]">
                <img
                  src={IMAGES.hero.url}
                  alt={IMAGES.hero.alt}
                  className="w-full h-[320px] sm:h-[460px] object-cover"
                  loading="eager"
                />

                {/* Natural Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-[#FDFCF8]/95 dark:bg-[#1A1A15]/95 backdrop-blur-md p-3.5 sm:p-4 rounded-[20px] sm:rounded-[24px] border border-[#E8E4D9] dark:border-[#313128] shadow-md flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-[#E8E4D9] dark:text-[#171714]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2D2C27] dark:text-[#EDEAE1] truncate">
                        NSW Science Syllabus
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#8C867A] dark:text-[#A6A295] font-medium truncate">
                        Stage 4, 5 & Stage 6 (HSC)
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 sm:px-3 py-1 bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#C6D4AB] rounded-full shrink-0">
                    7 Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
