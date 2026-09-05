import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  Service,
  PackageId,
  RecurrenceType,
  OccurrenceSlot,
  TimeSlot,
} from '../types';
import { PACKAGES } from './PackagesSection';
import {
  formatDateToYMD,
  parseYMDToDate,
  formatTime12h,
  addMinutesToTime,
  generateAvailableSlots,
  validateOccurrenceSlot,
} from '../lib/availability';
import {
  X,
  Check,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface BookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialPackageId?: PackageId;
  onOpenClientPortal: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialPackageId,
  onOpenClientPortal,
}) => {
  const { t, language } = useLanguage();
  const {
    activeServices,
    businessHours,
    blockedDates,
    businessSettings,
    adminAppointments,
    createAppointmentsPublic,
  } = useData();

  const getServiceName = (service: Service) => {
    if (language === 'zh') {
      if (service.id === 'srv-junior-1' || service.name.toLowerCase().includes('junior') || service.name.includes('7')) {
        return t('services.srvJuniorName');
      }
      if (service.id === 'srv-hsc-2' || service.name.toLowerCase().includes('hsc') || service.name.includes('11')) {
        return t('services.srvHscName');
      }
    }
    return service.name;
  };

  const getServiceDescription = (service: Service) => {
    if (language === 'zh') {
      if (service.id === 'srv-junior-1' || service.name.toLowerCase().includes('junior') || service.name.includes('7')) {
        return t('services.srvJuniorDesc');
      }
      if (service.id === 'srv-hsc-2' || service.name.toLowerCase().includes('hsc') || service.name.includes('11')) {
        return t('services.srvHscDesc');
      }
    }
    return service.description || '';
  };

  // Wizard Steps: 1 to 7
  // 1: Service, 2: Package, 3: Recurrence, 4: Dates & Times, 5: Client Info, 6: Review, 7: Success
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>('single');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('one-time');
  const [occurrences, setOccurrences] = useState<OccurrenceSlot[]>([]);

  // Active occurrence index being edited in Step 4
  const [activeOccurrenceIdx, setActiveOccurrenceIdx] = useState<number>(0);

  // Client Details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Execution state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<any | null>(null);

  // Set initial selections when opened
  useEffect(() => {
    if (isOpen) {
      if (initialServiceId) {
        setSelectedServiceId(initialServiceId);
      } else if (activeServices.length > 0 && !selectedServiceId) {
        setSelectedServiceId(activeServices[0].id);
      }

      if (initialPackageId) {
        setSelectedPackageId(initialPackageId);
        if (initialPackageId === 'single') {
          setRecurrence('one-time');
        } else {
          setRecurrence('weekly');
        }
      }
    }
  }, [isOpen, initialServiceId, initialPackageId, activeServices]);

  // Selected Service object
  const selectedService = useMemo(() => {
    return (
      activeServices.find((s) => s.id === selectedServiceId) ||
      activeServices[0] || {
        id: 'default',
        name: 'Science Tutoring',
        description: '',
        duration_minutes: 60,
        price: null,
        is_active: true,
      }
    );
  }, [activeServices, selectedServiceId]);

  // Selected Package object
  const selectedPackage = useMemo(() => {
    return PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[0];
  }, [selectedPackageId]);

  const targetSessions = selectedPackage.sessions;

  // Initialize or re-calculate occurrence dates when package or recurrence changes
  useEffect(() => {
    if (!isOpen) return;

    // Calculate baseline dates: starting tomorrow (or nearest available day)
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1); // Start next day to allow advance notice

    const newOccurrences: OccurrenceSlot[] = [];
    const intervalDays = recurrence === 'fortnightly' ? 14 : 7;

    for (let i = 0; i < targetSessions; i++) {
      const d = new Date(baseDate);
      if (recurrence === 'weekly' || recurrence === 'fortnightly') {
        d.setDate(baseDate.getDate() + i * intervalDays);
      } else if (recurrence === 'one-time') {
        // Just single day
      } else {
        // Custom: spaced by 7 days initially
        d.setDate(baseDate.getDate() + i * 7);
      }

      // Default time: 10:00 AM (09:00 - 21:00 schedule)
      const dateStr = formatDateToYMD(d);
      const startTimeStr = '10:00';
      const endTimeStr = addMinutesToTime(startTimeStr, selectedService.duration_minutes);

      newOccurrences.push({
        index: i,
        dateStr,
        startTimeStr,
        endTimeStr,
        isValid: false, // validate next
      });
    }

    // Validate all initial slots
    const validated = newOccurrences.map((occ) => {
      const val = validateOccurrenceSlot({
        occurrence: occ,
        serviceDurationMinutes: selectedService.duration_minutes,
        businessHours,
        blockedDates,
        existingAppointments: adminAppointments,
        bookingNoticeHours: businessSettings.booking_notice_hours || 12,
        otherSelectedOccurrences: newOccurrences,
      });

      return {
        ...occ,
        isValid: val.isValid,
        conflictReason: val.reason,
      };
    });

    setOccurrences(validated);
    setActiveOccurrenceIdx(0);
  }, [
    targetSessions,
    recurrence,
    selectedService.duration_minutes,
    businessHours,
    blockedDates,
    adminAppointments,
    businessSettings.booking_notice_hours,
    isOpen,
  ]);

  // Available slots for the currently active occurrence date
  const currentOccurrence = occurrences[activeOccurrenceIdx];

  const availableSlotsForActiveDate = useMemo(() => {
    if (!currentOccurrence?.dateStr) return [];

    return generateAvailableSlots({
      date: parseYMDToDate(currentOccurrence.dateStr),
      serviceDurationMinutes: selectedService.duration_minutes,
      businessHours,
      blockedDates,
      existingAppointments: adminAppointments,
      bookingNoticeHours: businessSettings.booking_notice_hours || 12,
    });
  }, [
    currentOccurrence?.dateStr,
    selectedService.duration_minutes,
    businessHours,
    blockedDates,
    adminAppointments,
    businessSettings.booking_notice_hours,
    occurrences,
    activeOccurrenceIdx,
  ]);

  // Handle slot selection for current occurrence
  const handleSelectSlot = (slot: TimeSlot) => {
    const updated = occurrences.map((occ, idx) => {
      if (idx === activeOccurrenceIdx) {
        return {
          ...occ,
          startTimeStr: slot.startTimeStr,
          endTimeStr: slot.endTimeStr,
        };
      }
      return occ;
    });

    // Re-validate all occurrences
    const validated = updated.map((occ) => {
      const val = validateOccurrenceSlot({
        occurrence: occ,
        serviceDurationMinutes: selectedService.duration_minutes,
        businessHours,
        blockedDates,
        existingAppointments: adminAppointments,
        bookingNoticeHours: businessSettings.booking_notice_hours || 12,
        otherSelectedOccurrences: updated,
      });
      return {
        ...occ,
        isValid: val.isValid,
        conflictReason: val.reason,
      };
    });

    setOccurrences(validated);
  };

  // Handle date change for current occurrence
  const handleDateChange = (newDateStr: string) => {
    const updated = occurrences.map((occ, idx) => {
      if (idx === activeOccurrenceIdx) {
        return {
          ...occ,
          dateStr: newDateStr,
        };
      }
      return occ;
    });

    // Re-validate all
    const validated = updated.map((occ) => {
      const val = validateOccurrenceSlot({
        occurrence: occ,
        serviceDurationMinutes: selectedService.duration_minutes,
        businessHours,
        blockedDates,
        existingAppointments: adminAppointments,
        bookingNoticeHours: businessSettings.booking_notice_hours || 12,
        otherSelectedOccurrences: updated,
      });
      return {
        ...occ,
        isValid: val.isValid,
        conflictReason: val.reason,
      };
    });

    setOccurrences(validated);
  };

  // All occurrences valid check
  const allOccurrencesValid =
    occurrences.length === targetSessions &&
    occurrences.every((o) => o.isValid && o.startTimeStr && o.dateStr);

  // Form submission handler
  const handleSubmitBooking = async () => {
    if (!allOccurrencesValid) {
      setSubmitError(t('booking.errorResolveConflicts'));
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setSubmitError(t('booking.errorFillRequired'));
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    // Build payload without id and created_at (database generates them)
    const appointmentItems = occurrences.map((occ) => ({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service_id: selectedService.id,
      appointment_date: occ.dateStr,
      start_time: occ.startTimeStr,
      end_time: occ.endTimeStr,
      notes: notes.trim() || null,
    }));

    const res = await createAppointmentsPublic(appointmentItems);

    setSubmitting(false);

    if (!res.success) {
      setSubmitError(res.error || 'Failed to submit appointments. Please try again.');
      return;
    }

    // Success state using local data
    setConfirmedData({
      service: selectedService,
      package: selectedPackage,
      recurrence,
      occurrences,
      fullName,
      email,
      phone,
      notes,
    });

    setStep(7); // Jump to success screen
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FDFCF8] dark:bg-[#1A1A15] rounded-[32px] shadow-2xl border border-[#E8E4D9] dark:border-[#2E2E24] overflow-hidden my-6">
        {/* Modal Header - Natural Tones Parchment */}
        <div className="bg-[#F5F2ED] dark:bg-[#20201A] text-[#2D2C27] dark:text-[#EDEAE1] px-5 sm:px-7 py-5 flex items-center justify-between border-b border-[#E8E4D9] dark:border-[#2E2E24]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5A5A40] dark:text-[#C6D4AB] block">
              Shanon Lee Tutoring
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-[#2D2C27] dark:text-[#EDEAE1]">
              {step === 7 ? t('success.title') : t('booking.title')}
            </h2>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#8C867A] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Steps 1 to 6) */}
        {step < 7 && (
          <div className="bg-[#F5F2ED] dark:bg-[#20201A] px-5 sm:px-7 py-3.5 border-b border-[#E8E4D9] dark:border-[#2E2E24] flex items-center justify-between text-xs font-semibold text-[#8C867A] dark:text-[#A6A295]">
            <span className="text-[#5A5A40] dark:text-[#C6D4AB] uppercase tracking-wider text-[11px] font-bold">
              Step {step} of 6:{' '}
              {step === 1 && t('booking.step1')}
              {step === 2 && t('booking.step2')}
              {step === 3 && t('booking.step3')}
              {step === 4 && t('booking.step4')}
              {step === 5 && t('booking.step5')}
              {step === 6 && t('booking.step6')}
            </span>

            {/* Visual Step Indicator Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    num === step
                      ? 'bg-[#5A5A40] dark:bg-[#A3B18A] scale-125'
                      : num < step
                      ? 'bg-[#8C867A] dark:bg-[#7A766A]'
                      : 'bg-[#E8E4D9] dark:bg-[#33332A]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                {t('booking.step1')}: {t('booking.step1SelectSubject')}
              </h3>

              <div className="space-y-3">
                {activeServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-4 sm:p-5 rounded-[22px] border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      selectedServiceId === srv.id
                        ? 'border-[#5A5A40] dark:border-[#A3B18A] bg-[#E8E4D9]/40 dark:bg-[#25251E] shadow-xs'
                        : 'border-[#E8E4D9] dark:border-[#2E2E24] hover:border-[#8C867A] dark:hover:border-[#5A5A40] bg-[#F5F2ED] dark:bg-[#20201A]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1] text-base sm:text-lg">
                          {getServiceName(srv)}
                        </span>
                        <span className="text-[11px] bg-white dark:bg-[#2A2A22] text-[#5A5A40] dark:text-[#C6D4AB] px-2.5 py-0.5 rounded-full font-medium border border-[#E8E4D9] dark:border-[#38382E]">
                          {srv.duration_minutes} {language === 'zh' ? '分钟' : 'min'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6658] dark:text-[#A6A295] mt-1 font-light leading-relaxed">
                        {getServiceDescription(srv)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      {srv.price === null ? (
                        <span className="text-xs font-semibold text-[#5A5A40] dark:text-[#C6D4AB] bg-[#E8E4D9] dark:bg-[#2A2A22] px-3 py-1 rounded-full border border-[#D1C9BC] dark:border-[#38382E]">
                          {t('services.pricePending')}
                        </span>
                      ) : (
                        <span className="text-base font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">
                          ${srv.price} {language === 'zh' ? '澳元' : 'AUD'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Package */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                  {t('booking.step2')}: {t('booking.choosePackage')}
                </h3>
                <p className="text-xs text-[#8C867A] dark:text-[#A6A295] mt-1">
                  {t('booking.step2Subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PACKAGES.map((pkg) => {
                  const isTenPack = pkg.id === '10-pack';
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackageId(pkg.id);
                        if (pkg.id === 'single') {
                          setRecurrence('one-time');
                        } else {
                          setRecurrence('weekly');
                        }
                      }}
                      className={`p-5 rounded-[24px] border transition-all cursor-pointer flex flex-col justify-between relative ${
                        selectedPackageId === pkg.id
                          ? 'border-[#5A5A40] dark:border-[#A3B18A] bg-[#E8E4D9]/40 dark:bg-[#25251E] shadow-sm'
                          : 'border-[#E8E4D9] dark:border-[#2E2E24] hover:border-[#8C867A] dark:hover:border-[#5A5A40] bg-[#F5F2ED] dark:bg-[#20201A]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1] text-base sm:text-lg">
                            {t(pkg.titleKey)}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A40] dark:text-[#C6D4AB] bg-[#E8E4D9] dark:bg-[#2A2A22] px-2.5 py-0.5 rounded-full border border-[#D1C9BC] dark:border-[#38382E] shrink-0">
                            {pkg.sessions} {language === 'zh' ? '课时' : (pkg.sessions === 1 ? 'lesson' : 'lessons')}
                          </span>
                        </div>

                        {isTenPack && (
                          <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-widest text-[#5A5A40] dark:text-[#A3B18A]">
                            {t('booking.recurringAllDates')}
                          </span>
                        )}

                        <p className="text-xs text-[#6B6658] dark:text-[#A6A295] mt-1.5 font-light leading-relaxed">
                          {t(pkg.subtitleKey)}
                        </p>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-[#E8E4D9] dark:border-[#2E2E24] text-xs font-medium text-[#8C867A] dark:text-[#A6A295] flex items-center justify-between">
                        {selectedService.price === null ? (
                          <span>{t('services.pricePending')}</span>
                        ) : (
                          <span>
                            {t('booking.total')} ${selectedService.price * pkg.sessions} {language === 'zh' ? '澳元' : 'AUD'}
                          </span>
                        )}
                        <span className="text-[10px] text-[#5A5A40] dark:text-[#C6D4AB]">
                          {t('booking.flexibleDates')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-2xl bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#2E2E24] text-xs text-[#6B6658] dark:text-[#A6A295] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5A5A40] dark:text-[#A3B18A] shrink-0" />
                <span>
                  <strong>{t('booking.portalGuarantee')}</strong> {t('booking.portalGuaranteeDesc')}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Recurrence */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                {t('booking.step3')}: {t('booking.step3Cadence')}
              </h3>

              <div className="space-y-3">
                {/* One-time */}
                {selectedPackage.sessions === 1 && (
                  <div
                    onClick={() => setRecurrence('one-time')}
                    className={`p-5 rounded-[22px] border transition-all cursor-pointer ${
                      recurrence === 'one-time'
                        ? 'border-[#5A5A40] dark:border-[#A3B18A] bg-[#E8E4D9]/40 dark:bg-[#25251E]'
                        : 'border-[#E8E4D9] dark:border-[#2E2E24] bg-[#F5F2ED] dark:bg-[#20201A]'
                    }`}
                  >
                    <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1] block text-base">
                      {t('booking.recurrence.onetime')}
                    </span>
                    <span className="text-xs text-[#6B6658] dark:text-[#A6A295] font-light mt-0.5 block">
                      {t('booking.recurrence.onetime.desc')}
                    </span>
                  </div>
                )}

                {/* Recurring options */}
                {selectedPackage.sessions > 1 && (
                  <>
                    <div
                      onClick={() => setRecurrence('weekly')}
                      className={`p-5 rounded-[22px] border transition-all cursor-pointer ${
                        recurrence === 'weekly'
                          ? 'border-[#5A5A40] dark:border-[#A3B18A] bg-[#E8E4D9]/40 dark:bg-[#25251E]'
                          : 'border-[#E8E4D9] dark:border-[#2E2E24] bg-[#F5F2ED] dark:bg-[#20201A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1] text-base">
                          {t('booking.recurrence.weekly')} ({t('booking.every7Days')})
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A40] dark:text-[#C6D4AB] bg-[#E8E4D9] dark:bg-[#2A2A22] px-2.5 py-0.5 rounded-full border border-[#D1C9BC] dark:border-[#38382E]">
                          {t('booking.recommendedBadge')}
                        </span>
                      </div>
                      <span className="text-xs text-[#6B6658] dark:text-[#A6A295] font-light block mt-1">
                        {t('booking.recurrence.weekly.desc')}
                      </span>
                    </div>

                    <div
                      onClick={() => setRecurrence('fortnightly')}
                      className={`p-5 rounded-[22px] border transition-all cursor-pointer ${
                        recurrence === 'fortnightly'
                          ? 'border-[#5A5A40] dark:border-[#A3B18A] bg-[#E8E4D9]/40 dark:bg-[#25251E]'
                          : 'border-[#E8E4D9] dark:border-[#2E2E24] bg-[#F5F2ED] dark:bg-[#20201A]'
                      }`}
                    >
                      <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1] block text-base">
                        {t('booking.recurrence.fortnightly')} ({t('booking.every14Days')})
                      </span>
                      <span className="text-xs text-[#6B6658] dark:text-[#A6A295] font-light block mt-1">
                        {t('booking.recurrence.fortnightly.desc')}
                      </span>
                    </div>

                    <div
                      onClick={() => setRecurrence('custom')}
                      className={`p-5 rounded-[22px] border transition-all cursor-pointer ${
                        recurrence === 'custom'
                          ? 'border-[#5A5A40] dark:border-[#A3B18A] bg-[#E8E4D9]/40 dark:bg-[#25251E]'
                          : 'border-[#E8E4D9] dark:border-[#2E2E24] bg-[#F5F2ED] dark:bg-[#20201A]'
                      }`}
                    >
                      <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1] block text-base">
                        {t('booking.recurrence.custom')}
                      </span>
                      <span className="text-xs text-[#6B6658] dark:text-[#A6A295] font-light block mt-1">
                        {t('booking.recurrence.custom.desc')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Select Dates & Times */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                    {t('booking.step4')}: {t('booking.step4Times')}
                  </h3>
                  <p className="text-xs text-[#8C867A] dark:text-[#A6A295]">
                    {t('booking.operatingNotice')}
                  </p>
                </div>

                {targetSessions > 1 && (
                  <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 bg-[#E8E4D9] dark:bg-[#25251E] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#D1C9BC] dark:border-[#38382E] rounded-full self-start sm:self-auto">
                    {occurrences.filter((o) => o.isValid && o.startTimeStr).length} {t('booking.of')} {targetSessions} {t('booking.scheduledCount')}
                  </span>
                )}
              </div>

              {/* Occurrences selector tabs if multi-session */}
              {targetSessions > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {occurrences.map((occ, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveOccurrenceIdx(idx)}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                        activeOccurrenceIdx === idx
                          ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] shadow-xs'
                          : occ.isValid
                          ? 'bg-[#E8E4D9] dark:bg-[#25251E] text-[#5A5A40] dark:text-[#C6D4AB] hover:bg-[#D1C9BC] dark:hover:bg-[#313126]'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40'
                      }`}
                    >
                      <span>{t('booking.lessonLabel')} {idx + 1} {t('booking.lessonSuffix')}</span>
                      {occ.isValid ? (
                        <Check className="w-3 h-3 text-current" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Active Occurrence Config Box */}
              <div className="p-5 sm:p-6 rounded-[26px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#2E2E24] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5A5A40] dark:text-[#C6D4AB]">
                    {t('booking.configuringLesson').replace('{cur}', String(activeOccurrenceIdx + 1)).replace('{total}', String(targetSessions))}
                  </span>
                  {currentOccurrence && (
                    <span className="text-xs font-medium text-[#8C867A] dark:text-[#A6A295]">
                      {t('booking.duration')} {selectedService.duration_minutes} min
                    </span>
                  )}
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    {t('booking.selectDate')}
                  </label>
                  <input
                    id="booking-date-picker"
                    type="date"
                    value={currentOccurrence?.dateStr || ''}
                    min={formatDateToYMD(new Date(Date.now() + 86400000))}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] font-medium focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none min-h-[44px]"
                  />
                </div>

                {/* Available Slots on this Date */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    {t('booking.selectTime')}
                  </label>

                  {availableSlotsForActiveDate.length === 0 ? (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{t('booking.noSlots')}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                      {availableSlotsForActiveDate.map((slot, idx) => {
                        const isSelected = currentOccurrence?.startTimeStr === slot.startTimeStr;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectSlot(slot)}
                            className={`py-2 px-3 rounded-full text-xs font-semibold border transition-all text-center cursor-pointer min-h-[38px] ${
                              isSelected
                                ? 'bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] border-[#5A5A40] dark:border-[#A3B18A] shadow-xs'
                                : 'bg-white dark:bg-[#23231D] text-[#4A4A40] dark:text-[#EDEAE1] border-[#E8E4D9] dark:border-[#33332A] hover:border-[#5A5A40] dark:hover:border-[#A3B18A]'
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Conflict indicator if occurrence has issues */}
                {!currentOccurrence?.isValid && currentOccurrence?.conflictReason && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{currentOccurrence.conflictReason}</span>
                  </div>
                )}
              </div>

              {/* Overview of all scheduled lessons */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] block">
                    {t('booking.allScheduledSessions')}
                  </span>
                  <span className="text-[10px] text-[#5A5A40] dark:text-[#C6D4AB] font-semibold">
                    {t('booking.changePortalTip')}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {occurrences.map((occ, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveOccurrenceIdx(idx)}
                      className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer border transition-colors ${
                        activeOccurrenceIdx === idx
                           ? 'bg-[#E8E4D9]/60 dark:bg-[#2A2A22] font-semibold border-[#5A5A40] dark:border-[#A3B18A]'
                          : 'bg-[#F5F2ED] dark:bg-[#20201A] text-[#4A4A40] dark:text-[#EDEAE1] border-[#E8E4D9] dark:border-[#2E2E24]'
                      }`}
                    >
                      <span>
                        {t('booking.lessonLabel')} {idx + 1} {t('booking.lessonSuffix')}: {occ.dateStr}
                      </span>
                      <span className={occ.isValid ? 'text-[#5A5A40] dark:text-[#C6D4AB] font-semibold' : 'text-red-600 dark:text-red-400 font-bold'}>
                        {occ.startTimeStr ? formatTime12h(occ.startTimeStr) : t('booking.pickSlot')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Client Information */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                {t('booking.step5')}: {t('booking.step5Contact')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    {t('form.fullName')} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-3.5" />
                    <input
                      id="client-name-input"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('form.fullNamePlaceholder')}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    {t('form.email')} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-3.5" />
                    <input
                      id="client-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('form.emailPlaceholder')}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    {t('form.phone')} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-3.5" />
                    <input
                      id="client-phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('form.phonePlaceholder')}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
                    {t('form.notes')}
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-3.5" />
                    <textarea
                      id="client-notes-input"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t('form.notesPlaceholder')}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review Booking */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                {t('booking.step6')}: {t('booking.step6Review')}
              </h3>

              <div className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[26px] p-5 sm:p-6 border border-[#E8E4D9] dark:border-[#2E2E24] space-y-4 text-sm">
                <div className="flex justify-between pb-3 border-b border-[#E8E4D9] dark:border-[#2E2E24]">
                  <span className="text-[#8C867A] dark:text-[#A6A295]">{t('booking.reviewService')}</span>
                  <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">{getServiceName(selectedService)}</span>
                </div>

                <div className="flex justify-between pb-3 border-b border-[#E8E4D9] dark:border-[#2E2E24]">
                  <span className="text-[#8C867A] dark:text-[#A6A295]">{t('booking.reviewPackage')}</span>
                  <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                    {t(selectedPackage.titleKey)} ({selectedPackage.sessions} {language === 'zh' ? '课时' : 'sessions'})
                  </span>
                </div>

                <div className="flex justify-between pb-3 border-b border-[#E8E4D9] dark:border-[#2E2E24]">
                  <span className="text-[#8C867A] dark:text-[#A6A295]">{t('booking.reviewCadence')}</span>
                  <span className="font-semibold capitalize text-[#2D2C27] dark:text-[#EDEAE1]">
                    {recurrence === 'weekly' ? (language === 'zh' ? '每周排课' : 'Weekly') : (language === 'zh' ? '单次授课' : 'One-time')}
                  </span>
                </div>

                <div>
                  <span className="text-[#8C867A] dark:text-[#A6A295] block mb-1.5 font-semibold text-xs uppercase tracking-wider">
                    {t('booking.reviewScheduledLessons')}
                  </span>
                  <div className="bg-white dark:bg-[#23231D] rounded-[18px] p-4 border border-[#E8E4D9] dark:border-[#2E2E24] space-y-1.5 text-xs">
                    {occurrences.map((o, idx) => (
                      <div key={idx} className="flex justify-between py-0.5">
                        <span className="font-medium text-[#4A4A40] dark:text-[#EDEAE1]">
                          {t('booking.lessonLabel')} {idx + 1} {t('booking.lessonSuffix')}: {o.dateStr}
                        </span>
                        <span className="text-[#5A5A40] dark:text-[#C6D4AB] font-semibold">
                          {formatTime12h(o.startTimeStr)} – {formatTime12h(o.endTimeStr)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#E8E4D9] dark:border-[#2E2E24]">
                  <span className="text-[#8C867A] dark:text-[#A6A295]">{t('booking.reviewStudentContact')}</span>
                  <span className="font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">
                    {fullName} ({phone})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8C867A] dark:text-[#A6A295]">{t('booking.reviewNotificationEmail')}</span>
                  <span className="font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">{email}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#E8E4D9] dark:border-[#2E2E24] items-center">
                  <span className="text-[#8C867A] dark:text-[#A6A295] font-semibold">{t('booking.reviewPricing')}</span>
                  {selectedService.price === null ? (
                    <span className="text-xs font-semibold text-[#5A5A40] dark:text-[#C6D4AB] bg-[#E8E4D9] dark:bg-[#2A2A22] px-3 py-1 rounded-full border border-[#D1C9BC] dark:border-[#38382E]">
                      {t('services.pricePending')}
                    </span>
                  ) : (
                    <span className="text-lg font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">
                      ${selectedService.price * selectedPackage.sessions} {t('booking.reviewEstimated')}
                    </span>
                  )}
                </div>

                <div className="pt-2 text-[11px] text-[#5A5A40] dark:text-[#C6D4AB] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('booking.reviewChangeAnytime')}</span>
                </div>
              </div>

              {submitError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Success Confirmation */}
          {step === 7 && confirmedData && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#E8E4D9] dark:bg-[#25251E] text-[#5A5A40] dark:text-[#C6D4AB] border border-[#D1C9BC] dark:border-[#38382E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">
                  {t('success.title')}
                </h3>
                <p className="text-sm text-[#6B6658] dark:text-[#A6A295] mt-2 max-w-md mx-auto leading-relaxed font-light">
                  {t('success.message')}
                </p>
              </div>

              <div className="bg-[#F5F2ED] dark:bg-[#20201A] rounded-[26px] p-6 border border-[#E8E4D9] dark:border-[#2E2E24] text-left text-xs space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#8C867A] dark:text-[#A6A295]">{t('booking.successSubject')}</span>
                  <span className="font-serif font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">{getServiceName(confirmedData.service)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C867A] dark:text-[#A6A295]">{t('booking.successStudent')}</span>
                  <span className="font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">{confirmedData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C867A] dark:text-[#A6A295]">{t('booking.successEmail')}</span>
                  <span className="font-semibold text-[#2D2C27] dark:text-[#EDEAE1]">{confirmedData.email}</span>
                </div>
                <div className="pt-2.5 border-t border-[#E8E4D9] dark:border-[#2E2E24]">
                  <span className="text-[#8C867A] dark:text-[#A6A295] block font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    {t('booking.successConfirmedSessions')}
                  </span>
                  {confirmedData.occurrences.map((occ: any, i: number) => (
                    <div key={i} className="flex justify-between text-[#4A4A40] dark:text-[#EDEAE1] py-0.5">
                      <span>{t('booking.lessonLabel')} {i + 1} {t('booking.lessonSuffix')}: {occ.dateStr}</span>
                      <span className="font-semibold text-[#5A5A40] dark:text-[#C6D4AB]">
                        {formatTime12h(occ.startTimeStr)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#8C867A] dark:text-[#A6A295] max-w-md mx-auto">
                {t('success.confirmationSent')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  id="success-portal-btn"
                  onClick={() => {
                    onClose();
                    onOpenClientPortal();
                  }}
                  className="px-7 py-3.5 rounded-full bg-[#5A5A40] dark:bg-[#A3B18A] text-white dark:text-[#171714] font-semibold text-xs uppercase tracking-widest hover:bg-[#484833] dark:hover:bg-[#8F9E72] transition-all cursor-pointer shadow-xs min-h-[44px]"
                >
                  {t('btn.viewPortal')}
                </button>
                <button
                  id="success-close-btn"
                  onClick={onClose}
                  className="px-7 py-3.5 rounded-full bg-white dark:bg-[#23231D] text-[#4A4A40] dark:text-[#EDEAE1] border border-[#E8E4D9] dark:border-[#33332A] font-semibold text-xs uppercase tracking-wider hover:bg-[#F5F2ED] dark:hover:bg-[#2A2A22] transition-all cursor-pointer min-h-[44px]"
                >
                  {t('btn.close')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 6) */}
        {step < 7 && (
          <div className="bg-[#F5F2ED] dark:bg-[#20201A] px-5 sm:px-7 py-4.5 border-t border-[#E8E4D9] dark:border-[#2E2E24] flex items-center justify-between">
            {step > 1 ? (
              <button
                id="booking-back-btn"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#4A4A40] dark:text-[#EDEAE1] hover:text-[#2D2C27] dark:hover:text-white rounded-full border border-[#E8E4D9] dark:border-[#33332A] bg-white dark:bg-[#23231D] hover:bg-[#E8E4D9] dark:hover:bg-[#2A2A22] transition-colors cursor-pointer min-h-[40px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('btn.back')}</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                id="booking-continue-btn"
                onClick={() => {
                  if (step === 4 && !allOccurrencesValid) {
                    setSubmitError(t('booking.errorResolveConflicts'));
                    return;
                  }
                  if (step === 5 && (!fullName.trim() || !email.trim() || !phone.trim())) {
                    setSubmitError(t('booking.errorFillRequired'));
                    return;
                  }
                  setSubmitError(null);
                  setStep(step + 1);
                }}
                className="inline-flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] rounded-full transition-all cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>{t('btn.next')}</span>
                <ChevronRight className="w-4 h-4 text-white dark:text-[#171714]" />
              </button>
            ) : (
              <button
                id="booking-submit-btn"
                disabled={submitting}
                onClick={handleSubmitBooking}
                className="inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] disabled:opacity-50 rounded-full transition-all cursor-pointer shadow-xs min-h-[44px]"
              >
                {submitting ? (
                  <span>{t('btn.submitting')}</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-white dark:text-[#171714]" />
                    <span>{t('btn.confirmBooking')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
