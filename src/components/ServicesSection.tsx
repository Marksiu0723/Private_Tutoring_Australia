import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Service } from '../types';
import { Clock, ArrowRight, Sparkles, Check } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { t, language } = useLanguage();
  const { activeServices, loading } = useData();

  // Helper to format price strictly respecting the NULL rule
  const renderPrice = (price: number | null) => {
    if (price === null || price === undefined) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#D1C9BC] dark:border-[#38382E]">
          <Sparkles className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
          {t('services.pricePending')}
        </span>
      );
    }
    return (
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">${price}</span>
        <span className="text-xs uppercase tracking-wider font-medium text-[#8C867A] dark:text-[#A6A295]">{t('services.audPerSession')}</span>
      </div>
    );
  };

  return (
    <section id="tutoring-services" className="py-16 sm:py-24 lg:py-28 bg-[#FDFCF8] dark:bg-[#171714] border-b border-[#E8E4D9] dark:border-[#2D2D24] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5A5A40] dark:text-[#A3B18A] px-4 py-1.5 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E]">
            {t('services.title')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight mt-4">
            {t('services.heading')}
          </h2>
          <p className="text-base sm:text-lg text-[#6B6658] dark:text-[#A6A295] mt-3.5 leading-relaxed font-light">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Dynamic Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-3 border-[#5A5A40] dark:border-[#A3B18A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeServices.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F2ED] dark:bg-[#20201A] rounded-[28px] border border-[#E8E4D9] dark:border-[#313128] p-8">
            <p className="text-[#8C867A] dark:text-[#A6A295]">No tutoring services currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {activeServices.map((service) => {
              const isJunior = service.name.toLowerCase().includes('junior') || service.name.includes('7');

              const displayName = language === 'zh'
                ? (isJunior ? t('services.srvJuniorName') : t('services.srvHscName'))
                : service.name;

              const displayDescription = language === 'zh'
                ? (isJunior ? t('services.srvJuniorDesc') : t('services.srvHscDesc'))
                : (service.description || 'Personalised one-to-one science tutoring tailored to the student\'s learning goals.');

              return (
                <div
                  key={service.id}
                  id={`service-card-${service.id}`}
                  className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[24px] sm:rounded-[28px] p-6 sm:p-9 border border-[#E8E4D9] dark:border-[#313128] hover:border-[#5A5A40] dark:hover:border-[#A3B18A] transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div>
                    {/* Badge & Duration */}
                    <div className="flex items-center justify-between mb-5 gap-2">
                      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] px-3 sm:px-3.5 py-1 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#C6D4AB]">
                        {isJunior ? t('services.juniorBadge') : t('services.hscBadge')}
                      </span>

                      {/* Duration */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C867A] dark:text-[#A6A295] bg-white/80 dark:bg-[#282820] px-3 py-1 rounded-full border border-[#E8E4D9] dark:border-[#38382E]">
                        <Clock className="w-3.5 h-3.5 text-[#8C867A] dark:text-[#A6A295]" />
                        <span>
                          {service.duration_minutes} {t('services.minutes')}
                        </span>
                      </div>
                    </div>

                    {/* Service Name */}
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight group-hover:text-[#5A5A40] dark:group-hover:text-[#A3B18A] transition-colors">
                      {displayName}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-[#6B6658] dark:text-[#A6A295] mt-3 leading-relaxed min-h-[44px] sm:min-h-[50px] font-light">
                      {displayDescription}
                    </p>

                    {/* Curricular Highlights */}
                    <div className="mt-6 pt-5 border-t border-[#E8E4D9] dark:border-[#313128] space-y-2.5">
                      {isJunior ? (
                        <>
                          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A4A40] dark:text-[#EDEAE1]">
                            <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                            <span>{t('services.srvJuniorH1')}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A4A40] dark:text-[#EDEAE1]">
                            <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                            <span>{t('services.srvJuniorH2')}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A4A40] dark:text-[#EDEAE1]">
                            <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                            <span>{t('services.srvJuniorH3')}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A4A40] dark:text-[#EDEAE1]">
                            <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                            <span>{t('services.srvHscH1')}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A4A40] dark:text-[#EDEAE1]">
                            <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                            <span>{t('services.srvHscH2')}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4A4A40] dark:text-[#EDEAE1]">
                            <Check className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                            <span>{t('services.srvHscH3')}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Pricing state & Book button */}
                  <div className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-[#E8E4D9] dark:border-[#313128] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>{renderPrice(service.price)}</div>

                    <button
                      id={`book-service-${service.id}-btn`}
                      onClick={() => onSelectService(service.id)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] active:scale-[0.98] rounded-full transition-all cursor-pointer shadow-xs w-full sm:w-auto min-h-[44px]"
                    >
                      <span>{t('services.bookBtn')}</span>
                      <ArrowRight className="w-4 h-4 text-[#E8E4D9] dark:text-[#171714]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
