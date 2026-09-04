import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ThemeToggle } from './ThemeToggle';
import {
  Atom,
  Globe,
  User,
  ShieldCheck,
  Calendar,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenClientPortal: () => void;
  onOpenAdmin: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onOpenAuthModal?: () => void;
  currentView?: string;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenClientPortal,
  onOpenAdmin,
  onOpenAuth,
  onOpenAuthModal,
  currentView = 'home',
  onNavigateHome,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const { businessSettings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const businessName = businessSettings.business_name || 'Shanon Lee Tutoring';

  const handleAuthTrigger = () => {
    if (onOpenAuth) onOpenAuth('signin');
    else if (onOpenAuthModal) onOpenAuthModal();
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home' && currentView !== 'landing') {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCF8]/95 dark:bg-[#171714]/95 backdrop-blur-md border-b border-[#E8E4D9] dark:border-[#2D2D24] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Wordmark */}
          <button
            id="nav-logo-btn"
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#5A5A40] dark:bg-[#A3B18A] flex items-center justify-center text-[#FDFCF8] dark:text-[#171714] shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Atom className="w-5 h-5 text-[#E8E4D9] dark:text-[#171714]" />
            </div>
            <div className="min-w-0">
              <span className="block font-serif font-semibold text-lg sm:text-xl text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight leading-none group-hover:text-[#5A5A40] dark:group-hover:text-[#A3B18A] transition-colors truncate">
                {businessName}
              </span>
              <span className="block text-[10px] sm:text-[11px] font-medium text-[#8C867A] dark:text-[#A6A295] uppercase tracking-[0.18em] sm:tracking-[0.2em] mt-1 truncate">
                Secondary Science & HSC
              </span>
            </div>
          </button>

          {/* Desktop Nav Links - Natural Tones with uppercase tracking */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              id="nav-link-home"
              onClick={onNavigateHome}
              className={`px-3.5 lg:px-4 py-2 text-xs uppercase tracking-[0.2em] font-semibold rounded-full transition-colors cursor-pointer ${
                currentView === 'home' || currentView === 'landing'
                  ? 'text-[#5A5A40] dark:text-[#C6D4AB] bg-[#E8E4D9]/60 dark:bg-[#2A2A22]'
                  : 'text-[#8C867A] dark:text-[#A6A295] hover:text-[#5A5A40] dark:hover:text-[#EDEAE1] hover:bg-[#F5F2ED] dark:hover:bg-[#23231D]'
              }`}
            >
              {t('nav.home')}
            </button>
            <button
              id="nav-link-tutoring"
              onClick={() => scrollToSection('tutoring-services')}
              className="px-3.5 lg:px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium text-[#8C867A] dark:text-[#A6A295] hover:text-[#5A5A40] dark:hover:text-[#EDEAE1] hover:bg-[#F5F2ED] dark:hover:bg-[#23231D] rounded-full transition-colors cursor-pointer"
            >
              {t('nav.tutoring')}
            </button>
            <button
              id="nav-link-packages"
              onClick={() => scrollToSection('tutoring-packages')}
              className="px-3.5 lg:px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium text-[#8C867A] dark:text-[#A6A295] hover:text-[#5A5A40] dark:hover:text-[#EDEAE1] hover:bg-[#F5F2ED] dark:hover:bg-[#23231D] rounded-full transition-colors cursor-pointer"
            >
              {t('nav.packages')}
            </button>
            <button
              id="nav-link-about"
              onClick={() => scrollToSection('about-philosophy')}
              className="px-3.5 lg:px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium text-[#8C867A] dark:text-[#A6A295] hover:text-[#5A5A40] dark:hover:text-[#EDEAE1] hover:bg-[#F5F2ED] dark:hover:bg-[#23231D] rounded-full transition-colors cursor-pointer"
            >
              {t('nav.about')}
            </button>
          </nav>

          {/* Right Actions: Theme, Language, Portal, Admin, CTA */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            {/* Theme Switcher Button */}
            <ThemeToggle variant="compact" />

            {/* Language Switcher */}
            <div className="relative">
              <button
                id="lang-switcher-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#5A5A40] dark:text-[#C6D4AB] bg-[#F5F2ED] dark:bg-[#20201A] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] rounded-full transition-colors border border-[#E8E4D9] dark:border-[#313128] cursor-pointer"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
                <span className="uppercase tracking-wider text-[11px]">
                  {language === 'en' ? 'English' : '简体中文'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8C867A] dark:text-[#A6A295]" />
              </button>

              {langDropdownOpen && (
                <div
                  id="lang-dropdown-menu"
                  className="absolute right-0 mt-1.5 w-36 bg-[#FDFCF8] dark:bg-[#1E1E18] rounded-2xl shadow-lg border border-[#E8E4D9] dark:border-[#38382E] py-1.5 z-50 text-xs"
                >
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-[#F5F2ED] dark:hover:bg-[#282820] transition-colors cursor-pointer ${
                      language === 'en'
                        ? 'font-semibold text-[#5A5A40] dark:text-[#A3B18A] bg-[#E8E4D9]/40 dark:bg-[#282820]'
                        : 'text-[#4A4A40] dark:text-[#EDEAE1]'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] dark:bg-[#A3B18A]"></span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('zh');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-[#F5F2ED] dark:hover:bg-[#282820] transition-colors cursor-pointer ${
                      language === 'zh'
                        ? 'font-semibold text-[#5A5A40] dark:text-[#A3B18A] bg-[#E8E4D9]/40 dark:bg-[#282820]'
                        : 'text-[#4A4A40] dark:text-[#EDEAE1]'
                    }`}
                  >
                    <span>简体中文</span>
                    {language === 'zh' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] dark:bg-[#A3B18A]"></span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Client Portal Button / Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  id="nav-client-portal-btn"
                  onClick={onOpenClientPortal}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                    currentView === 'client-portal' || currentView === 'portal'
                      ? 'bg-[#5A5A40] text-white dark:bg-[#A3B18A] dark:text-[#171714]'
                      : 'text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] hover:bg-[#F5F2ED] dark:hover:bg-[#24241E] border border-[#E8E4D9] dark:border-[#313128]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[110px] truncate">
                    {user.email?.split('@')[0] || t('nav.clientPortal')}
                  </span>
                </button>
                <button
                  id="nav-sign-out-btn"
                  onClick={() => signOut()}
                  title={t('nav.signOut')}
                  className="p-2 text-[#8C867A] dark:text-[#A6A295] hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={handleAuthTrigger}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] hover:bg-[#F5F2ED] dark:hover:bg-[#24241E] rounded-full border border-[#E8E4D9] dark:border-[#313128] transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
                <span>{t('nav.clientPortal')}</span>
              </button>
            )}

            {/* Admin Portal Button */}
            <button
              id="nav-admin-portal-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-full border transition-colors cursor-pointer ${
                currentView === 'admin' || currentView === 'admin-dashboard'
                  ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] border-[#5A5A40] dark:border-[#A3B18A] shadow-xs'
                  : 'text-[#5A5A40] dark:text-[#C6D4AB] bg-[#F5F2ED] dark:bg-[#20201A] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] border-[#E8E4D9] dark:border-[#313128]'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${
                currentView === 'admin' || currentView === 'admin-dashboard' 
                  ? 'text-white dark:text-[#171714]' 
                  : 'text-[#5A5A40] dark:text-[#A3B18A]'
              }`} />
              <span>{t('nav.admin')}</span>
            </button>

            {/* Primary Book CTA */}
            <button
              id="nav-book-cta-btn"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#5A5A40] hover:bg-[#484833] dark:bg-[#A3B18A] dark:hover:bg-[#8F9E72] dark:text-[#171714] active:scale-[0.98] rounded-full shadow-sm transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E8E4D9] dark:text-[#171714]" />
              <span>{t('nav.book')}</span>
            </button>
          </div>

          {/* Mobile Actions: Theme, Lang, Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Theme Toggle */}
            <ThemeToggle variant="compact" />

            <button
              id="mobile-lang-btn"
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="px-3 py-1.5 text-xs font-semibold text-[#5A5A40] dark:text-[#C6D4AB] bg-[#F5F2ED] dark:bg-[#20201A] rounded-full border border-[#E8E4D9] dark:border-[#313128] cursor-pointer"
            >
              {language === 'en' ? 'ZH' : 'EN'}
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] rounded-full hover:bg-[#F5F2ED] dark:hover:bg-[#20201A] focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-b border-[#E8E4D9] dark:border-[#2D2D24] bg-[#FDFCF8] dark:bg-[#171714] px-4 pt-3 pb-6 space-y-2 animate-in fade-in-50"
        >
          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-[#2D2C27] dark:text-[#EDEAE1] hover:bg-[#F5F2ED] dark:hover:bg-[#20201A] rounded-xl cursor-pointer"
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => scrollToSection('tutoring-services')}
            className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-medium text-[#8C867A] dark:text-[#A6A295] hover:text-[#5A5A40] dark:hover:text-[#EDEAE1] hover:bg-[#F5F2ED] dark:hover:bg-[#20201A] rounded-xl cursor-pointer"
          >
            {t('nav.tutoring')}
          </button>
          <button
            onClick={() => scrollToSection('tutoring-packages')}
            className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-medium text-[#8C867A] dark:text-[#A6A295] hover:text-[#5A5A40] dark:hover:text-[#EDEAE1] hover:bg-[#F5F2ED] dark:hover:bg-[#20201A] rounded-xl cursor-pointer"
          >
            {t('nav.packages')}
          </button>
          <button
            onClick={() => scrollToSection('about-philosophy')}
            className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-medium text-[#8C867A] dark:text-[#A6A295] hover:text-[#5A5A40] dark:hover:text-[#EDEAE1] hover:bg-[#F5F2ED] dark:hover:bg-[#20201A] rounded-xl cursor-pointer"
          >
            {t('nav.about')}
          </button>

          {/* Theme Selector Segmented in Mobile Drawer */}
          <div className="pt-3 pb-1 border-t border-[#E8E4D9] dark:border-[#2D2D24]">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8C867A] dark:text-[#A6A295] mb-2 px-1">
              Theme / 浅深色模式
            </div>
            <ThemeToggle variant="segmented" className="w-full justify-center" />
          </div>

          <div className="pt-3 border-t border-[#E8E4D9] dark:border-[#2D2D24] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (user) onOpenClientPortal();
                else handleAuthTrigger();
              }}
              className="w-full py-3.5 px-4 text-center text-xs uppercase tracking-wider font-semibold text-[#4A4A40] dark:text-[#EDEAE1] bg-[#F5F2ED] dark:bg-[#20201A] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] rounded-full border border-[#E8E4D9] dark:border-[#313128] cursor-pointer"
            >
              {user ? t('nav.clientPortal') : t('auth.signIn')}
            </button>

            <button
              id="mobile-nav-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-3.5 px-4 text-center text-xs uppercase tracking-wider font-semibold text-[#5A5A40] dark:text-[#C6D4AB] bg-[#F5F2ED] dark:bg-[#20201A] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] rounded-full border border-[#E8E4D9] dark:border-[#313128] flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>{t('nav.admin')}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-4 px-4 text-center text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full shadow-sm cursor-pointer"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
