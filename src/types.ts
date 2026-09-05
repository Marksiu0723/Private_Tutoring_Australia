export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number | null;
  is_active: boolean;
  created_at?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM or HH:MM:SS
  end_time: string; // HH:MM or HH:MM:SS
  status: AppointmentStatus;
  notes: string | null;
  created_at?: string;
  // Optional joined data for display:
  service?: Service;
}

export interface BusinessHour {
  id?: string;
  weekday: number | string; // 0=Sunday, 1=Monday, etc. or 'Sunday', 'Monday'
  is_open: boolean;
  start_time: string; // HH:MM (e.g. '09:00')
  end_time: string; // HH:MM (e.g. '21:00')
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string | null;
  created_at?: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string | null;
  business_address: string | null;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  created_at?: string;
}

export type PackageId = 'single' | '10-pack' | '4-pack' | '8-pack' | '12-pack';

export interface PackageOption {
  id: PackageId;
  sessions: number;
  titleKey: string;
  subtitleKey: string;
  discountNoteKey?: string;
  isPopular?: boolean;
}

export type RecurrenceType = 'one-time' | 'weekly' | 'fortnightly' | 'custom';

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
  startTimeStr: string; // HH:MM
  endTimeStr: string; // HH:MM
}

export interface OccurrenceSlot {
  index: number;
  dateStr: string; // YYYY-MM-DD
  startTimeStr: string; // HH:MM
  endTimeStr: string; // HH:MM
  label?: string;
  isValid: boolean;
  conflictReason?: string;
}

export interface BookingFormData {
  serviceId: string;
  packageId: PackageId;
  recurrence: RecurrenceType;
  occurrences: OccurrenceSlot[];
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}
