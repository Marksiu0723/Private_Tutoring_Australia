import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Atom, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  onOpenBooking?: () => void;
  onOpenClientPortal?: () => void;
  onOpenAdmin?: () => void;
  onNavigateHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenClientPortal }) => {
  const { t } = useLanguage();
  const { businessSettings } = useData();

  const businessName = businessSettings.business_name || 'Shanon Lee Tutoring';
  const businessEmail = businessSettings.business_email || 'shanon.lcm@gmail.com';
  const businessPhone = businessSettings.business_phone;
  const businessAddress = businessSettings.business_address;

  return (
    <footer className="bg-[#2E2E25] dark:bg-[#11110E] text-[#FDFCF8] border-t border-[#434336] dark:border-[#22221B] pt-12 sm:pt-16 pb-12 sm:pb-14 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 pb-10 sm:pb-12 border-b border-[#434336] dark:border-[#22221B]">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#5A5A40] dark:bg-[#2A2A22] text-[#FDFCF8] flex items-center justify-center shrink-0">
                <Atom className="w-5 h-5 text-[#E8E4D9] dark:text-[#A3B18A]" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[#FDFCF8]">
                {businessName}
              </span>
            </div>
            <p className="text-sm text-[#D1C9BC] dark:text-[#9E9A8E] leading-relaxed max-w-md font-light">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2.5 text-xs text-[#D1C9BC] dark:text-[#9E9A8E] pt-1 font-medium">
              <Clock className="w-4 h-4 text-[#A89F8D] shrink-0" />
              <span>{t('footer.hours')}</span>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4 md:justify-self-end md:max-w-sm w-full">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89F8D]">
              {t('footer.contactUs')}
            </h4>
            <div className="space-y-3 text-sm text-[#D1C9BC] dark:text-[#A6A295] font-light">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A89F8D] shrink-0" />
                <a
                  href={`mailto:${businessEmail}`}
                  className="hover:text-white dark:hover:text-[#EDEAE1] transition-colors break-all"
                >
                  {businessEmail}
                </a>
              </div>

              {/* ONLY render phone if non-null */}
              {businessPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#A89F8D] shrink-0" />
                  <span>{businessPhone}</span>
                </div>
              )}

              {/* ONLY render address if non-null */}
              {businessAddress && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#A89F8D] shrink-0 mt-0.5" />
                  <span>{businessAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89F8D] dark:text-[#8C867A] text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {businessName}. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            {onOpenClientPortal && (
              <button
                onClick={onOpenClientPortal}
                className="hover:text-white dark:hover:text-[#EDEAE1] transition-colors cursor-pointer"
              >
                {t('nav.clientPortal')}
              </button>
            )}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-white dark:hover:text-[#EDEAE1] transition-colors cursor-pointer"
              >
                Admin Portal (/admin)
              </button>
            )}
            <span className="text-[#8C867A] dark:text-[#6E6A60]">
              {t('footer.curriculumAligned')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
