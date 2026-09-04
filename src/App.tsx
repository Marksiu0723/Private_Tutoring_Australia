import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { JuniorAndHscSection } from './components/JuniorAndHscSection';
import { PackagesSection } from './components/PackagesSection';
import { WhySection } from './components/WhySection';
import { HowItWorks } from './components/HowItWorks';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { BookingFlow } from './components/BookingFlow';
import { AuthModal } from './components/AuthModal';
import { ClientPortal } from './components/ClientPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { PackageId } from './types';

type CurrentView = 'landing' | 'client-portal' | 'admin-dashboard';

const MainAppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Selected parameters for booking modal
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId | undefined>(undefined);

  // Sync view with URL hash for quick navigation & bookmarking (#admin, #portal)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#admin-portal') {
        setCurrentView('admin-dashboard');
      } else if (hash === '#portal' || hash === '#client-portal') {
        setCurrentView('client-portal');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Trigger booking with specific service
  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedPackageId(undefined);
    setBookingModalOpen(true);
  };

  // Trigger booking with specific package
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
    setCurrentView('client-portal');
    window.location.hash = '#portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route to Admin Dashboard
  const handleOpenAdmin = () => {
    setCurrentView('admin-dashboard');
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to public website
  const handleNavigateHome = () => {
    setCurrentView('landing');
    if (window.location.hash === '#admin' || window.location.hash === '#portal') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#171714] font-sans text-[#4A4A40] dark:text-[#EDEAE1] selection:bg-[#E8E4D9] dark:selection:bg-[#38382E] selection:text-[#5A5A40] dark:selection:text-[#C6D4AB] flex flex-col transition-colors duration-200">
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
            <Hero
              onOpenBooking={handleOpenBooking}
              onOpenServices={() => {
                const el = document.getElementById('services-curriculum');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ServicesSection onSelectService={handleSelectService} />

            <JuniorAndHscSection onSelectService={handleSelectService} />

            <PackagesSection onSelectPackage={handleSelectPackage} />

            <WhySection />

            <HowItWorks />

            <AboutSection />
          </main>
        )}

        {currentView === 'client-portal' && (
          <ClientPortal
            onBackToSite={handleNavigateHome}
            onOpenBooking={handleOpenBooking}
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
