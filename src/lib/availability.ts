import { BusinessHour, BlockedDate, Appointment, Service, TimeSlot, OccurrenceSlot } from '../types';

/**
 * Format Date to YYYY-MM-DD safely
 */
export function formatDateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Safe parse of YYYY-MM-DD string into local midnight Date
 */
export function parseYMDToDate(ymd: string): Date {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0);
}

/**
 * Format HH:MM to Australian 12-hour friendly time (e.g. 9:00 AM, 3:30 PM)
 */
export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Add minutes to "HH:MM" string and return new "HH:MM"
 */
export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const totalMin = h * 60 + m + minutesToAdd;
  const newH = Math.floor(totalMin / 60);
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

/**
 * Convert time string "HH:MM" or "HH:MM:SS" to minutes from midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

/**
 * Generate all candidate slots for a specific date given business hours,
 * slot intervals, booking notice, and service duration.
 */
export function generateAvailableSlots(params: {
  date: Date;
  serviceDurationMinutes: number;
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  existingAppointments: Appointment[];
  slotIntervalMinutes?: number;
  bookingNoticeHours?: number;
}): TimeSlot[] {
  const {
    date,
    serviceDurationMinutes,
    businessHours,
    blockedDates,
    existingAppointments,
    slotIntervalMinutes = 30,
    bookingNoticeHours = 12,
  } = params;

  const dateStr = formatDateToYMD(date);

  // 1. Check if date is blocked
  const isBlocked = blockedDates.some((b) => b.blocked_date === dateStr);
  if (isBlocked) return [];

  // 2. Check weekday in business hours
  // Weekday 0=Sunday, 1=Monday ... 6=Saturday
  const dayIndex = date.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = dayNames[dayIndex];

  const daySchedule = businessHours.find((h) => {
    if (typeof h.weekday === 'number') {
      return h.weekday === dayIndex;
    }
    if (typeof h.weekday === 'string') {
      const parsed = parseInt(h.weekday, 10);
      if (!isNaN(parsed)) return parsed === dayIndex;
      return h.weekday.toLowerCase() === currentDayName.toLowerCase();
    }
    return false;
  });

  // If day not found in business hours, fallback to default 09:00 to 21:00
  const isOpen = daySchedule ? daySchedule.is_open : true;
  if (!isOpen) return [];

  const openTime = daySchedule?.start_time || '09:00';
  const closeTime = daySchedule?.end_time || '21:00';

  const openMin = timeStringToMinutes(openTime);
  const closeMin = timeStringToMinutes(closeTime);

  // Filter appointments on this date that are NOT cancelled
  const dayAppointments = existingAppointments.filter(
    (a) => a.appointment_date === dateStr && a.status !== 'cancelled'
  );

  const now = new Date();
  const minAllowedTime = new Date(now.getTime() + bookingNoticeHours * 60 * 60 * 1000);

  const availableSlots: TimeSlot[] = [];

  // Candidate start times in steps of slotIntervalMinutes
  for (let startMin = openMin; startMin + serviceDurationMinutes <= closeMin; startMin += slotIntervalMinutes) {
    const endMin = startMin + serviceDurationMinutes;

    const startH = Math.floor(startMin / 60);
    const startM = startMin % 60;
    const endH = Math.floor(endMin / 60);
    const endM = endMin % 60;

    const startTimeStr = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    // Exact Date objects for slot start and end
    const slotStartObj = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startH, startM, 0);
    const slotEndObj = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endH, endM, 0);

    // Enforce booking notice cutoff
    if (slotStartObj < minAllowedTime) {
      continue;
    }

    // Overlap rule: new_start < existing_end AND new_end > existing_start
    const hasOverlap = dayAppointments.some((appt) => {
      const apptStartMin = timeStringToMinutes(appt.start_time);
      const apptEndMin = timeStringToMinutes(appt.end_time);
      return startMin < apptEndMin && endMin > apptStartMin;
    });

    if (!hasOverlap) {
      availableSlots.push({
        start: slotStartObj,
        end: slotEndObj,
        startTimeStr,
        endTimeStr,
        label: `${formatTime12h(startTimeStr)} – ${formatTime12h(endTimeStr)}`,
      });
    }
  }

  return availableSlots;
}

/**
 * Validate an occurrence slot for conflicts
 */
export function validateOccurrenceSlot(params: {
  occurrence: OccurrenceSlot;
  serviceDurationMinutes: number;
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  existingAppointments: Appointment[];
  bookingNoticeHours?: number;
  otherSelectedOccurrences?: OccurrenceSlot[];
}): { isValid: boolean; reason?: string } {
  const {
    occurrence,
    serviceDurationMinutes,
    businessHours,
    blockedDates,
    existingAppointments,
    bookingNoticeHours = 12,
    otherSelectedOccurrences = [],
  } = params;

  if (!occurrence.dateStr || !occurrence.startTimeStr) {
    return { isValid: false, reason: 'Date and start time must be selected' };
  }

  // 1. Blocked date check
  const isBlocked = blockedDates.some((b) => b.blocked_date === occurrence.dateStr);
  if (isBlocked) {
    return { isValid: false, reason: 'This date is blocked for tutoring' };
  }

  // 2. Business hours check
  const dateObj = parseYMDToDate(occurrence.dateStr);
  const dayIndex = dateObj.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dayIndex];

  const daySchedule = businessHours.find((h) => {
    if (typeof h.weekday === 'number') return h.weekday === dayIndex;
    if (typeof h.weekday === 'string') {
      const p = parseInt(h.weekday, 10);
      if (!isNaN(p)) return p === dayIndex;
      return h.weekday.toLowerCase() === dayName.toLowerCase();
    }
    return false;
  });

  const isOpen = daySchedule ? daySchedule.is_open : true;
  if (!isOpen) {
    return { isValid: false, reason: 'Tutoring is closed on this day' };
  }

  const openTime = daySchedule?.start_time || '09:00';
  const closeTime = daySchedule?.end_time || '21:00';
  const openMin = timeStringToMinutes(openTime);
  const closeMin = timeStringToMinutes(closeTime);

  const startMin = timeStringToMinutes(occurrence.startTimeStr);
  const endMin = timeStringToMinutes(occurrence.endTimeStr || addMinutesToTime(occurrence.startTimeStr, serviceDurationMinutes));

  if (startMin < openMin || endMin > closeMin) {
    return { isValid: false, reason: `Slot must fit within operating hours (${formatTime12h(openTime)} – ${formatTime12h(closeTime)})` };
  }

  // 3. Notice hours check
  const now = new Date();
  const minNoticeTime = new Date(now.getTime() + bookingNoticeHours * 60 * 60 * 1000);
  const startHours = Math.floor(startMin / 60);
  const startMinutes = startMin % 60;
  const lessonStartObj = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), startHours, startMinutes, 0);

  if (lessonStartObj < minNoticeTime) {
    return { isValid: false, reason: `Requires at least ${bookingNoticeHours}h advance notice` };
  }

  // 4. Overlap with existing database appointments
  const dayAppointments = existingAppointments.filter(
    (a) => a.appointment_date === occurrence.dateStr && a.status !== 'cancelled'
  );

  const dbOverlap = dayAppointments.some((appt) => {
    const aStart = timeStringToMinutes(appt.start_time);
    const aEnd = timeStringToMinutes(appt.end_time);
    return startMin < aEnd && endMin > aStart;
  });

  if (dbOverlap) {
    return { isValid: false, reason: 'Time slot overlaps with an existing confirmed appointment' };
  }

  // 5. Overlap with other occurrences in current booking basket
  const otherSameDay = otherSelectedOccurrences.filter(
    (o) => o.index !== occurrence.index && o.dateStr === occurrence.dateStr && o.startTimeStr
  );

  const basketOverlap = otherSameDay.some((other) => {
    const oStart = timeStringToMinutes(other.startTimeStr);
    const oEnd = timeStringToMinutes(other.endTimeStr);
    return startMin < oEnd && endMin > oStart;
  });

  if (basketOverlap) {
    return { isValid: false, reason: 'Conflicts with another lesson in your current schedule' };
  }

  return { isValid: true };
}
