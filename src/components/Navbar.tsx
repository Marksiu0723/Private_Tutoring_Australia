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
  MapPin,
  Search,
  ArrowRight,
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    
    if (q.includes('hsc') || q.includes('chem') || q.includes('bio') || q.includes('junior') || q.includes('year') || q.includes('science')) {
      scrollToSection('tutoring-services');
    } else if (q.includes('pack') || q.includes('term') || q.includes('price') || q.includes('cost')) {
      scrollToSection('tutoring-packages');
    } else if (q.includes('about') || q.includes('shanon') || q.includes('why') || q.includes('philosophy')) {
      scrollToSection('about-philosophy');
    } else {
      scrollToSection('tutoring-services');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* 1. TOP UTILITY BAR (First-tier header: Location, Discreet Admin, Language & Theme) */}
      <div className="bg-[#2D2C27] text-[#EDEAE1] text-xs border-b border-[#3D3C33] dark:bg-[#121210] dark:border-[#282820] py-1.5 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Location indicator (Phone, email, hours removed) */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#D1C9BC] tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-[#A3B18A] shrink-0" />
            <span>{t('nav.location')}</span>
          </div>

          {/* Right Utilities: Smaller Admin Button, Language, Theme */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* ADMIN BUTTON (FIRST TIER ONLY) */}
            <button
              id="nav-admin-top-btn"
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                currentView === 'admin' || currentView === 'admin-dashboard'
                  ? 'bg-[#A3B18A] text-[#171714] border-[#A3B18A]'
                  : 'bg-white/10 hover:bg-white/20 text-[#EDEAE1] border-white/15'
              }`}
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{t('nav.admin')}</span>
            </button>

            <span className="text-[#5A5A40]">|</span>

            {/* Language Switcher in Top Bar */}
            <div className="relative">
              <button
                id="lang-switcher-top-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-1 px-2 h-6 rounded-full text-[10px] uppercase font-semibold text-[#EDEAE1] hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
                aria-label="Change language"
              >
                <Globe className="w-3 h-3 text-[#A3B18A]" />
                <span>{language === 'en' ? 'EN' : '中文'}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {langDropdownOpen && (
                <div
                  id="lang-dropdown-menu"
                  className="absolute right-0 mt-1 w-32 bg-[#FDFCF8] dark:bg-[#1E1E18] rounded-xl shadow-lg border border-[#E8E4D9] dark:border-[#38382E] py-1 z-50 text-xs animate-in fade-in-50"
                >
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#F5F2ED] dark:hover:bg-[#282820] text-xs cursor-pointer ${
                      language === 'en'
                        ? 'font-semibold text-[#5A5A40] dark:text-[#A3B18A]'
                        : 'text-[#4A4A40] dark:text-[#EDEAE1]'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] dark:bg-[#A3B18A]" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('zh');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#F5F2ED] dark:hover:bg-[#282820] text-xs cursor-pointer ${
                      language === 'zh'
                        ? 'font-semibold text-[#5A5A40] dark:text-[#A3B18A]'
                        : 'text-[#4A4A40] dark:text-[#EDEAE1]'
                    }`}
                  >
                    <span>简体中文</span>
                    {language === 'zh' && <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] dark:bg-[#A3B18A]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle (Topbar Variant) */}
            <div className="flex items-center">
              <ThemeToggle variant="topbar" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR (Second-tier header) */}
      <div className="bg-[#FDFCF8]/95 dark:bg-[#171714]/95 backdrop-blur-md border-b border-[#E8E4D9] dark:border-[#2D2D24] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Wordmark */}
            <button
              id="nav-logo-btn"
              onClick={onNavigateHome}
              className="flex items-center gap-3.5 text-left group focus:outline-none cursor-pointer shrink-0"
            >
              <div className="w-11 h-11 rounded-xl bg-[#5A5A40] dark:bg-[#A3B18A] flex items-center justify-center text-[#FDFCF8] dark:text-[#171714] group-hover:scale-105 transition-transform shrink-0">
                <Atom className="w-6 h-6 text-[#E8E4D9] dark:text-[#171714]" />
              </div>
              <div className="min-w-0">
                <span className="block font-serif font-bold text-lg sm:text-xl text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight leading-none group-hover:text-[#5A5A40] dark:group-hover:text-[#A3B18A] transition-colors truncate">
                  {businessName}
                </span>
                <span className="block text-[10px] sm:text-[11px] font-medium text-[#8C867A] dark:text-[#A6A295] uppercase tracking-[0.2em] mt-1 truncate">
                  Science & HSC
                </span>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                id="nav-link-home"
                onClick={onNavigateHome}
                className={`px-3.5 py-2 text-xs uppercase tracking-[0.18em] font-semibold rounded-full transition-colors cursor-pointer ${
                  currentView === 'home' || currentView === 'landing'
                    ? 'text-[#5A5A40] dark:text-[#C6D4AB]'
                    : 'text-[#6B6658] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1]'
                }`}
              >
                {t('nav.home')}
              </button>

              <button
                id="nav-link-tutoring"
                onClick={() => scrollToSection('tutoring-services')}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs uppercase tracking-[0.18em] font-medium text-[#6B6658] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] rounded-full transition-colors cursor-pointer"
              >
                <span>{t('nav.tutoring')}</span>
                <ChevronDown className="w-3 h-3 text-[#8C867A] dark:text-[#7A7568]" />
              </button>

              <button
                id="nav-link-packages"
                onClick={() => scrollToSection('tutoring-packages')}
                className="px-3.5 py-2 text-xs uppercase tracking-[0.18em] font-medium text-[#6B6658] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] rounded-full transition-colors cursor-pointer"
              >
                {t('nav.packages')}
              </button>

              <button
                id="nav-link-about"
                onClick={() => scrollToSection('about-philosophy')}
                className="px-3.5 py-2 text-xs uppercase tracking-[0.18em] font-medium text-[#6B6658] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] rounded-full transition-colors cursor-pointer"
              >
                {t('nav.about')}
              </button>
            </nav>

            {/* Right: Dedicated Search Bar (Admin removed) + Aligned Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Expanded Search Bar - taking the space previously occupied by duplicate admin button */}
              <form onSubmit={handleSearchSubmit} className="relative w-44 md:w-48 lg:w-60 xl:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full h-10 pl-9 pr-9 text-xs bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] rounded-full text-[#2D2C27] dark:text-[#EDEAE1] placeholder-[#8C867A] dark:placeholder-[#7A7568] focus:outline-none focus:ring-1.5 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] transition-all"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C867A] dark:text-[#7A7568] pointer-events-none" />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C867A] hover:text-[#2D2C27] dark:hover:text-white p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8C867A] hover:text-[#5A5A40] dark:hover:text-[#A3B18A] transition-colors"
                    title="Search"
                    aria-label="Submit search"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* CLIENT PORTAL BUTTON - FIXED TO EXACT SAME SIZE (h-10) AS BOOK CTA */}
              {user ? (
                <div className="flex items-center gap-1.5">
                  <button
                    id="nav-client-portal-btn"
                    onClick={onOpenClientPortal}
                    className={`h-10 min-h-[40px] max-h-[40px] px-4 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold rounded-full border transition-all cursor-pointer box-border shrink-0 ${
                      currentView === 'client-portal' || currentView === 'portal'
                        ? 'bg-[#5A5A40] text-white dark:bg-[#A3B18A] dark:text-[#171714] border-[#5A5A40]'
                        : 'text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] hover:bg-[#F5F2ED] dark:hover:bg-[#24241E] border-[#E8E4D9] dark:border-[#313128]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
                    <span className="max-w-[100px] truncate">
                      {user.email?.split('@')[0] || t('nav.clientPortal')}
                    </span>
                  </button>
                  <button
                    id="nav-sign-out-btn"
                    onClick={() => signOut()}
                    title={t('nav.signOut')}
                    className="h-10 w-10 min-h-[40px] max-h-[40px] inline-flex items-center justify-center text-[#8C867A] dark:text-[#A6A295] hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full border border-[#E8E4D9] dark:border-[#313128] transition-colors cursor-pointer shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  id="nav-login-btn"
                  onClick={handleAuthTrigger}
                  className="h-10 min-h-[40px] max-h-[40px] px-4.5 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] hover:bg-[#F5F2ED] dark:hover:bg-[#24241E] rounded-full border border-[#E8E4D9] dark:border-[#313128] transition-all cursor-pointer box-border shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
                  <span>{t('nav.clientPortal')}</span>
                </button>
              )}

              {/* PRIMARY BOOK CTA BUTTON - FIXED TO EXACT SAME SIZE (h-10) AS CLIENT PORTAL */}
              <button
                id="nav-book-cta-btn"
                onClick={onOpenBooking}
                className="h-10 min-h-[40px] max-h-[40px] px-5.5 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold text-white bg-[#5A5A40] hover:bg-[#484833] dark:bg-[#A3B18A] dark:hover:bg-[#8F9E72] dark:text-[#171714] active:scale-[0.98] rounded-full shadow-xs transition-all cursor-pointer box-border shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E8E4D9] dark:text-[#171714]" />
                <span>{t('nav.book')}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </button>
            </div>

            {/* Mobile Actions: Lang Button, Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="mobile-lang-btn"
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className="px-2.5 py-1.5 text-xs font-semibold text-[#5A5A40] dark:text-[#C6D4AB] bg-[#F5F2ED] dark:bg-[#20201A] rounded-full border border-[#E8E4D9] dark:border-[#313128] cursor-pointer"
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
      </div>

      {/* 3. MOBILE DRAWER */}
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
            {/* Client Portal Button in Mobile Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (user) onOpenClientPortal();
                else handleAuthTrigger();
              }}
              className="w-full h-11 px-4 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#4A4A40] dark:text-[#EDEAE1] bg-[#F5F2ED] dark:bg-[#20201A] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] rounded-full border border-[#E8E4D9] dark:border-[#313128] cursor-pointer"
            >
              <User className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>{user ? t('nav.clientPortal') : t('auth.signIn')}</span>
            </button>

            {/* Admin Button in Mobile Drawer - Smaller size */}
            <button
              id="mobile-nav-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full h-9 px-4 inline-flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#5A5A40] dark:text-[#C6D4AB] bg-[#F5F2ED] dark:bg-[#20201A] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] rounded-full border border-[#E8E4D9] dark:border-[#313128] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>{t('nav.admin')}</span>
            </button>

            {/* Book Button in Mobile Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full h-11 px-4 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#E8E4D9] dark:text-[#171714]" />
              <span>{t('nav.book')}</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
