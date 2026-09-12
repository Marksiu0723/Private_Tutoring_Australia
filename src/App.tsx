import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { PackagesSection } from './components/PackagesSection';
import { Footer } from './components/Footer';
import { BookingFlow } from './components/BookingFlow';
import { AuthModal } from './components/AuthModal';
import { ClientPortal } from './components/ClientPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { TransitionOverlay } from './components/TransitionOverlay';
import { PackageId } from './types';

/*
 * Archived Landing Page Sections:
 * The following feature components are preserved in src/components/ for reference / future reactivation:
 * - Hero (src/components/Hero.tsx)
 * - ServicesSection (src/components/ServicesSection.tsx)
 * - JuniorAndHscSection (src/components/JuniorAndHscSection.tsx)
 * - WhySection (src/components/WhySection.tsx)
 * - HowItWorks (src/components/HowItWorks.tsx)
 * - AboutSection (src/components/AboutSection.tsx)
 */

type CurrentView = 'landing' | 'client-portal' | 'admin-dashboard';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [targetView, setTargetView] = useState<CurrentView>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Trigger transition when auth changes
  const prevUser = useRef(user);
  useEffect(() => {
    // Only trigger if we actually went from logged out to logged in, or vice versa
    if ((prevUser.current && !user) || (!prevUser.current && user)) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
      prevUser.current = user;
      return () => clearTimeout(timer);
    }
    prevUser.current = user;
  }, [user]);

  // Transition helper for view changes
  const switchViewWithTransition = (view: CurrentView) => {
    if (view === currentView) return;
    setIsTransitioning(true);
    setTargetView(view);
    
    // Switch the actual view after the overlay fades in (300ms)
    setTimeout(() => {
      setCurrentView(view);
      
      // Let it stay on screen for a moment, then fade out
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 400);
  };

  // Selected parameters for booking modal
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId | undefined>(undefined);

  // Sync view with URL pathname (/admin, /portal) and URL hash (#admin, #portal) for bookmarking & direct URLs
  useEffect(() => {
    const handleNavigationSync = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      let nextView: CurrentView = 'landing';
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash === '#admin-portal') {
        nextView = 'admin-dashboard';
      } else if (path === '/portal' || path === '/student' || hash === '#portal' || hash === '#client-portal' || hash === '#student') {
        nextView = 'client-portal';
      }
      
      if (nextView !== currentView) {
        switchViewWithTransition(nextView);
      }
    };

    handleNavigationSync();
    window.addEventListener('hashchange', handleNavigationSync);
    window.addEventListener('popstate', handleNavigationSync);
    return () => {
      window.removeEventListener('hashchange', handleNavigationSync);
      window.removeEventListener('popstate', handleNavigationSync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Trigger booking with specific package from Structured Tutoring Plans
  const handleSelectPackage = (pkgId: PackageId) => {
    setSelectedPackageId(pkgId);
    setBookingModalOpen(true);
  };

  // Open generic booking
  const handleOpenBooking = () => {
    setSelectedServiceId(undefined);
    setSelectedPackageId(undefined);
    setBookingModalOpen(true);
  };

  // Open Auth modal
  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Route to Client Portal
  const handleOpenClientPortal = () => {
    switchViewWithTransition('client-portal');
    window.history.pushState(null, '', '#portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route to Admin Dashboard
  const handleOpenAdmin = () => {
    switchViewWithTransition('admin-dashboard');
    window.history.pushState(null, '', '#admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to public website
  const handleNavigateHome = () => {
    switchViewWithTransition('landing');
    // Remove the hash while preserving the base path
    window.history.pushState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#171714] font-sans text-[#4A4A40] dark:text-[#EDEAE1] selection:bg-[#E8E4D9] dark:selection:bg-[#38382E] selection:text-[#5A5A40] dark:selection:text-[#C6D4AB] flex flex-col transition-colors duration-200">
      <TransitionOverlay isTransitioning={isTransitioning} />
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onOpenBooking={handleOpenBooking}
        onOpenClientPortal={handleOpenClientPortal}
        onOpenAdmin={handleOpenAdmin}
        onOpenAuth={handleOpenAuth}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <main>
            {/* Structured Tutoring Plans Section */}
            <PackagesSection onSelectPackage={handleSelectPackage} />
          </main>
        )}

        {currentView === 'client-portal' && (
          <ClientPortal
            onBackToSite={handleNavigateHome}
            onOpenBooking={handleOpenBooking}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard onBackToSite={handleNavigateHome} />
        )}
      </div>

      {/* Footer */}
      {currentView === 'landing' && (
        <Footer
          onOpenBooking={handleOpenBooking}
          onOpenClientPortal={handleOpenClientPortal}
          onOpenAdmin={handleOpenAdmin}
          onNavigateHome={handleNavigateHome}
        />
      )}

      {/* Booking Flow Modal */}
      <BookingFlow
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialServiceId={selectedServiceId}
        initialPackageId={selectedPackageId}
        onOpenClientPortal={handleOpenClientPortal}
      />

      {/* Supabase Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <MainAppContent />
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
