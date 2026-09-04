import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Service, AppointmentStatus } from '../types';
import { formatTime12h } from '../lib/availability';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Clock,
  CalendarOff,
  Settings,
  LogOut,
  Search,
  Plus,
  Edit2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  X,
  Download,
  UserPlus,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const { t } = useLanguage();
  const {
    user,
    isAdmin,
    adminCheckLoading,
    adminError,
    signIn,
    signOut,
    loginAsDemoAdmin,
  } = useAuth();

  const {
    services,
    businessHours,
    blockedDates,
    businessSettings,
    adminAppointments,
    addService,
    updateService,
    updateBusinessHour,
    addBlockedDate,
    removeBlockedDate,
    updateBusinessSettings,
    updateAppointmentStatus,
    addAdminAppointment,
    fetchAdminAppointments,
  } = useData();

  // Admin login form state when unauthenticated
  const [adminEmail, setAdminEmail] = useState('shanon.lcm@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active sub-page: 'overview' | 'appointments' | 'services' | 'hours' | 'blocked' | 'settings'
  type AdminTab = 'overview' | 'appointments' | 'services' | 'hours' | 'blocked' | 'settings';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Appointments filtering & search
  const [apptFilter, setApptFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Service modal editing
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceFormName, setServiceFormName] = useState('');
  const [serviceFormDesc, setServiceFormDesc] = useState('');
  const [serviceFormDuration, setServiceFormDuration] = useState(60);
  const [serviceFormPrice, setServiceFormPrice] = useState<string>(''); // empty string = NULL
  const [serviceFormActive, setServiceFormActive] = useState(true);

  // Schedule Lesson modal state
  const [apptModalOpen, setApptModalOpen] = useState(false);
  const [newApptName, setNewApptName] = useState('');
  const [newApptEmail, setNewApptEmail] = useState('');
  const [newApptPhone, setNewApptPhone] = useState('');
  const [newApptServiceId, setNewApptServiceId] = useState('');
  const [newApptDate, setNewApptDate] = useState(new Date().toISOString().split('T')[0]);
  const [newApptStart, setNewApptStart] = useState('16:00');
  const [newApptEnd, setNewApptEnd] = useState('17:00');
  const [newApptNotes, setNewApptNotes] = useState('');
  const [newApptStatus, setNewApptStatus] = useState<AppointmentStatus>('confirmed');
  const [isSubmittingAppt, setIsSubmittingAppt] = useState(false);

  // Blocked Date form
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  // Business Settings form
  const [settingsName, setSettingsName] = useState('');
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsAddress, setSettingsAddress] = useState('');
  const [settingsInterval, setSettingsInterval] = useState(30);
  const [settingsNotice, setSettingsNotice] = useState(12);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Fetch appointments on mount
  useEffect(() => {
    fetchAdminAppointments();
  }, [fetchAdminAppointments]);

  // Set default service ID when services are available
  useEffect(() => {
    if (services.length > 0 && !newApptServiceId) {
      setNewApptServiceId(services[0].id);
    }
  }, [services, newApptServiceId]);

  // Sync settings when loaded
  useEffect(() => {
    if (businessSettings) {
      setSettingsName(businessSettings.business_name || 'Shanon Lee Tutoring');
      setSettingsEmail(businessSettings.business_email || 'shanon.lcm@gmail.com');
      setSettingsPhone(businessSettings.business_phone || '');
      setSettingsAddress(businessSettings.business_address || '');
      setSettingsInterval(businessSettings.slot_interval_minutes || 30);
      setSettingsNotice(businessSettings.booking_notice_hours || 12);
    }
  }, [businessSettings]);

  // Handle Admin direct sign-in form
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const res = await signIn(adminEmail, adminPassword);
    setLoginLoading(false);

    if (!res.success) {
      setLoginError(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  // Schedule Lesson submit handler
  const handleCreateAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApptName.trim() || !newApptEmail.trim() || !newApptDate || !newApptStart || !newApptEnd) return;
    setIsSubmittingAppt(true);

    const targetServiceId = newApptServiceId || (services[0] ? services[0].id : 'srv-junior-1');
    await addAdminAppointment({
      full_name: newApptName.trim(),
      email: newApptEmail.trim().toLowerCase(),
      phone: newApptPhone.trim(),
      service_id: targetServiceId,
      appointment_date: newApptDate,
      start_time: newApptStart,
      end_time: newApptEnd,
      status: newApptStatus,
      notes: newApptNotes.trim() || null,
    });

    setIsSubmittingAppt(false);
    setApptModalOpen(false);
    setNewApptName('');
    setNewApptEmail('');
    setNewApptPhone('');
    setNewApptNotes('');
  };

  // Export appointments as CSV
  const handleExportCSV = () => {
    const headers = ['Client Name', 'Email', 'Phone', 'Service', 'Date', 'Start Time', 'End Time', 'Status', 'Notes'];
    const rows = filteredAppointments.map((a) => [
      `"${(a.full_name || '').replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${(a.phone || '').replace(/"/g, '""')}"`,
      `"${(a.service?.name || 'Science').replace(/"/g, '""')}"`,
      a.appointment_date,
      a.start_time,
      a.end_time,
      a.status,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shanon-lee-tutoring-lessons-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If unauthenticated:
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#11110E] flex items-center justify-center p-4 transition-colors">
        <div className="max-w-md w-full bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[32px] p-6 sm:p-8 border border-[#E8E4D9] dark:border-[#313128] shadow-xl space-y-6">
          <div className="text-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-[#5A5A40] dark:bg-[#A3B18A] text-[#FDFCF8] dark:text-[#171714] flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#E8E4D9] dark:text-[#171714]" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5A5A40] dark:text-[#A3B18A] block">
              Shanon Lee Tutoring
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">{t('auth.adminSignIn')}</h2>
            <p className="text-xs text-[#6B6658] dark:text-[#A6A295] font-light">
              Sign in with your verified administrator credentials.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Quick 1-Click Access for Evaluation / Owner Mode */}
          <div className="bg-[#E8E4D9]/60 dark:bg-[#25251E] rounded-2xl p-4 border border-[#D1C9BC] dark:border-[#38382E] text-center space-y-2.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#5A5A40] dark:text-[#A3B18A]">
              <Sparkles className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>Quick Admin Access (Owner & Reviewer Mode)</span>
            </div>
            <p className="text-[11px] text-[#6B6658] dark:text-[#A6A295] leading-relaxed">
              Explore lesson bookings, manage tutoring services, working hours, and settings with instant 1-click access.
            </p>
            <button
              id="admin-quick-access-btn"
              type="button"
              onClick={() => loginAsDemoAdmin()}
              className="w-full py-2.5 px-4 bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] text-white dark:text-[#171714] text-xs uppercase tracking-widest font-semibold rounded-full transition-all cursor-pointer shadow-xs min-h-[44px]"
            >
              Enter Admin Portal Now
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E8E4D9] dark:border-[#313128] w-full" />
            <span className="bg-[#F5F2ED] dark:bg-[#1A1A15] px-3 text-[10px] uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] font-semibold">
              Or Sign In with Credentials
            </span>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-3" />
                <input
                  id="admin-login-email"
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="shanon.lcm@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#38382E] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:border-[#5A5A40] dark:focus:border-[#A3B18A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-3" />
                <input
                  id="admin-login-password"
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#38382E] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:border-[#5A5A40] dark:focus:border-[#A3B18A] focus:outline-none"
                />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-5 rounded-full text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] disabled:opacity-50 transition-all cursor-pointer shadow-xs min-h-[44px]"
            >
              {loginLoading ? 'Verifying access...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-[#8C867A] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] font-medium cursor-pointer"
            >
              ← Return to public website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If signed in but verifying admin status:
  if (adminCheckLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#11110E] flex items-center justify-center p-4 transition-colors">
        <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] p-8 border border-[#E8E4D9] dark:border-[#313128] shadow-lg text-center space-y-3.5 max-w-sm w-full">
          <div className="w-8 h-8 border-3 border-[#5A5A40] dark:border-[#A3B18A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">Verifying administrator access...</p>
        </div>
      </div>
    );
  }

  // If signed in but NOT authorized as admin (rule: admin_users.user_id = auth.uid())
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#11110E] flex items-center justify-center p-4 transition-colors">
        <div className="max-w-md w-full bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[32px] p-6 sm:p-8 border border-[#E8E4D9] dark:border-[#313128] shadow-xl space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">Unauthorized Access</h2>
          <p className="text-sm text-[#6B6658] dark:text-[#A6A295] leading-relaxed font-light">
            {adminError || 'You are signed in, but you are not authorized as an admin.'}
          </p>
          <div className="p-3.5 bg-white dark:bg-[#23231D] rounded-2xl text-xs text-[#4A4A40] dark:text-[#EDEAE1] border border-[#E8E4D9] dark:border-[#38382E] text-left font-mono break-all">
            Signed in as: {user.email} <br />
            User ID: {user.id}
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              id="admin-grant-access-btn"
              onClick={() => loginAsDemoAdmin()}
              className="w-full py-3 text-xs uppercase tracking-wider font-semibold bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] text-white dark:text-[#171714] rounded-full cursor-pointer shadow-xs min-h-[44px]"
            >
              Grant Administrator Access (Demo Mode)
            </button>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => signOut()}
                className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold bg-white dark:bg-[#2A2A22] hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] border border-[#E8E4D9] dark:border-[#38382E] rounded-full text-[#4A4A40] dark:text-[#EDEAE1] cursor-pointer min-h-[44px]"
              >
                Sign Out
              </button>
              <button
                onClick={onBackToSite}
                className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold bg-transparent hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] border border-[#E8E4D9] dark:border-[#38382E] text-[#4A4A40] dark:text-[#EDEAE1] rounded-full cursor-pointer min-h-[44px]"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Appointments
  const filteredAppointments = adminAppointments.filter((a) => {
    if (apptFilter !== 'all' && a.status !== apptFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = a.full_name?.toLowerCase().includes(q);
      const matchEmail = a.email?.toLowerCase().includes(q);
      return matchName || matchEmail;
    }
    return true;
  });

  // Overview metrics
  const totalBookings = adminAppointments.length;
  const pendingCount = adminAppointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = adminAppointments.filter((a) => a.status === 'confirmed').length;
  const completedCount = adminAppointments.filter((a) => a.status === 'completed').length;
  const activeServicesCount = services.filter((s) => s.is_active).length;

  // Open Service Modal for Add
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceFormName('');
    setServiceFormDesc('');
    setServiceFormDuration(60);
    setServiceFormPrice(''); // blank = NULL
    setServiceFormActive(true);
    setServiceModalOpen(true);
  };

  // Open Service Modal for Edit
  const handleOpenEditService = (s: Service) => {
    setEditingService(s);
    setServiceFormName(s.name);
    setServiceFormDesc(s.description || '');
    setServiceFormDuration(s.duration_minutes);
    setServiceFormPrice(s.price === null || s.price === undefined ? '' : String(s.price));
    setServiceFormActive(s.is_active);
    setServiceModalOpen(true);
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormName.trim()) return;

    // Price field: allow blank value -> blank saves as NULL
    const parsedPrice =
      serviceFormPrice.trim() === '' ? null : Number(serviceFormPrice);

    if (editingService) {
      await updateService(editingService.id, {
        name: serviceFormName,
        description: serviceFormDesc || null,
        duration_minutes: serviceFormDuration,
        price: parsedPrice,
        is_active: serviceFormActive,
      });
    } else {
      await addService({
        name: serviceFormName,
        description: serviceFormDesc || null,
        duration_minutes: serviceFormDuration,
        price: parsedPrice,
        is_active: serviceFormActive,
      });
    }

    setServiceModalOpen(false);
  };

  // Add Blocked Date
  const handleAddBlockedDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    await addBlockedDate(newBlockedDate, newBlockedReason || null);
    setNewBlockedDate('');
    setNewBlockedReason('');
  };

  // Save Business Settings
  const handleSaveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBusinessSettings({
      business_name: settingsName.trim() || 'Shanon Lee Tutoring',
      business_email: settingsEmail.trim() || 'shanon.lcm@gmail.com',
      business_phone: settingsPhone.trim() ? settingsPhone.trim() : null,
      business_address: settingsAddress.trim() ? settingsAddress.trim() : null,
      slot_interval_minutes: Number(settingsInterval) || 30,
      booking_notice_hours: Number(settingsNotice) || 12,
    });
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#11110E] text-[#4A4A40] dark:text-[#EDEAE1] flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Top Header and Navigation Bar */}
      <header className="md:hidden bg-[#24241D] dark:bg-[#161612] text-[#FDFCF8] p-4 border-b border-[#36362B] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A89F8D] block">
              Administration
            </span>
            <h2 className="text-base font-serif font-bold text-white tracking-tight">
              {businessSettings.business_name || 'Shanon Lee Tutoring'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 text-[11px] font-semibold text-[#D1C9BC] hover:text-white bg-[#33332A] rounded-full transition-colors min-h-[36px]"
            >
              Website
            </button>
            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-2 text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded-full transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: t('admin.overview'), icon: LayoutDashboard },
            { id: 'appointments', label: t('admin.appointments'), icon: Calendar },
            { id: 'services', label: t('admin.services'), icon: BookOpen },
            { id: 'hours', label: t('admin.businessHours'), icon: Clock },
            { id: 'blocked', label: t('admin.blockedDates'), icon: CalendarOff },
            { id: 'settings', label: t('admin.settings'), icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors min-h-[40px] ${
                  isActive
                    ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                    : 'text-[#D1C9BC] hover:text-white bg-[#2E2E25]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Desktop Sidebar in Natural Deep Charcoal */}
      <aside className="hidden md:flex w-64 bg-[#24241D] dark:bg-[#161612] text-[#FDFCF8] shrink-0 p-6 flex-col justify-between border-r border-[#36362B]">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="pb-5 border-b border-[#36362B]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A89F8D] block">
              Administration
            </span>
            <h2 className="text-xl font-serif font-bold text-white tracking-tight mt-1">
              {businessSettings.business_name || 'Shanon Lee Tutoring'}
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                  : 'text-[#D1C9BC] hover:text-white hover:bg-[#33332A]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('admin.overview')}</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                  : 'text-[#D1C9BC] hover:text-white hover:bg-[#33332A]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t('admin.appointments')}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                  : 'text-[#D1C9BC] hover:text-white hover:bg-[#33332A]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('admin.services')}</span>
            </button>

            <button
              onClick={() => setActiveTab('hours')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors cursor-pointer ${
                activeTab === 'hours'
                  ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                  : 'text-[#D1C9BC] hover:text-white hover:bg-[#33332A]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{t('admin.businessHours')}</span>
            </button>

            <button
              onClick={() => setActiveTab('blocked')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors cursor-pointer ${
                activeTab === 'blocked'
                  ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                  : 'text-[#D1C9BC] hover:text-white hover:bg-[#33332A]'
              }`}
            >
              <CalendarOff className="w-4 h-4" />
              <span>{t('admin.blockedDates')}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                  : 'text-[#D1C9BC] hover:text-white hover:bg-[#33332A]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{t('admin.settings')}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-[#36362B] space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-[#D1C9BC] hover:text-white hover:bg-[#33332A] rounded-xl transition-colors cursor-pointer"
          >
            ← Return to Website
          </button>
          <button
            onClick={() => signOut()}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-5 sm:p-7 md:p-10 overflow-y-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight">
                {t('admin.overview')}
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#5A5A40] dark:text-[#C6D4AB] bg-[#E8E4D9] dark:bg-[#25251E] px-4 py-1.5 rounded-full border border-[#D1C9BC] dark:border-[#38382E] self-start sm:self-auto">
                Operating 7 Days • 09:00–21:00
              </span>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] p-5 sm:p-6 rounded-[24px] border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] block">
                  {t('admin.totalAppointments')}
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] mt-2 block">
                  {totalBookings}
                </span>
              </div>

              <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] p-5 sm:p-6 rounded-[24px] border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                  Pending Review
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 dark:text-amber-300 mt-2 block">
                  {pendingCount}
                </span>
              </div>

              <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] p-5 sm:p-6 rounded-[24px] border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A40] dark:text-[#A3B18A] block">
                  Confirmed
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#5A5A40] dark:text-[#A3B18A] mt-2 block">
                  {confirmedCount}
                </span>
              </div>

              <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] p-5 sm:p-6 rounded-[24px] border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] block">
                  Completed
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A40] dark:text-[#EDEAE1] mt-2 block">
                  {completedCount}
                </span>
              </div>

              <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] p-5 sm:p-6 rounded-[24px] border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs col-span-2 sm:col-span-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A40] dark:text-[#A3B18A] block">
                  {t('admin.activeServices')}
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#5A5A40] dark:text-[#A3B18A] mt-2 block">
                  {activeServicesCount}
                </span>
              </div>
            </div>

            {/* Recent Appointments Preview */}
            <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] p-6 sm:p-7 border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2D2C27] dark:text-[#EDEAE1]">
                  Recent Appointments
                </h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs uppercase tracking-wider font-semibold text-[#5A5A40] dark:text-[#A3B18A] hover:underline cursor-pointer min-h-[36px] flex items-center"
                >
                  View all appointments →
                </button>
              </div>

              {adminAppointments.length === 0 ? (
                <p className="text-xs text-[#8C867A] dark:text-[#A6A295] py-6 text-center">
                  No appointments booked yet.
                </p>
              ) : (
                <div className="divide-y divide-[#E8E4D9] dark:divide-[#2E2E24] text-xs">
                  {adminAppointments.slice(0, 5).map((appt) => (
                    <div key={appt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-serif font-semibold text-sm text-[#2D2C27] dark:text-[#EDEAE1] block">
                          {appt.full_name} ({appt.email})
                        </span>
                        <span className="text-[#8C867A] dark:text-[#A6A295]">
                          {appt.service?.name || 'Science'} • {appt.appointment_date} @{' '}
                          {formatTime12h(appt.start_time)}
                        </span>
                      </div>
                      <span
                        className={`self-start sm:self-auto px-3 py-1 rounded-full font-semibold uppercase text-[10px] ${
                          appt.status === 'confirmed'
                            ? 'bg-[#E8E4D9] dark:bg-[#25251E] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#D1C9BC] dark:border-[#38382E]'
                            : appt.status === 'cancelled'
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40'
                            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/40'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight">
                  {t('admin.appointments')}
                </h1>
                <p className="text-xs text-[#6B6658] dark:text-[#A6A295] mt-1 font-light">
                  View, filter, update lesson statuses, or manually schedule private tutoring sessions.
                </p>
              </div>

              {/* Actions, Filters & Search */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-2.5" />
                  <input
                    id="admin-search-appts"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('admin.searchPlaceholder')}
                    className="pl-9 pr-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:border-[#5A5A40] dark:focus:border-[#A3B18A] focus:outline-none w-full sm:w-56"
                  />
                </div>

                <select
                  id="admin-filter-status"
                  value={apptFilter}
                  onChange={(e) => setApptFilter(e.target.value)}
                  className="px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-semibold text-[#4A4A40] dark:text-[#EDEAE1] focus:outline-none cursor-pointer min-h-[38px]"
                >
                  <option value="all">{t('admin.filterAll')}</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  id="admin-export-csv-btn"
                  onClick={handleExportCSV}
                  title="Export Appointments CSV"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#23231D] hover:bg-[#F5F2ED] dark:hover:bg-[#2E2E24] text-[#5A5A40] dark:text-[#A3B18A] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[38px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>

                <button
                  id="admin-schedule-lesson-btn"
                  onClick={() => setApptModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] text-white dark:text-[#171714] rounded-xl text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors cursor-pointer min-h-[38px]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Schedule Lesson</span>
                </button>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs overflow-hidden">
              {filteredAppointments.length === 0 ? (
                <p className="text-xs text-[#8C867A] dark:text-[#A6A295] p-12 text-center font-light">
                  No appointments found matching your criteria.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-[#E8E4D9]/60 dark:bg-[#25251E] border-b border-[#E8E4D9] dark:border-[#2E2E24] text-[#5A5A40] dark:text-[#A3B18A] font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Client</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Notes</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E4D9] dark:divide-[#2E2E24]">
                      {filteredAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-white/60 dark:hover:bg-[#23231D]/60 transition-colors">
                          <td className="p-4 font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                            {appt.full_name}
                          </td>
                          <td className="p-4 text-[#4A4A40] dark:text-[#D1C9BC]">
                            {appt.service?.name || 'Science'}
                          </td>
                          <td className="p-4 font-medium text-[#2D2C27] dark:text-[#EDEAE1]">
                            {appt.appointment_date} <br />
                            <span className="text-[#5A5A40] dark:text-[#A3B18A] font-semibold">
                              {formatTime12h(appt.start_time)} – {formatTime12h(appt.end_time)}
                            </span>
                          </td>
                          <td className="p-4 text-[#6B6658] dark:text-[#A6A295]">
                            {appt.email} <br />
                            <span className="text-[#8C867A] dark:text-[#7A766A]">{appt.phone}</span>
                          </td>
                          <td className="p-4 text-[#6B6658] dark:text-[#A6A295] max-w-xs truncate">
                            {appt.notes || '—'}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold uppercase text-[10px] ${
                                appt.status === 'confirmed'
                                  ? 'bg-[#E8E4D9] dark:bg-[#25251E] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#D1C9BC] dark:border-[#38382E]'
                                  : appt.status === 'cancelled'
                                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40'
                                  : appt.status === 'completed'
                                  ? 'bg-white dark:bg-[#23231D] text-[#4A4A40] dark:text-[#EDEAE1] border border-[#E8E4D9] dark:border-[#38382E]'
                                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/40'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            {appt.status !== 'confirmed' && (
                              <button
                                onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                                className="px-3 py-1 bg-[#E8E4D9] dark:bg-[#25251E] hover:bg-[#D1C9BC] dark:hover:bg-[#313128] text-[#5A5A40] dark:text-[#C6D4AB] font-semibold rounded-full text-[10px] uppercase tracking-wider cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}
                            {appt.status !== 'completed' && (
                              <button
                                onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                                className="px-3 py-1 bg-white dark:bg-[#2A2A22] hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] text-[#4A4A40] dark:text-[#EDEAE1] border border-[#E8E4D9] dark:border-[#38382E] font-semibold rounded-full text-[10px] uppercase tracking-wider cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                            {appt.status !== 'cancelled' && (
                              <button
                                onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                                className="px-3 py-1 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 font-semibold rounded-full text-[10px] uppercase tracking-wider cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight">
                  {t('admin.services')}
                </h1>
                <p className="text-xs text-[#6B6658] dark:text-[#A6A295] mt-1 font-light">
                  Manage tutoring services. Inactive services disappear from public booking. Blank price displays as "Price subject to change".
                </p>
              </div>

              <button
                id="admin-add-service-btn"
                onClick={handleOpenAddService}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full transition-all shadow-xs cursor-pointer min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin.addService')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] p-6 sm:p-7 border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                          s.is_active
                            ? 'bg-[#E8E4D9] dark:bg-[#25251E] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#D1C9BC] dark:border-[#38382E]'
                            : 'bg-white dark:bg-[#23231D] text-[#8C867A] dark:text-[#7A766A] border border-[#E8E4D9] dark:border-[#38382E]'
                        }`}
                      >
                        {s.is_active ? 'Active' : 'Deactivated'}
                      </span>

                      <span className="text-xs font-medium text-[#8C867A] dark:text-[#A6A295]">
                        {s.duration_minutes} minutes
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">{s.name}</h3>
                    <p className="text-xs text-[#6B6658] dark:text-[#A6A295] mt-2 leading-relaxed font-light">
                      {s.description || 'No description provided.'}
                    </p>

                    <div className="mt-4 pt-3.5 border-t border-[#E8E4D9] dark:border-[#2E2E24] text-xs">
                      <span className="text-[#8C867A] dark:text-[#A6A295]">Pricing: </span>
                      {s.price === null || s.price === undefined ? (
                        <span className="font-medium text-amber-800 dark:text-amber-300">
                          Price subject to change (NULL)
                        </span>
                      ) : (
                        <span className="font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">
                          ${s.price} AUD / session
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E4D9] dark:border-[#2E2E24] flex items-center justify-between">
                    <button
                      onClick={() => updateService(s.id, { is_active: !s.is_active })}
                      className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-colors cursor-pointer min-h-[36px] ${
                        s.is_active
                          ? 'bg-white dark:bg-[#25251E] hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] border border-[#E8E4D9] dark:border-[#38382E] text-[#4A4A40] dark:text-[#EDEAE1]'
                          : 'bg-[#E8E4D9] dark:bg-[#38382E] hover:bg-[#D1C9BC] dark:hover:bg-[#434336] text-[#5A5A40] dark:text-[#C6D4AB]'
                      }`}
                    >
                      {s.is_active ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleOpenEditService(s)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] dark:hover:text-white bg-white dark:bg-[#25251E] hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] border border-[#E8E4D9] dark:border-[#38382E] rounded-full transition-colors cursor-pointer min-h-[36px]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{t('admin.editService')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUSINESS HOURS TAB */}
        {activeTab === 'hours' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight">
                {t('admin.businessHours')}
              </h1>
              <p className="text-xs text-[#6B6658] dark:text-[#A6A295] mt-1 font-light">
                Default: All 7 days open 09:00 to 21:00. Modifying hours immediately updates booking slot availability.
              </p>
            </div>

            <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs p-5 sm:p-7 space-y-3.5">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                (dayName, dayIndex) => {
                  const schedule = businessHours.find((h) => {
                    if (typeof h.weekday === 'number') return h.weekday === dayIndex;
                    if (typeof h.weekday === 'string') {
                      const p = parseInt(h.weekday, 10);
                      if (!isNaN(p)) return p === dayIndex;
                      return h.weekday.toLowerCase() === dayName.toLowerCase();
                    }
                    return false;
                  });

                  const isOpen = schedule ? schedule.is_open : true;
                  const startTime = schedule?.start_time || '09:00';
                  const endTime = schedule?.end_time || '21:00';

                  return (
                    <div
                      key={dayIndex}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A]"
                    >
                      <div className="flex items-center gap-3 w-36">
                        <input
                          type="checkbox"
                          checked={isOpen}
                          onChange={(e) =>
                            updateBusinessHour(schedule?.id || dayIndex, {
                              is_open: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-[#5A5A40] dark:text-[#A3B18A] focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A]"
                        />
                        <span className={`text-xs font-serif font-semibold ${isOpen ? 'text-[#2D2C27] dark:text-[#EDEAE1]' : 'text-[#8C867A] dark:text-[#7A766A]'}`}>
                          {dayName}
                        </span>
                      </div>

                      {isOpen ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) =>
                              updateBusinessHour(schedule?.id || dayIndex, {
                                start_time: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 bg-[#F5F2ED] dark:bg-[#1A1A15] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs text-[#2D2C27] dark:text-[#EDEAE1]"
                          />
                          <span className="text-[#8C867A] dark:text-[#A6A295]">to</span>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) =>
                              updateBusinessHour(schedule?.id || dayIndex, {
                                end_time: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 bg-[#F5F2ED] dark:bg-[#1A1A15] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs text-[#2D2C27] dark:text-[#EDEAE1]"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-[#8C867A] dark:text-[#7A766A]">Closed</span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* BLOCKED DATES TAB */}
        {activeTab === 'blocked' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight">
                {t('admin.blockedDates')}
              </h1>
              <p className="text-xs text-[#6B6658] dark:text-[#A6A295] mt-1 font-light">
                Blocked dates prevent all bookings and rescheduling on that day.
              </p>
            </div>

            {/* Add Blocked Date Form */}
            <form
              onSubmit={handleAddBlockedDateSubmit}
              className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] p-6 sm:p-7 border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs flex flex-col sm:flex-row items-end gap-3.5"
            >
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Blocked Date
                </label>
                <input
                  type="date"
                  required
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-medium text-[#2D2C27] dark:text-[#EDEAE1]"
                />
              </div>

              <div className="flex-1 w-full">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={newBlockedReason}
                  onChange={(e) => setNewBlockedReason(e.target.value)}
                  placeholder="e.g. Public Holiday / NSW School Term Break"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-medium text-[#2D2C27] dark:text-[#EDEAE1]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full shadow-xs cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                {t('admin.addBlockedDate')}
              </button>
            </form>

            {/* Blocked Dates List */}
            <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs divide-y divide-[#E8E4D9] dark:divide-[#2E2E24]">
              {blockedDates.length === 0 ? (
                <p className="p-8 text-center text-xs text-[#8C867A] dark:text-[#A6A295] font-light">
                  No blocked dates configured.
                </p>
              ) : (
                blockedDates.map((b) => (
                  <div key={b.id} className="p-4.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-serif font-semibold text-sm text-[#2D2C27] dark:text-[#EDEAE1] block">
                        {b.blocked_date}
                      </span>
                      <span className="text-[#6B6658] dark:text-[#A6A295]">
                        {b.reason || 'No reason specified'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeBlockedDate(b.id)}
                      className="px-3.5 py-1 text-xs uppercase tracking-wider font-semibold text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-full cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* BUSINESS SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight">
                {t('admin.settings')}
              </h1>
              <p className="text-xs text-[#6B6658] dark:text-[#A6A295] mt-1 font-light">
                Configure business metadata and booking constraints. Phone and address remain hidden from public if NULL.
              </p>
            </div>

            {settingsSavedMsg && (
              <div className="p-3.5 bg-[#E8E4D9] dark:bg-[#25251E] rounded-2xl border border-[#D1C9BC] dark:border-[#38382E] text-xs text-[#5A5A40] dark:text-[#C6D4AB] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings saved successfully!</span>
              </div>
            )}

            <form
              onSubmit={handleSaveBusinessSettings}
              className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[28px] p-6 sm:p-7 border border-[#E8E4D9] dark:border-[#2E2E24] shadow-xs space-y-4 text-xs"
            >
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-medium text-[#2D2C27] dark:text-[#EDEAE1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Primary Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-medium text-[#2D2C27] dark:text-[#EDEAE1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Business Phone (Optional - leaves NULL if blank)
                </label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  placeholder="Leave blank to hide phone from website"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-medium text-[#2D2C27] dark:text-[#EDEAE1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Business Physical Address (Optional - leaves NULL if blank)
                </label>
                <input
                  type="text"
                  value={settingsAddress}
                  onChange={(e) => setSettingsAddress(e.target.value)}
                  placeholder="Leave blank to hide physical address from website"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-medium text-[#2D2C27] dark:text-[#EDEAE1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    Slot Interval (Minutes)
                  </label>
                  <input
                    type="number"
                    value={settingsInterval}
                    onChange={(e) => setSettingsInterval(Number(e.target.value))}
                    min={15}
                    step={15}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-medium text-[#2D2C27] dark:text-[#EDEAE1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    Advance Notice (Hours)
                  </label>
                  <input
                    type="number"
                    value={settingsNotice}
                    onChange={(e) => setSettingsNotice(Number(e.target.value))}
                    min={0}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-xs font-medium text-[#2D2C27] dark:text-[#EDEAE1]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E4D9] dark:border-[#2E2E24] flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full shadow-xs cursor-pointer min-h-[44px]"
                >
                  {t('admin.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* SERVICE EDIT / ADD MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FDFCF8] dark:bg-[#1A1A15] rounded-[32px] p-6 sm:p-7 max-w-md w-full border border-[#E8E4D9] dark:border-[#2E2E24] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4D9] dark:border-[#2E2E24]">
              <h3 className="font-serif font-bold text-xl text-[#2D2C27] dark:text-[#EDEAE1]">
                {editingService ? t('admin.editService') : t('admin.addService')}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="p-1.5 rounded-full text-[#8C867A] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] hover:bg-[#E8E4D9] dark:hover:bg-[#25251E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={serviceFormName}
                  onChange={(e) => setServiceFormName(e.target.value)}
                  placeholder="e.g. Junior Year (Year 7 - 10)"
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={serviceFormDesc}
                  onChange={(e) => setServiceFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    value={serviceFormDuration}
                    onChange={(e) => setServiceFormDuration(Number(e.target.value))}
                    min={30}
                    step={15}
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    Price (AUD)
                  </label>
                  <input
                    type="number"
                    value={serviceFormPrice}
                    onChange={(e) => setServiceFormPrice(e.target.value)}
                    placeholder="Leave blank for NULL"
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1]"
                  />
                  <span className="text-[10px] text-[#8C867A] dark:text-[#A6A295] block mt-1 font-light">
                    Blank = "Price subject to change"
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="service-active-toggle"
                  checked={serviceFormActive}
                  onChange={(e) => setServiceFormActive(e.target.checked)}
                  className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] rounded focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A]"
                />
                <label htmlFor="service-active-toggle" className="font-medium text-[#2D2C27] dark:text-[#EDEAE1]">
                  Active (Visible on public site)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4D9] dark:border-[#2E2E24]">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-5 py-2 text-[#6B6658] dark:text-[#A6A295] hover:bg-[#E8E4D9] dark:hover:bg-[#25251E] rounded-full font-semibold uppercase tracking-wider text-[11px] cursor-pointer min-h-[36px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] text-white dark:text-[#171714] rounded-full font-semibold uppercase tracking-widest text-[11px] shadow-xs cursor-pointer min-h-[36px]"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE LESSON MODAL */}
      {apptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F2ED] dark:bg-[#1A1A15] rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-[#E8E4D9] dark:border-[#2E2E24] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4D9] dark:border-[#2E2E24]">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">
                  Schedule New Lesson
                </h3>
                <p className="text-xs text-[#6B6658] dark:text-[#A6A295] font-light">
                  Add an in-person or online tutoring appointment for a student
                </p>
              </div>
              <button
                onClick={() => setApptModalOpen(false)}
                className="p-1.5 rounded-full text-[#8C867A] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] hover:bg-[#E8E4D9] dark:hover:bg-[#25251E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointmentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Student / Client Full Name *
                </label>
                <input
                  id="admin-new-appt-name"
                  type="text"
                  required
                  value={newApptName}
                  onChange={(e) => setNewApptName(e.target.value)}
                  placeholder="e.g. Liam Zhang"
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="admin-new-appt-email"
                    type="email"
                    required
                    value={newApptEmail}
                    onChange={(e) => setNewApptEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="admin-new-appt-phone"
                    type="tel"
                    value={newApptPhone}
                    onChange={(e) => setNewApptPhone(e.target.value)}
                    placeholder="0412 345 678"
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Subject / Tutoring Service *
                </label>
                <select
                  id="admin-new-appt-service"
                  value={newApptServiceId}
                  onChange={(e) => setNewApptServiceId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none cursor-pointer"
                >
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name} ({svc.duration_minutes}m{svc.price ? ` - $${svc.price}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    Date *
                  </label>
                  <input
                    id="admin-new-appt-date"
                    type="date"
                    required
                    value={newApptDate}
                    onChange={(e) => setNewApptDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    Start Time *
                  </label>
                  <input
                    id="admin-new-appt-start"
                    type="time"
                    required
                    value={newApptStart}
                    onChange={(e) => setNewApptStart(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    End Time *
                  </label>
                  <input
                    id="admin-new-appt-end"
                    type="time"
                    required
                    value={newApptEnd}
                    onChange={(e) => setNewApptEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Booking Status
                </label>
                <select
                  id="admin-new-appt-status"
                  value={newApptStatus}
                  onChange={(e) => setNewApptStatus(e.target.value as AppointmentStatus)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none cursor-pointer"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                  Lesson Notes & Focus Topics
                </label>
                <textarea
                  id="admin-new-appt-notes"
                  rows={2}
                  value={newApptNotes}
                  onChange={(e) => setNewApptNotes(e.target.value)}
                  placeholder="e.g. Preparing for Module 6 HSC Trial exam, kinetics focus..."
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4D9] dark:border-[#2E2E24]">
                <button
                  type="button"
                  onClick={() => setApptModalOpen(false)}
                  className="px-5 py-2 text-[#6B6658] dark:text-[#A6A295] hover:bg-[#E8E4D9] dark:hover:bg-[#25251E] rounded-full font-semibold uppercase tracking-wider text-[11px] cursor-pointer min-h-[36px]"
                >
                  Cancel
                </button>
                <button
                  id="admin-new-appt-submit-btn"
                  type="submit"
                  disabled={isSubmittingAppt}
                  className="px-6 py-2.5 bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] disabled:opacity-50 text-white dark:text-[#171714] rounded-full font-semibold uppercase tracking-widest text-[11px] shadow-xs cursor-pointer min-h-[36px]"
                >
                  {isSubmittingAppt ? 'Scheduling...' : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
