import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Atom, Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenClientPortal: () => void;
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenClientPortal,
  onOpenAdmin,
  onNavigateHome,
}) => {
  const { t } = useLanguage();
  const { businessSettings } = useData();

  const businessName = businessSettings.business_name || 'Shanon Lee Tutoring';
  const businessEmail = businessSettings.business_email || 'shanon.lcm@gmail.com';
  const businessPhone = businessSettings.business_phone;
  const businessAddress = businessSettings.business_address;

  return (
    <footer className="bg-[#2E2E25] dark:bg-[#11110E] text-[#FDFCF8] border-t border-[#434336] dark:border-[#22221B] pt-14 sm:pt-18 pb-12 sm:pb-14 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 sm:pb-14 border-b border-[#434336] dark:border-[#22221B]">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#5A5A40] dark:bg-[#2A2A22] text-[#FDFCF8] flex items-center justify-center">
                <Atom className="w-5 h-5 text-[#E8E4D9] dark:text-[#A3B18A]" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[#FDFCF8]">
                {businessName}
              </span>
            </div>
            <p className="text-sm text-[#D1C9BC] dark:text-[#9E9A8E] leading-relaxed max-w-sm font-light">
              Personalised secondary science mentoring for Year 7–10 foundations and Stage 6 HSC Chemistry & Biology.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-[#D1C9BC] dark:text-[#9E9A8E] pt-2 font-medium">
              <Clock className="w-4 h-4 text-[#A89F8D] shrink-0" />
              <span>{t('footer.hours')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A89F8D]">
              Navigation
            </h4>
            <ul className="space-y-3 text-xs uppercase tracking-wider font-medium text-[#D1C9BC] dark:text-[#A6A295]">
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-white dark:hover:text-[#EDEAE1] transition-colors cursor-pointer py-1 inline-block"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-white dark:hover:text-[#EDEAE1] transition-colors cursor-pointer py-1 inline-block"
                >
                  {t('nav.book')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenClientPortal}
                  className="hover:text-white dark:hover:text-[#EDEAE1] transition-colors cursor-pointer py-1 inline-block"
                >
                  {t('nav.clientPortal')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-white dark:hover:text-[#EDEAE1] transition-colors flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('nav.admin')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-4">
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89F8D] dark:text-[#8C867A]">
          <p>
            © {new Date().getFullYear()} {businessName}. {t('footer.rights')}
          </p>
          <p className="text-[#8C867A] dark:text-[#6E6A60]">
            NSW Curriculum Aligned • English & 简体中文 Available
          </p>
        </div>
      </div>
    </footer>
  );
};
