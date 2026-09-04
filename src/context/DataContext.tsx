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
  refreshData: () => Promise<void>;
  // Public booking insert (MUST NOT use .select() or manual id/created_at)
  createAppointmentsPublic: (
    items: Omit<Appointment, 'id' | 'created_at' | 'status'>[]
  ) => Promise<{ success: boolean; error?: string }>;
  // Admin methods
  addService: (data: Omit<Service, 'id' | 'created_at'>) => Promise<boolean>;
  updateService: (id: string, data: Partial<Service>) => Promise<boolean>;
  updateBusinessHour: (idOrWeekday: string | number, data: Partial<BusinessHour>) => Promise<boolean>;
  addBlockedDate: (blocked_date: string, reason: string | null) => Promise<boolean>;
  removeBlockedDate: (id: string) => Promise<boolean>;
  updateBusinessSettings: (data: Partial<BusinessSettings>) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<boolean>;
  addAdminAppointment: (data: Omit<Appointment, 'id' | 'created_at'>) => Promise<boolean>;
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
        .select('*');

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

      // 4. Fetch business settings
      const { data: bsData, error: bsError } = await supabase
        .from('business_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!bsError && bsData) {
        setBusinessSettings(bsData);
      }
    } catch (err) {
      console.warn('Data loading note:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminAppointments = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (!error && data) {
        // Decorate with service
        const enriched = data.map((a: Appointment) => ({
          ...a,
          service: services.find((s) => s.id === a.service_id),
        }));
        setAdminAppointments(enriched);
      }
    } catch (err) {
      console.error('Error fetching admin appointments:', err);
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
  const addService = async (data: Omit<Service, 'id' | 'created_at'>): Promise<boolean> => {
    const newServicePayload = {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      duration_minutes: Number(data.duration_minutes) || 60,
      price: data.price === null || data.price === undefined || isNaN(Number(data.price)) ? null : Number(data.price),
      is_active: data.is_active ?? true,
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').insert([newServicePayload]);
        if (error) throw error;
        await loadPublicData();
        return true;
      } catch (err) {
        console.error('Error adding service:', err);
        return false;
      }
    }

    const localService: Service = {
      id: `srv-${Date.now()}`,
      ...newServicePayload,
      created_at: new Date().toISOString(),
    };
    setServices((prev) => [...prev, localService]);
    return true;
  };

  const updateService = async (id: string, data: Partial<Service>): Promise<boolean> => {
    const updatePayload: any = {};
    if (data.name !== undefined) updatePayload.name = data.name.trim();
    if (data.description !== undefined) updatePayload.description = data.description ? data.description.trim() : null;
    if (data.duration_minutes !== undefined) updatePayload.duration_minutes = Number(data.duration_minutes);
    if ('price' in data) {
      updatePayload.price = data.price === null || data.price === undefined || isNaN(Number(data.price)) ? null : Number(data.price);
    }
    if (data.is_active !== undefined) updatePayload.is_active = data.is_active;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').update(updatePayload).eq('id', id);
        if (error) throw error;
        await loadPublicData();
        return true;
      } catch (err) {
        console.error('Error updating service:', err);
        return false;
      }
    }

    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatePayload } : s))
    );
    return true;
  };

  const updateBusinessHour = async (
    idOrWeekday: string | number,
    data: Partial<BusinessHour>
  ): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        // match either by id or weekday
        const query = typeof idOrWeekday === 'string' && idOrWeekday.startsWith('bh-')
          ? supabase.from('business_hours').update(data).eq('id', idOrWeekday)
          : supabase.from('business_hours').update(data).eq('weekday', idOrWeekday);

        const { error } = await query;
        if (error) throw error;
        await loadPublicData();
        return true;
      } catch (err) {
        console.error('Error updating business hours:', err);
        return false;
      }
    }

    setBusinessHours((prev) =>
      prev.map((h) => {
        if (h.id === idOrWeekday || h.weekday === idOrWeekday) {
          return { ...h, ...data };
        }
        return h;
      })
    );
    return true;
  };

  const addBlockedDate = async (blocked_date: string, reason: string | null): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('blocked_dates').insert([
          { blocked_date, reason: reason ? reason.trim() : null },
        ]);
        if (error) throw error;
        await loadPublicData();
        return true;
      } catch (err) {
        console.error('Error adding blocked date:', err);
        return false;
      }
    }

    const localBd: BlockedDate = {
      id: `bd-${Date.now()}`,
      blocked_date,
      reason: reason ? reason.trim() : null,
      created_at: new Date().toISOString(),
    };
    setBlockedDates((prev) => [...prev, localBd]);
    return true;
  };

  const removeBlockedDate = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
        if (error) throw error;
        await loadPublicData();
        return true;
      } catch (err) {
        console.error('Error removing blocked date:', err);
        return false;
      }
    }

    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    return true;
  };

  const updateBusinessSettings = async (data: Partial<BusinessSettings>): Promise<boolean> => {
    const payload: any = { ...data };
    // Maintain NULL rules
    if ('business_phone' in data && !data.business_phone) payload.business_phone = null;
    if ('business_address' in data && !data.business_address) payload.business_address = null;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('business_settings')
          .update(payload)
          .eq('id', businessSettings.id);

        if (error) throw error;
        await loadPublicData();
        return true;
      } catch (err) {
        console.error('Error updating business settings:', err);
        return false;
      }
    }

    setBusinessSettings((prev) => ({ ...prev, ...payload }));
    return true;
  };

  const updateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus
  ): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status })
          .eq('id', id);
        if (error) throw error;
        await fetchAdminAppointments();
        return true;
      } catch (err) {
        console.error('Error updating appointment status:', err);
        return false;
      }
    }

    setAdminAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    return true;
  };

  const addAdminAppointment = async (
    data: Omit<Appointment, 'id' | 'created_at'>
  ): Promise<boolean> => {
    const newId = `admin-appt-${Date.now()}`;
    const newAppt: Appointment = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      service: services.find((s) => s.id === data.service_id),
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('appointments').insert({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          service_id: data.service_id,
          appointment_date: data.appointment_date,
          start_time: data.start_time,
          end_time: data.end_time,
          notes: data.notes || null,
          status: data.status || 'confirmed',
        });
        if (error) throw error;
        await fetchAdminAppointments();
        return true;
      } catch (err) {
        console.error('Error inserting admin appointment:', err);
      }
    }

    setAdminAppointments((prev) => [newAppt, ...prev]);
    return true;
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
        refreshData: loadPublicData,
        createAppointmentsPublic,
        addService,
        updateService,
        updateBusinessHour,
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
