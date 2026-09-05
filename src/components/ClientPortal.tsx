import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Appointment, TimeSlot } from '../types';
import {
  formatDateToYMD,
  parseYMDToDate,
  formatTime12h,
  generateAvailableSlots,
} from '../lib/availability';
import {
  Calendar,
  Clock,
  LogOut,
  AlertTriangle,
  RotateCcw,
  XCircle,
  CheckCircle,
} from 'lucide-react';

interface ClientPortalProps {
  onBackToSite: () => void;
  onOpenBooking: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onBackToSite, onOpenBooking }) => {
  const { t, language } = useLanguage();
  const { user, session, signOut } = useAuth();
  const { businessHours, blockedDates, businessSettings, services } = useData();

  const getServiceName = (s?: { name: string; id?: string } | null) => {
    if (!s) return language === 'zh' ? '中学科学辅导' : 'Science Tutoring';
    if (language === 'zh') {
      if (s.id === 'srv-junior-1' || s.name?.toLowerCase().includes('junior') || s.name?.includes('7')) {
        return t('services.srvJuniorName');
      }
      if (s.id === 'srv-hsc-2' || s.name?.toLowerCase().includes('hsc') || s.name?.includes('11')) {
        return t('services.srvHscName');
      }
    }
    return s.name;
  };

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled' | 'account'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cancellation Modal State
  const [cancelModalAppt, setCancelModalAppt] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);

  // Reschedule Modal State
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<Appointment | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('');
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<TimeSlot | null>(null);
  const [rescheduling, setRescheduling] = useState<boolean>(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState<boolean>(false);

  // Load client appointments securely via server-side endpoint
  const loadClientAppointments = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const token = session?.access_token || '';
      const response = await fetch('/api/client/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to retrieve your appointments.');
      }

      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err: any) {
      console.error('Error fetching client appointments:', err);
      setErrorMsg(err.message || 'Error loading appointments.');
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    loadClientAppointments();
  }, [loadClientAppointments]);

  // Split appointments into categories
  const todayStr = formatDateToYMD(new Date());

  const upcomingList = useMemo(() => {
    return appointments
      .filter((a) => a.status === 'confirmed' && a.appointment_date >= todayStr)
      .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date));
  }, [appointments, todayStr]);

  const pastList = useMemo(() => {
    return appointments
      .filter((a) => a.status === 'confirmed' && a.appointment_date < todayStr)
      .sort((a, b) => b.appointment_date.localeCompare(a.appointment_date));
  }, [appointments, todayStr]);

  const cancelledList = useMemo(() => {
    return appointments
      .filter((a) => a.status === 'cancelled')
      .sort((a, b) => b.appointment_date.localeCompare(a.appointment_date));
  }, [appointments]);

  // Handle appointment cancellation
  const handleConfirmCancel = async () => {
    if (!cancelModalAppt) return;

    setCancelling(true);
    try {
      const token = session?.access_token || '';
      const response = await fetch(`/api/client/appointments/${cancelModalAppt.id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: cancelModalAppt.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Cancellation failed.');
      }

      // Update locally
      setAppointments((prev) =>
        prev.map((a) => (a.id === cancelModalAppt.id ? { ...a, status: 'cancelled' } : a))
      );
      setCancelModalAppt(null);
    } catch (err: any) {
      alert(err.message || 'Error cancelling appointment');
    } finally {
      setCancelling(false);
    }
  };

  // Open reschedule dialog
  const handleOpenReschedule = (appt: Appointment) => {
    setRescheduleModalAppt(appt);
    setNewRescheduleDate(appt.appointment_date);
    setSelectedRescheduleSlot(null);
    setRescheduleError(null);
    setRescheduleSuccess(false);
  };

  // Calculate available slots for rescheduling target date
  const rescheduleAvailableSlots = useMemo(() => {
    if (!rescheduleModalAppt || !newRescheduleDate) return [];

    const service =
      rescheduleModalAppt.service ||
      services.find((s) => s.id === rescheduleModalAppt.service_id) || {
        duration_minutes: 60,
      };

    return generateAvailableSlots({
      date: parseYMDToDate(newRescheduleDate),
      serviceDurationMinutes: service.duration_minutes,
      businessHours,
      blockedDates,
      existingAppointments: appointments.filter((a) => a.id !== rescheduleModalAppt.id),
      bookingNoticeHours: businessSettings.booking_notice_hours || 12,
    });
  }, [
    rescheduleModalAppt,
    newRescheduleDate,
    services,
    businessHours,
    blockedDates,
    appointments,
    businessSettings.booking_notice_hours,
  ]);

  // Confirm Reschedule
  const handleConfirmReschedule = async () => {
    if (!rescheduleModalAppt || !newRescheduleDate || !selectedRescheduleSlot) {
      setRescheduleError(t('portal.errorSelectSlot') || 'Please select an available date and time slot.');
      return;
    }

    setRescheduling(true);
    setRescheduleError(null);

    try {
      const token = session?.access_token || '';
      const response = await fetch(`/api/client/appointments/${rescheduleModalAppt.id}/reschedule`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: rescheduleModalAppt.id,
          newDate: newRescheduleDate,
          newStartTime: selectedRescheduleSlot.startTimeStr,
          newEndTime: selectedRescheduleSlot.endTimeStr,
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Rescheduling failed.');
      }

      setRescheduleSuccess(true);

      // Update locally
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === rescheduleModalAppt.id
            ? {
                ...a,
                appointment_date: newRescheduleDate,
                start_time: selectedRescheduleSlot.startTimeStr,
                end_time: selectedRescheduleSlot.endTimeStr,
              }
            : a
        )
      );

      setTimeout(() => {
        setRescheduleModalAppt(null);
        setRescheduleSuccess(false);
      }, 1200);
    } catch (err: any) {
      setRescheduleError(err.message || 'Rescheduling failed.');
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#171714] text-[#4A4A40] dark:text-[#EDEAE1] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header Bar */}
        <div className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[28px] p-6 sm:p-8 border border-[#E8E4D9] dark:border-[#313128] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5A5A40] dark:text-[#A3B18A] block">
              {t('portal.title')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1] tracking-tight mt-1">
              {t('portal.welcome')}, <span className="break-all">{user?.email}</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              id="portal-book-more-btn"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full transition-all shadow-xs cursor-pointer min-h-[44px]"
            >
              <Calendar className="w-4 h-4 text-[#E8E4D9] dark:text-[#171714]" />
              <span>{t('btn.bookAnother')}</span>
            </button>

            <button
              id="portal-back-to-site-btn"
              onClick={onBackToSite}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] dark:hover:text-white bg-white dark:bg-[#2A2A22] hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] border border-[#E8E4D9] dark:border-[#38382E] rounded-full transition-colors cursor-pointer min-h-[44px]"
            >
              {t('portal.returnToSite')}
            </button>

            <button
              id="portal-sign-out-btn"
              onClick={() => {
                signOut();
                onBackToSite();
              }}
              title={t('nav.signOut')}
              className="p-2.5 text-[#8C867A] dark:text-[#A6A295] hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === 'upcoming'
                ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                : 'bg-[#F5F2ED] dark:bg-[#20201A] text-[#6B6658] dark:text-[#A6A295] hover:bg-[#E8E4D9] dark:hover:bg-[#282820] border border-[#E8E4D9] dark:border-[#313128]'
            }`}
          >
            {t('portal.upcoming')} ({upcomingList.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === 'past'
                ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                : 'bg-[#F5F2ED] dark:bg-[#20201A] text-[#6B6658] dark:text-[#A6A295] hover:bg-[#E8E4D9] dark:hover:bg-[#282820] border border-[#E8E4D9] dark:border-[#313128]'
            }`}
          >
            {t('portal.past')} ({pastList.length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === 'cancelled'
                ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                : 'bg-[#F5F2ED] dark:bg-[#20201A] text-[#6B6658] dark:text-[#A6A295] hover:bg-[#E8E4D9] dark:hover:bg-[#282820] border border-[#E8E4D9] dark:border-[#313128]'
            }`}
          >
            {t('portal.cancelled')} ({cancelledList.length})
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === 'account'
                ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                : 'bg-[#F5F2ED] dark:bg-[#20201A] text-[#6B6658] dark:text-[#A6A295] hover:bg-[#E8E4D9] dark:hover:bg-[#282820] border border-[#E8E4D9] dark:border-[#313128]'
            }`}
          >
            {t('portal.account')}
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[28px] p-12 text-center border border-[#E8E4D9] dark:border-[#313128]">
            <div className="w-8 h-8 border-3 border-[#5A5A40] dark:border-[#A3B18A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#8C867A] dark:text-[#A6A295]">{t('portal.loading')}</p>
          </div>
        ) : (
          <div>
            {/* UPCOMING TAB */}
            {activeTab === 'upcoming' && (
              <div className="space-y-5">
                {upcomingList.length === 0 ? (
                  <div className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[28px] p-12 text-center border border-[#E8E4D9] dark:border-[#313128] space-y-4">
                    <Calendar className="w-10 h-10 text-[#8C867A] dark:text-[#A6A295] mx-auto" />
                    <p className="text-[#6B6658] dark:text-[#A6A295] text-sm font-light">{t('portal.noUpcoming')}</p>
                    <button
                      onClick={onOpenBooking}
                      className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full cursor-pointer shadow-xs min-h-[44px]"
                    >
                      {t('nav.book')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {upcomingList.map((appt) => {
                      const service =
                        appt.service || services.find((s) => s.id === appt.service_id);

                      return (
                        <div
                          key={appt.id}
                          className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[28px] p-6 sm:p-7 border border-[#E8E4D9] dark:border-[#313128] shadow-xs flex flex-col justify-between hover:border-[#5A5A40] dark:hover:border-[#A3B18A] transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E8E4D9] dark:bg-[#282820] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#D1C9BC] dark:border-[#38382E]">
                                {getServiceName(service)}
                              </span>
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#E8E4D9] dark:border-[#38382E]">
                                {t('portal.status.confirmed')}
                              </span>
                            </div>

                            <div className="space-y-2.5 mt-4">
                              <div className="flex items-center gap-2.5 text-base font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                                <Calendar className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                                <span>{appt.appointment_date}</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-sm font-medium text-[#5A5A40] dark:text-[#A3B18A]">
                                <Clock className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                                <span>
                                  {formatTime12h(appt.start_time)} – {formatTime12h(appt.end_time)}
                                </span>
                              </div>
                              {appt.notes && (
                                <div className="mt-3 p-3.5 bg-white dark:bg-[#191914] rounded-2xl border border-[#E8E4D9] dark:border-[#313128] text-xs text-[#6B6658] dark:text-[#A6A295]">
                                  <span className="font-semibold block text-[#2D2C27] dark:text-[#EDEAE1] mb-0.5">
                                    {t('portal.notesLabel')}
                                  </span>
                                  {appt.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-[#E8E4D9] dark:border-[#313128] flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => handleOpenReschedule(appt)}
                              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] bg-white dark:bg-[#2A2A22] hover:bg-[#E8E4D9] dark:hover:bg-[#33332A] border border-[#E8E4D9] dark:border-[#38382E] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>{t('portal.reschedule')}</span>
                            </button>

                            <button
                              onClick={() => setCancelModalAppt(appt)}
                              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{t('portal.cancel')}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PAST TAB */}
            {activeTab === 'past' && (
              <div className="space-y-4">
                {pastList.length === 0 ? (
                  <div className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[28px] p-10 text-center border border-[#E8E4D9] dark:border-[#313128]">
                    <p className="text-[#6B6658] dark:text-[#A6A295] text-sm font-light">{t('portal.noPast')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastList.map((appt) => {
                      const service =
                        appt.service || services.find((s) => s.id === appt.service_id);
                      return (
                        <div
                          key={appt.id}
                          className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[22px] p-5 border border-[#E8E4D9] dark:border-[#313128] flex items-center justify-between opacity-85"
                        >
                          <div>
                            <span className="font-serif font-semibold text-base text-[#2D2C27] dark:text-[#EDEAE1] block">
                              {getServiceName(service)}
                            </span>
                            <span className="text-xs text-[#8C867A] dark:text-[#A6A295] mt-0.5 block">
                              {appt.appointment_date} • {formatTime12h(appt.start_time)} – {formatTime12h(appt.end_time)}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white dark:bg-[#282820] text-[#8C867A] dark:text-[#A6A295] border border-[#E8E4D9] dark:border-[#38382E]">
                            {t('portal.status.completed')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CANCELLED TAB */}
            {activeTab === 'cancelled' && (
              <div className="space-y-4">
                {cancelledList.length === 0 ? (
                  <div className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[28px] p-10 text-center border border-[#E8E4D9] dark:border-[#313128]">
                    <p className="text-[#6B6658] dark:text-[#A6A295] text-sm font-light">{t('portal.noCancelled')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cancelledList.map((appt) => {
                      const service =
                        appt.service || services.find((s) => s.id === appt.service_id);
                      return (
                        <div
                          key={appt.id}
                          className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[22px] p-5 border border-red-100 dark:border-red-950/40 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-serif font-semibold text-base text-[#8C867A] dark:text-[#9E9A8E] line-through block">
                              {getServiceName(service)}
                            </span>
                            <span className="text-xs text-[#8C867A] dark:text-[#9E9A8E] mt-0.5 block">
                              {t('portal.originalDate')} {appt.appointment_date} • {formatTime12h(appt.start_time)}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                            {t('portal.status.cancelled')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <div className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[28px] p-7 border border-[#E8E4D9] dark:border-[#313128] max-w-lg space-y-4">
                <h3 className="text-lg font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                  {t('portal.account')}
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[#8C867A] dark:text-[#A6A295] block font-semibold uppercase tracking-wider text-[10px]">
                      {t('portal.registeredEmail')}
                    </span>
                    <span className="text-sm font-medium text-[#2D2C27] dark:text-[#EDEAE1] break-all">{user?.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8C867A] dark:text-[#A6A295] block font-semibold uppercase tracking-wider text-[10px]">{t('portal.userId')}</span>
                    <span className="font-mono text-[#4A4A40] dark:text-[#A6A295] break-all">{user?.id}</span>
                  </div>
                  <div>
                    <span className="text-[#8C867A] dark:text-[#A6A295] block font-semibold uppercase tracking-wider text-[10px]">
                      {t('portal.accountCreated')}
                    </span>
                    <span className="text-[#4A4A40] dark:text-[#EDEAE1]">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CANCELLATION CONFIRMATION MODAL */}
        {cancelModalAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2E25]/60 dark:bg-black/70 backdrop-blur-sm">
            <div className="bg-[#FDFCF8] dark:bg-[#1C1C17] rounded-[30px] p-6 sm:p-7 max-w-md w-full border border-[#E8E4D9] dark:border-[#33332A] shadow-2xl space-y-5">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="font-serif font-bold text-xl text-[#2D2C27] dark:text-[#EDEAE1]">
                  {t('portal.cancelConfirm')}
                </h3>
              </div>

              <div className="p-4.5 rounded-[20px] bg-[#F5F2ED] dark:bg-[#24241E] border border-[#E8E4D9] dark:border-[#33332A] text-xs space-y-1.5 text-[#4A4A40] dark:text-[#EDEAE1]">
                <p>
                  <strong>{t('portal.modalDate')}</strong> {cancelModalAppt.appointment_date}
                </p>
                <p>
                  <strong>{t('portal.modalTime')}</strong> {formatTime12h(cancelModalAppt.start_time)} – {formatTime12h(cancelModalAppt.end_time)}
                </p>
              </div>

              <p className="text-xs text-[#6B6658] dark:text-[#A6A295] leading-relaxed font-light">
                {t('portal.cancelWarning')}
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalAppt(null)}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#4A4A40] dark:text-[#EDEAE1] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] rounded-full border border-[#E8E4D9] dark:border-[#38382E] cursor-pointer min-h-[44px]"
                >
                  {t('portal.keepBtn')}
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleConfirmCancel}
                  className="px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-full shadow-xs cursor-pointer min-h-[44px]"
                >
                  {cancelling ? t('portal.cancelling') : t('portal.confirmCancelBtn')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESCHEDULE MODAL */}
        {rescheduleModalAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2E25]/60 dark:bg-black/70 backdrop-blur-sm">
            <div className="bg-[#FDFCF8] dark:bg-[#1C1C17] rounded-[32px] p-6 sm:p-7 max-w-md w-full border border-[#E8E4D9] dark:border-[#33332A] shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E4D9] dark:border-[#33332A]">
                <h3 className="font-serif font-bold text-xl text-[#2D2C27] dark:text-[#EDEAE1]">
                  {t('portal.rescheduleTitle')}
                </h3>
                <button
                  onClick={() => setRescheduleModalAppt(null)}
                  className="p-1.5 rounded-full text-[#8C867A] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {rescheduleSuccess ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle className="w-12 h-12 text-[#5A5A40] dark:text-[#A3B18A] mx-auto" />
                  <p className="font-serif font-bold text-lg text-[#2D2C27] dark:text-[#EDEAE1]">{t('portal.rescheduleSuccess')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rescheduleError && (
                    <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                      {rescheduleError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                      {t('portal.newDate')}
                    </label>
                    <input
                      type="date"
                      value={newRescheduleDate}
                      min={formatDateToYMD(new Date(Date.now() + 86400000))}
                      onChange={(e) => {
                        setNewRescheduleDate(e.target.value);
                        setSelectedRescheduleSlot(null);
                      }}
                      className="w-full px-3.5 py-2.5 border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-sm font-medium bg-white dark:bg-[#23231D] text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:border-[#5A5A40] dark:focus:border-[#A3B18A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                      {t('portal.availableSlots')}
                    </label>
                    {rescheduleAvailableSlots.length === 0 ? (
                      <p className="text-xs text-[#8C867A] dark:text-[#A6A295] p-3.5 bg-[#F5F2ED] dark:bg-[#24241E] rounded-2xl border border-[#E8E4D9] dark:border-[#33332A]">
                        {t('portal.noSlotsOnDate')}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                        {rescheduleAvailableSlots.map((slot, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedRescheduleSlot(slot)}
                            className={`py-2 px-3 rounded-full text-xs font-medium border transition-colors cursor-pointer min-h-[40px] ${
                              selectedRescheduleSlot?.startTimeStr === slot.startTimeStr
                                ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] border-[#5A5A40] dark:border-[#A3B18A]'
                                : 'bg-white dark:bg-[#24241E] text-[#4A4A40] dark:text-[#EDEAE1] border-[#E8E4D9] dark:border-[#33332A] hover:border-[#5A5A40] dark:hover:border-[#A3B18A]'
                            }`}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E4D9] dark:border-[#33332A]">
                    <button
                      type="button"
                      onClick={() => setRescheduleModalAppt(null)}
                      className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#4A4A40] dark:text-[#EDEAE1] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] rounded-full border border-[#E8E4D9] dark:border-[#38382E] cursor-pointer min-h-[44px]"
                    >
                      {t('btn.close')}
                    </button>
                    <button
                      type="button"
                      disabled={rescheduling || !selectedRescheduleSlot}
                      onClick={handleConfirmReschedule}
                      className="px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] disabled:opacity-50 rounded-full shadow-xs cursor-pointer min-h-[44px]"
                    >
                      {rescheduling ? t('portal.saving') : t('portal.confirmNewTime')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
