import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { PackageOption, PackageId } from '../types';
import { Check, Sparkles } from 'lucide-react';

interface PackagesSectionProps {
  onSelectPackage: (packageId: PackageId) => void;
}

export const PACKAGES: PackageOption[] = [
  {
    id: 'single',
    sessions: 1,
    titleKey: 'packages.single.title',
    subtitleKey: 'packages.single.subtitle',
    isPopular: false,
  },
  {
    id: '10-pack',
    sessions: 10,
    titleKey: 'packages.10pack.title',
    subtitleKey: 'packages.10pack.subtitle',
    isPopular: true,
  },
];

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage }) => {
  const { t, language } = useLanguage();
  const { activeServices } = useData();

  // Find a representative active service to check if numeric prices exist
  const firstService = activeServices[0];
  const hasNumericPrice = typeof firstService?.price === 'number';
  const samplePrice = firstService?.price ?? null;

  return (
    <section id="tutoring-packages" className="py-16 sm:py-24 lg:py-28 bg-[#FDFCF8] dark:bg-[#171714] border-b border-[#E8E4D9] dark:border-[#2D2D24] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5A5A40] dark:text-[#A3B18A] px-4 py-1.5 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E]">
            {t('packages.title')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight mt-4">
            {t('packages.heading')}
          </h2>
          <p className="text-base sm:text-lg text-[#6B6658] dark:text-[#A6A295] mt-3.5 leading-relaxed font-light">
            {t('packages.subtitle')}
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {PACKAGES.map((pkg) => {
            const isTenPack = pkg.id === '10-pack';
            return (
              <div
                key={pkg.id}
                id={`package-card-${pkg.id}`}
                className={`rounded-[28px] sm:rounded-[32px] p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                  pkg.isPopular
                    ? 'bg-[#5A5A40] dark:bg-[#242D1F] text-[#FDFCF8] shadow-xl border-2 border-[#484833] dark:border-[#3D4C35] md:scale-[1.02]'
                    : 'bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] text-[#4A4A40] dark:text-[#EDEAE1] hover:border-[#5A5A40] dark:hover:border-[#A3B18A] shadow-sm'
                }`}
              >
                {/* Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E8E4D9] dark:bg-[#A3B18A] text-[#5A5A40] dark:text-[#171714] text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full border border-[#D1C9BC] dark:border-[#8F9E72] shadow-xs whitespace-nowrap">
                    {t('packages.10pack.recurrenceBadge')}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full ${
                        pkg.isPopular
                          ? 'bg-[#484833] dark:bg-[#1D2518] text-[#E8E4D9] dark:text-[#C6D4AB]'
                          : 'bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#A3B18A]'
                      }`}
                    >
                      {pkg.sessions} {t('packages.lessons')}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        pkg.isPopular ? 'text-[#D1C9BC]' : 'text-[#8C867A] dark:text-[#A6A295]'
                      }`}
                    >
                      {isTenPack ? t('packages.recurringCadence') : t('packages.oneTimeSession')}
                    </span>
                  </div>

                  <h3
                    className={`text-2xl sm:text-3xl font-serif mt-5 tracking-tight font-bold ${
                      pkg.isPopular ? 'text-white' : 'text-[#2D2C27] dark:text-[#EDEAE1]'
                    }`}
                  >
                    {t(pkg.titleKey)}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm mt-2.5 leading-relaxed min-h-[44px] font-light ${
                      pkg.isPopular ? 'text-[#E8E4D9]' : 'text-[#6B6658] dark:text-[#A6A295]'
                    }`}
                  >
                    {t(pkg.subtitleKey)}
                  </p>

                  {/* Pricing Display */}
                  <div className={`mt-6 pt-5 border-t ${pkg.isPopular ? 'border-[#484833] dark:border-[#35432E]' : 'border-[#E8E4D9] dark:border-[#313128]'}`}>
                    {hasNumericPrice && samplePrice !== null ? (
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`text-3xl sm:text-4xl font-serif font-bold ${
                              pkg.isPopular ? 'text-white' : 'text-[#2D2C27] dark:text-[#EDEAE1]'
                            }`}
                          >
                            ${samplePrice * pkg.sessions}
                          </span>
                          <span
                            className={`text-xs uppercase tracking-wider font-medium ${
                              pkg.isPopular ? 'text-[#D1C9BC]' : 'text-[#8C867A] dark:text-[#A6A295]'
                            }`}
                          >
                            {t('packages.audEst')}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] block mt-1.5 font-medium ${
                            pkg.isPopular ? 'text-[#E8E4D9]' : 'text-[#5A5A40] dark:text-[#C6D4AB]'
                          }`}
                        >
                          ${samplePrice} {t('packages.perLesson')}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles
                          className={`w-4 h-4 ${
                            pkg.isPopular ? 'text-[#E8E4D9]' : 'text-[#5A5A40] dark:text-[#A3B18A]'
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            pkg.isPopular ? 'text-[#E8E4D9]' : 'text-[#5A5A40] dark:text-[#C6D4AB]'
                          }`}
                        >
                          {t('services.pricePending')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Highlights */}
                  <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">
                    <li className="flex items-center gap-2.5">
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          pkg.isPopular ? 'text-[#E8E4D9]' : 'text-[#5A5A40] dark:text-[#A3B18A]'
                        }`}
                      />
                      <span className={pkg.isPopular ? 'text-[#F5F2ED]' : 'text-[#4A4A40] dark:text-[#EDEAE1]'}>
                        {language === 'zh'
                          ? `${pkg.sessions} ${t('packages.lessonsUnit')}`
                          : `${pkg.sessions}x ${t('packages.lessonsUnit')}`}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          pkg.isPopular ? 'text-[#E8E4D9]' : 'text-[#5A5A40] dark:text-[#A3B18A]'
                        }`}
                      />
                      <span className={pkg.isPopular ? 'text-[#F5F2ED]' : 'text-[#4A4A40] dark:text-[#EDEAE1]'}>
                        {isTenPack
                          ? t('packages.10packHighlight')
                          : t('packages.singleHighlight')}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          pkg.isPopular ? 'text-[#E8E4D9]' : 'text-[#5A5A40] dark:text-[#A3B18A]'
                        }`}
                      />
                      <span className={pkg.isPopular ? 'text-[#F5F2ED]' : 'text-[#4A4A40] dark:text-[#EDEAE1]'}>
                        {t('packages.sevenDaysAvailability')}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check
                        className={`w-4 h-4 shrink-0 font-bold ${
                          pkg.isPopular ? 'text-[#C6D4AB]' : 'text-[#5A5A40] dark:text-[#A3B18A]'
                        }`}
                      />
                      <span className={`font-medium ${pkg.isPopular ? 'text-[#F5F2ED]' : 'text-[#2D2C27] dark:text-[#EDEAE1]'}`}>
                        {t('packages.changePortalAnytime')}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    id={`select-package-${pkg.id}-btn`}
                    onClick={() => onSelectPackage(pkg.id)}
                    className={`w-full py-4 px-5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer text-center min-h-[48px] shadow-sm ${
                      pkg.isPopular
                        ? 'bg-[#FDFCF8] hover:bg-[#E8E4D9] text-[#5A5A40] font-bold'
                        : 'bg-[#5A5A40] hover:bg-[#484833] dark:bg-[#A3B18A] dark:hover:bg-[#8F9E72] text-white dark:text-[#171714]'
                    }`}
                  >
                    {isTenPack ? t('packages.book10Btn') : t('packages.book1Btn')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Portal Flexibility Guarantee Callout */}
        <div className="mt-12 max-w-4xl mx-auto rounded-[24px] p-6 sm:p-7 bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5A5A40] dark:text-[#A3B18A]">
              {t('packages.flexibilityTitle')}
            </span>
            <h4 className="text-base sm:text-lg font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">
              {t('packages.flexibilityHeading')}
            </h4>
            <p className="text-xs text-[#6B6658] dark:text-[#A6A295] font-light max-w-xl">
              {t('packages.flexibilityDesc')}
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-[#E8E4D9] dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#D1C9BC] dark:border-[#38382E]">
              {t('packages.portalIncludedBadge')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
