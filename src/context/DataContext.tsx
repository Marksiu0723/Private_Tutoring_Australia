import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Service,
  Appointment,
  BusinessHour,
  BlockedDate,
  BusinessSettings,
  AppointmentStatus,
} from '../types';

// Default initial data matching exact instructions
const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-junior-1',
    name: 'Junior Year (Year 7 - 10)',
    description: 'Personalised science foundation lessons that cover all strands to build a strong base for senior study.',
    duration_minutes: 60,
    price: null, // Price subject to change
    is_active: true,
  },
  {
    id: 'srv-hsc-2',
    name: 'HSC (Year 11 - 12)',
    description: 'Chemistry / Biology.',
    duration_minutes: 60,
    price: null, // Price subject to change
    is_active: true,
  },
];

const DEFAULT_BUSINESS_HOURS: BusinessHour[] = [
  { id: 'bh-0', weekday: 0, is_open: true, start_time: '09:00', end_time: '21:00' }, // Sunday
  { id: 'bh-1', weekday: 1, is_open: true, start_time: '09:00', end_time: '21:00' }, // Monday
  { id: 'bh-2', weekday: 2, is_open: true, start_time: '09:00', end_time: '21:00' }, // Tuesday
  { id: 'bh-3', weekday: 3, is_open: true, start_time: '09:00', end_time: '21:00' }, // Wednesday
  { id: 'bh-4', weekday: 4, is_open: true, start_time: '09:00', end_time: '21:00' }, // Thursday
  { id: 'bh-5', weekday: 5, is_open: true, start_time: '09:00', end_time: '21:00' }, // Friday
  { id: 'bh-6', weekday: 6, is_open: true, start_time: '09:00', end_time: '21:00' }, // Saturday
];

const DEFAULT_SETTINGS: BusinessSettings = {
  id: 'bs-default',
  business_name: 'Shanon Lee Tutoring',
  business_email: 'shanon.lcm@gmail.com',
  business_phone: null,
  business_address: null,
  slot_interval_minutes: 30,
  booking_notice_hours: 12,
};

const INITIAL_DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'demo-appt-1',
    full_name: 'Jessica Chen',
    email: 'jessica.chen@example.com',
    phone: '0412 345 678',
    service_id: 'srv-junior-1',
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    start_time: '16:00',
    end_time: '17:00',
    status: 'confirmed',
    notes: 'Year 9 Chemistry: Atomic structure, electron configuration & covalent bonding foundations.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    service: DEFAULT_SERVICES[0],
  },
  {
    id: 'demo-appt-2',
    full_name: 'Michael Wang',
    email: 'michael.w@example.com',
    phone: '0423 888 999',
    service_id: 'srv-hsc-2',
    appointment_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    start_time: '17:30',
    end_time: '18:30',
    status: 'pending',
    notes: 'Year 11 Biology: Module 3 Depth Study review & enzyme activity kinetics.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    service: DEFAULT_SERVICES[1],
  },
  {
    id: 'demo-appt-3',
    full_name: 'Sophia Liu',
    email: 'sophia.liu@example.com',
    phone: '0434 555 123',
    service_id: 'srv-hsc-2',
    appointment_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '11:00',
    status: 'confirmed',
    notes: 'HSC Chemistry: Equilibrium & acid/base titration calculations technique.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    service: DEFAULT_SERVICES[1],
  },
  {
    id: 'demo-appt-4',
    full_name: 'Lucas Zhang',
    email: 'lucas.z@example.com',
    phone: '0450 111 222',
    service_id: 'srv-junior-1',
    appointment_date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    start_time: '15:00',
    end_time: '16:00',
    status: 'completed',
    notes: 'Year 8 Living World: Ecosystems & energy flow through trophic levels.',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    service: DEFAULT_SERVICES[0],
  },
];

interface DataContextType {
  services: Service[];
  activeServices: Service[];
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  businessSettings: BusinessSettings;
  adminAppointments: Appointment[];
  loading: boolean;
  adminAppointmentsLoading: boolean;
  refreshData: () => Promise<void>;
  // Public booking insert (MUST NOT use .select() or manual id/created_at)
  createAppointmentsPublic: (
    items: Omit<Appointment, 'id' | 'created_at' | 'status'>[]
  ) => Promise<{ success: boolean; error?: string }>;
  // Admin methods
  addService: (data: Omit<Service, 'id' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
  updateService: (id: string, data: Partial<Service>) => Promise<{ success: boolean; error?: string }>;
  deleteService: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateBusinessHour: (idOrWeekday: string | number, data: Partial<BusinessHour>) => Promise<{ success: boolean; error?: string }>;
  saveAllBusinessHours: (hours: BusinessHour[]) => Promise<{ success: boolean; error?: string }>;
  addBlockedDate: (blocked_date: string, reason: string | null) => Promise<{ success: boolean; error?: string }>;
  removeBlockedDate: (id: string, blocked_date?: string) => Promise<{ success: boolean; error?: string }>;
  updateBusinessSettings: (data: Partial<BusinessSettings>) => Promise<{ success: boolean; error?: string }>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<{ success: boolean; error?: string }>;
  addAdminAppointment: (data: Omit<Appointment, 'id' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
  fetchAdminAppointments: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(DEFAULT_BUSINESS_HOURS);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [adminAppointments, setAdminAppointments] = useState<Appointment[]>(INITIAL_DEMO_APPOINTMENTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminAppointmentsLoading, setAdminAppointmentsLoading] = useState<boolean>(false);
  const [settingsTableName, setSettingsTableName] = useState<string>('business_settings');
  const [settingsSchemaFields, setSettingsSchemaFields] = useState<Set<string>>(new Set());

  const loadPublicData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch services
      const { data: srvData, error: srvError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (!srvError && srvData && srvData.length > 0) {
        setServices(srvData);
      }

      // 2. Fetch business hours
      const { data: bhData, error: bhError } = await supabase
        .from('business_hours')
        .select('*')
        .order('weekday', { ascending: true });

      if (!bhError && bhData && bhData.length > 0) {
        setBusinessHours(bhData);
      }

      // 3. Fetch blocked dates
      const { data: bdData, error: bdError } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('blocked_date', { ascending: true });

      if (!bdError && bdData) {
        setBlockedDates(bdData);
      }

      // 4. Fetch settings - dynamically check 'settings' or 'business_settings'
      let loadedSettings: any = null;
      let matchedTable = 'business_settings';

      // First try 'settings'
      const { data: sData, error: sError } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!sError && sData) {
        loadedSettings = sData;
        matchedTable = 'settings';
      } else {
        // Next try 'business_settings'
        const { data: bsData, error: bsError } = await supabase
          .from('business_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!bsError && bsData) {
          loadedSettings = bsData;
          matchedTable = 'business_settings';
        }
      }

      if (loadedSettings) {
        setSettingsTableName(matchedTable);
        const keys = new Set(Object.keys(loadedSettings));
        setSettingsSchemaFields(keys);

        const nameVal = loadedSettings.name ?? loadedSettings.business_name ?? 'Shanon Lee Tutoring';
        const emailVal = loadedSettings.email ?? loadedSettings.business_email ?? 'shanon.lcm@gmail.com';
        const phoneVal = loadedSettings.phone ?? loadedSettings.business_phone ?? null;
        const addrVal = loadedSettings.address ?? loadedSettings.business_address ?? null;
        const intervalVal = Number(loadedSettings.slot_interval_minutes) || 30;
        const noticeVal = Number(loadedSettings.booking_notice_hours) || 12;

        setBusinessSettings({
          id: loadedSettings.id,
          name: nameVal,
          business_name: nameVal,
          email: emailVal,
          business_email: emailVal,
          phone: phoneVal,
          business_phone: phoneVal,
          address: addrVal,
          business_address: addrVal,
          slot_interval_minutes: intervalVal,
          booking_notice_hours: noticeVal,
          created_at: loadedSettings.created_at,
        });
      }
    } catch (err) {
      console.warn('Data loading note:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminAppointments = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setAdminAppointmentsLoading(true);
    try {
      // First try joined query
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching admin appointments:', error.message);
      } else if (data) {
        // Decorate with service relation
        const enriched = data.map((a: Appointment) => ({
          ...a,
          service: services.find((s) => s.id === a.service_id),
        }));
        setAdminAppointments(enriched);
      }
    } catch (err) {
      console.error('Error in fetchAdminAppointments:', err);
    } finally {
      setAdminAppointmentsLoading(false);
    }
  }, [services]);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  // PUBLIC APPOINTMENT CREATION
  // Important Rule:
  // - use insert only
  // - do NOT use insert().select()
  // - do NOT use insert().select().single()
  // - do NOT request new appointment back after public insertion
  // - do NOT insert id manually
  // - do NOT insert created_at manually
  const createAppointmentsPublic = async (
    items: Omit<Appointment, 'id' | 'created_at' | 'status'>[]
  ): Promise<{ success: boolean; error?: string }> => {
    const payload = items.map((item) => ({
      full_name: item.full_name.trim(),
      email: item.email.trim().toLowerCase(),
      phone: item.phone.trim(),
      service_id: item.service_id,
      appointment_date: item.appointment_date,
      start_time: item.start_time,
      end_time: item.end_time,
      status: 'pending',
      notes: item.notes ? item.notes.trim() : null,
    }));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('appointments').insert(payload);
        if (error) {
          console.error('Appointment insert error:', error);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Submission failed' };
      }
    }

    // Local in-memory update if Supabase credentials are placeholder
    const simulated: Appointment[] = payload.map((p, idx) => ({
      id: `local-appt-${Date.now()}-${idx}`,
      ...p,
      status: 'pending' as AppointmentStatus,
      created_at: new Date().toISOString(),
      service: services.find((s) => s.id === p.service_id),
    }));

    setAdminAppointments((prev) => [...prev, ...simulated]);
    return { success: true };
  };

  // ADMIN OPERATIONS
  const addService = async (
    data: Omit<Service, 'id' | 'created_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    const newServicePayload = {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      duration_minutes: Number(data.duration_minutes) || 60,
      price:
        data.price === null || data.price === undefined || isNaN(Number(data.price))
          ? null
          : Number(data.price),
      is_active: data.is_active ?? true,
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').insert([newServicePayload]);
        if (error) {
          console.error('Error adding service in Supabase:', error);
          return { success: false, error: error.message };
        }
        await loadPublicData();
        return { success: true };
      } catch (err: any) {
        console.error('Exception adding service:', err);
        return { success: false, error: err.message || 'Failed to add service' };
      }
    }

    const localService: Service = {
      id: `srv-${Date.now()}`,
      ...newServicePayload,
      created_at: new Date().toISOString(),
    };
    setServices((prev) => [...prev, localService]);
    return { success: true };
  };

  const updateService = async (
    id: string,
    data: Partial<Service>
  ): Promise<{ success: boolean; error?: string }> => {
    const updatePayload: any = {};
    if (data.name !== undefined) updatePayload.name = data.name.trim();
    if (data.description !== undefined)
      updatePayload.description = data.description ? data.description.trim() : null;
    if (data.duration_minutes !== undefined)
      updatePayload.duration_minutes = Number(data.duration_minutes);
    if ('price' in data) {
      updatePayload.price =
        data.price === null || data.price === undefined || isNaN(Number(data.price))
          ? null
          : Number(data.price);
    }
    if (data.is_active !== undefined) updatePayload.is_active = data.is_active;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').update(updatePayload).eq('id', id);
        if (error) {
          console.error('Error updating service in Supabase:', error);
          return { success: false, error: error.message };
        }
        await loadPublicData();
        return { success: true };
      } catch (err: any) {
        console.error('Exception updating service:', err);
        return { success: false, error: err.message || 'Failed to update service' };
      }
    }

    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatePayload } : s))
    );
    return { success: true };
  };

  const deleteService = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) {
          console.error('Error deleting service in Supabase:', error);
          return { success: false, error: error.message };
        }
        await loadPublicData();
        return { success: true };
      } catch (err: any) {
        console.error('Exception deleting service:', err);
        return { success: false, error: err.message || 'Failed to delete service' };
      }
    }

    setServices((prev) => prev.filter((s) => s.id !== id));
    return { success: true };
  };

  const updateBusinessHour = async (
    idOrWeekday: string | number,
    data: Partial<BusinessHour>
  ): Promise<{ success: boolean; error?: string }> => {
    const payload: any = {};
    if (data.is_open !== undefined) payload.is_open = Boolean(data.is_open);
    if (data.start_time !== undefined) payload.start_time = data.start_time;
    if (data.end_time !== undefined) payload.end_time = data.end_time;

    if (isSupabaseConfigured) {
      try {
        // Try matching by id if uuid/pk string, otherwise by weekday
        let query;
        if (typeof idOrWeekday === 'string' && !idOrWeekday.startsWith('bh-') && isNaN(Number(idOrWeekday))) {
          query = supabase.from('business_hours').update(payload).eq('id', idOrWeekday);
        } else {
          const weekdayNum = typeof idOrWeekday === 'number' ? idOrWeekday : parseInt(idOrWeekday, 10);
          query = supabase.from('business_hours').update(payload).eq('weekday', isNaN(weekdayNum) ? idOrWeekday : weekdayNum);
        }

        const { error } = await query;
        if (error) {
          console.error('Error updating business hours in Supabase:', error);
          return { success: false, error: error.message };
        }
        await loadPublicData();
        return { success: true };
      } catch (err: any) {
        console.error('Exception updating business hours:', err);
        return { success: false, error: err.message || 'Failed to update business hours' };
      }
    }

    setBusinessHours((prev) =>
      prev.map((h) => {
        if (h.id === idOrWeekday || h.weekday === idOrWeekday || String(h.weekday) === String(idOrWeekday)) {
          return { ...h, ...payload };
        }
        return h;
      })
    );
    return { success: true };
  };

  const saveAllBusinessHours = async (
    hours: BusinessHour[]
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        // Update each weekday row
        for (const h of hours) {
          const payload = {
            is_open: h.is_open,
            start_time: h.start_time,
            end_time: h.end_time,
          };
          const weekdayNum = typeof h.weekday === 'number' ? h.weekday : parseInt(String(h.weekday), 10);
          const { error } = await supabase
            .from('business_hours')
            .update(payload)
            .eq('weekday', isNaN(weekdayNum) ? h.weekday : weekdayNum);

          if (error) {
            console.error(`Error saving weekday ${h.weekday}:`, error);
            return { success: false, error: error.message };
          }
        }
        await loadPublicData();
        return { success: true };
      } catch (err: any) {
        console.error('Exception saving all business hours:', err);
        return { success: false, error: err.message || 'Failed to save business hours' };
      }
    }

    setBusinessHours(hours);
    return { success: true };
  };

  const addBlockedDate = async (
    blocked_date: string,
    reason: string | null
  ): Promise<{ success: boolean; error?: string }> => {
    const payload = {
      blocked_date,
      reason: reason ? reason.trim() : null,
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('blocked_dates').insert([payload]);
        if (error) {
          console.error('Error adding blocked date in Supabase:', error);
          return { success: false, error: error.message };
        }
        await loadPublicData();
        return { success: true };
      } catch (err: any) {
        console.error('Exception adding blocked date:', err);
        return { success: false, error: err.message || 'Failed to add blocked date' };
      }
    }

    const localBd: BlockedDate = {
      id: `bd-${Date.now()}`,
      blocked_date,
      reason: reason ? reason.trim() : null,
      created_at: new Date().toISOString(),
    };
    setBlockedDates((prev) => [...prev, localBd]);
    return { success: true };
  };

  const removeBlockedDate = async (
    id: string,
    blocked_date?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('blocked_dates').delete();
        // If id is a real UUID (not local simulated id)
        if (id && !id.startsWith('bd-')) {
          query = query.eq('id', id);
        } else if (blocked_date) {
          query = query.eq('blocked_date', blocked_date);
        } else {
          query = query.eq('id', id);
        }

        const { error } = await query;
        if (error) {
          console.error('Error removing blocked date in Supabase:', error);
          return { success: false, error: error.message };
        }
        await loadPublicData();
        return { success: true };
      } catch (err: any) {
        console.error('Exception removing blocked date:', err);
        return { success: false, error: err.message || 'Failed to remove blocked date' };
      }
    }

    setBlockedDates((prev) =>
      prev.filter((b) => b.id !== id && b.blocked_date !== blocked_date)
    );
    return { success: true };
  };

  const updateBusinessSettings = async (
    data: Partial<BusinessSettings>
  ): Promise<{ success: boolean; error?: string }> => {
    const targetTable = settingsTableName || 'business_settings';
    const fields = settingsSchemaFields;

    const payload: any = {};

    // Map fields matching exact schema keys
    if (data.slot_interval_minutes !== undefined) {
      payload.slot_interval_minutes = Number(data.slot_interval_minutes);
    }
    if (data.booking_notice_hours !== undefined) {
      payload.booking_notice_hours = Number(data.booking_notice_hours);
    }

    const nameValue = (data.name ?? data.business_name ?? '').trim();
    if (nameValue) {
      if (fields.has('name')) payload.name = nameValue;
      if (fields.has('business_name')) payload.business_name = nameValue;
      if (!fields.has('name') && !fields.has('business_name')) {
        // Fallback default
        if (targetTable === 'settings') payload.name = nameValue;
        else payload.business_name = nameValue;
      }
    }

    const emailValue = (data.email ?? data.business_email ?? '').trim();
    if (emailValue) {
      if (fields.has('email')) payload.email = emailValue;
      if (fields.has('business_email')) payload.business_email = emailValue;
      if (!fields.has('email') && !fields.has('business_email')) {
        if (targetTable === 'settings') payload.email = emailValue;
        else payload.business_email = emailValue;
      }
    }

    const phoneValue = (data.phone ?? data.business_phone ?? '').trim() || null;
    if (fields.has('phone')) payload.phone = phoneValue;
    if (fields.has('business_phone')) payload.business_phone = phoneValue;
    if (!fields.has('phone') && !fields.has('business_phone')) {
      if (targetTable === 'settings') payload.phone = phoneValue;
      else payload.business_phone = phoneValue;
    }

    const addressValue = (data.address ?? data.business_address ?? '').trim() || null;
    if (fields.has('address')) payload.address = addressValue;
    if (fields.has('business_address')) payload.business_address = addressValue;
    if (!fields.has('address') && !fields.has('business_address')) {
      if (targetTable === 'settings') payload.address = addressValue;
      else payload.business_address = addressValue;
    }

    if (isSupabaseConfigured) {
      try {
        let query;
        if (businessSettings.id && !businessSettings.id.startsWith('bs-')) {
          query = supabase.from(targetTable).update(payload).eq('id', businessSettings.id);
        } else {
          // If no specific single ID, update the row in settings table
          query = supabase.from(targetTable).update(payload).neq('slot_interval_minutes', -999);
        }

        const { error } = await query;
        if (error) {
          console.error('Error updating settings in Supabase:', error);
          return { success: false, error: error.message };
        }
        await loadPublicData();
        return { success: true };
      } catch (err: any) {
        console.error('Exception updating business settings:', err);
        return { success: false, error: err.message || 'Failed to update settings' };
      }
    }

    setBusinessSettings((prev) => ({
      ...prev,
      ...data,
      name: nameValue || prev.name,
      business_name: nameValue || prev.business_name,
      email: emailValue || prev.email,
      business_email: emailValue || prev.business_email,
      phone: phoneValue,
      business_phone: phoneValue,
      address: addressValue,
      business_address: addressValue,
    }));
    return { success: true };
  };

  const updateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status })
          .eq('id', id);
        if (error) {
          console.error('Error updating appointment status:', error);
          return { success: false, error: error.message };
        }
        await fetchAdminAppointments();
        return { success: true };
      } catch (err: any) {
        console.error('Exception updating appointment status:', err);
        return { success: false, error: err.message || 'Failed to update appointment status' };
      }
    }

    setAdminAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    return { success: true };
  };

  const addAdminAppointment = async (
    data: Omit<Appointment, 'id' | 'created_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    const payload = {
      full_name: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      service_id: data.service_id,
      appointment_date: data.appointment_date,
      start_time: data.start_time,
      end_time: data.end_time,
      notes: data.notes ? data.notes.trim() : null,
      status: data.status || 'confirmed',
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('appointments').insert([payload]);
        if (error) {
          console.error('Error inserting admin appointment:', error);
          return { success: false, error: error.message };
        }
        await fetchAdminAppointments();
        return { success: true };
      } catch (err: any) {
        console.error('Exception inserting admin appointment:', err);
        return { success: false, error: err.message || 'Failed to schedule appointment' };
      }
    }

    const newId = `admin-appt-${Date.now()}`;
    const newAppt: Appointment = {
      ...payload,
      id: newId,
      created_at: new Date().toISOString(),
      service: services.find((s) => s.id === data.service_id),
    };
    setAdminAppointments((prev) => [newAppt, ...prev]);
    return { success: true };
  };

  const activeServices = services.filter((s) => s.is_active);

  return (
    <DataContext.Provider
      value={{
        services,
        activeServices,
        businessHours,
        blockedDates,
        businessSettings,
        adminAppointments,
        loading,
        adminAppointmentsLoading,
        refreshData: loadPublicData,
        createAppointmentsPublic,
        addService,
        updateService,
        deleteService,
        updateBusinessHour,
        saveAllBusinessHours,
        addBlockedDate,
        removeBlockedDate,
        updateBusinessSettings,
        updateAppointmentStatus,
        addAdminAppointment,
        fetchAdminAppointments,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
