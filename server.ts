import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Supabase client for secure authenticated operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

function isSupabaseConfiguredServer(): boolean {
  return Boolean(
    supabaseUrl &&
    !supabaseUrl.includes('PASTE_YOUR') &&
    serviceRoleKey &&
    !serviceRoleKey.includes('PASTE_YOUR')
  );
}

const serverSupabase = isSupabaseConfiguredServer()
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

// In-memory appointments fallback store for seamless interactive preview if Supabase keys are not yet configured in env
let fallbackAppointments: any[] = [
  {
    id: 'demo-appt-1',
    full_name: 'Jessica Chen',
    email: 'jessica.chen@example.com',
    phone: '0412 345 678',
    service_id: 'srv-junior',
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    start_time: '16:00',
    end_time: '17:00',
    status: 'confirmed',
    notes: 'Focus on Year 9 Chemistry atomic structure & bonding fundamentals',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-appt-2',
    full_name: 'Jessica Chen',
    email: 'jessica.chen@example.com',
    phone: '0412 345 678',
    service_id: 'srv-hsc',
    appointment_date: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
    start_time: '17:30',
    end_time: '18:30',
    status: 'confirmed',
    notes: 'Year 11 Biology genetics practice exam breakdown',
    created_at: new Date().toISOString(),
  },
];

// Helper to extract verified user from Bearer token
async function getVerifiedUserEmail(req: Request): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  if (serverSupabase) {
    try {
      const { data: { user }, error } = await serverSupabase.auth.getUser(token);
      if (error || !user || !user.email) return null;
      return user.email.toLowerCase();
    } catch {
      return null;
    }
  }

  // Fallback testing support if token carries email in mock payload
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString() || '{}');
    if (payload.email) return payload.email.toLowerCase();
  } catch {
    // ignore
  }

  return null;
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    supabaseConnected: isSupabaseConfiguredServer(),
    timestamp: new Date().toISOString(),
  });
});

// 2. Client Appointments (Secure: derives authenticated user's email from JWT)
app.get('/api/client/appointments', async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail = await getVerifiedUserEmail(req);
    if (!userEmail) {
      res.status(401).json({ error: 'Unauthorized. Valid authentication required.' });
      return;
    }

    if (serverSupabase) {
      // Query appointments where email = authenticated email
      const { data: appts, error: apptError } = await serverSupabase
        .from('appointments')
        .select('*')
        .ilike('email', userEmail)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (apptError) {
        console.error('Error querying client appointments:', apptError);
        res.status(500).json({ error: apptError.message });
        return;
      }

      // Fetch services to decorate appointments
      const { data: services } = await serverSupabase.from('services').select('*');
      const serviceMap = new Map((services || []).map((s: any) => [s.id, s]));

      const enriched = (appts || []).map((a: any) => ({
        ...a,
        service: serviceMap.get(a.service_id) || null,
      }));

      res.json({ appointments: enriched });
      return;
    }

    // Fallback in-memory query matching verified email
    const matched = fallbackAppointments.filter(
      (a) => a.email.toLowerCase() === userEmail.toLowerCase()
    );
    res.json({ appointments: matched });
  } catch (err: any) {
    console.error('Appointments endpoint exception:', err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});

// 3. Client Cancellation (Secure: verifies appointment ownership server-side)
const handleCancelAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail = await getVerifiedUserEmail(req);
    if (!userEmail) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const appointmentId = (req.params as any)?.id || req.body?.appointmentId;
    if (!appointmentId) {
      res.status(400).json({ error: 'appointmentId is required.' });
      return;
    }

    if (serverSupabase) {
      // Fetch appointment to confirm ownership
      const { data: appointment, error: fetchErr } = await serverSupabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .maybeSingle();

      if (fetchErr || !appointment) {
        res.status(404).json({ error: 'Appointment not found.' });
        return;
      }

      if (appointment.email.toLowerCase() !== userEmail.toLowerCase()) {
        res.status(403).json({ error: 'You are not authorized to cancel this appointment.' });
        return;
      }

      // Update status to cancelled (do not delete)
      const { error: updateErr } = await serverSupabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (updateErr) {
        res.status(500).json({ error: updateErr.message });
        return;
      }

      res.json({ success: true, message: 'Appointment cancelled successfully.' });
      return;
    }

    // Fallback in-memory
    const target = fallbackAppointments.find((a) => a.id === appointmentId);
    if (!target) {
      res.status(404).json({ error: 'Appointment not found.' });
      return;
    }
    if (target.email.toLowerCase() !== userEmail.toLowerCase()) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    target.status = 'cancelled';
    res.json({ success: true, message: 'Appointment cancelled successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

app.post('/api/client/cancel', handleCancelAppointment);
app.post('/api/client/appointments/:id/cancel', handleCancelAppointment);

// 4. Client Rescheduling (Secure: verifies ownership and checks availability)
const handleRescheduleAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail = await getVerifiedUserEmail(req);
    if (!userEmail) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const appointmentId = (req.params as any)?.id || req.body?.appointmentId;
    const { newDate, newStartTime, newEndTime } = req.body;
    if (!appointmentId || !newDate || !newStartTime || !newEndTime) {
      res.status(400).json({ error: 'appointmentId, newDate, newStartTime, newEndTime are required.' });
      return;
    }

    if (serverSupabase) {
      // 1. Fetch appointment & verify email
      const { data: appointment, error: fetchErr } = await serverSupabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .maybeSingle();

      if (fetchErr || !appointment) {
        res.status(404).json({ error: 'Appointment not found.' });
        return;
      }

      if (appointment.email.toLowerCase() !== userEmail.toLowerCase()) {
        res.status(403).json({ error: 'Unauthorized to reschedule this appointment.' });
        return;
      }

      // 2. Check blocked dates
      const { data: blocked } = await serverSupabase
        .from('blocked_dates')
        .select('id')
        .eq('blocked_date', newDate)
        .maybeSingle();

      if (blocked) {
        res.status(400).json({ error: 'The selected date is blocked for tutoring.' });
        return;
      }

      // 3. Check overlaps with other non-cancelled appointments
      const { data: conflicting } = await serverSupabase
        .from('appointments')
        .select('id, start_time, end_time, status')
        .eq('appointment_date', newDate)
        .neq('status', 'cancelled')
        .neq('id', appointmentId);

      const hasConflict = (conflicting || []).some((other: any) => {
        return newStartTime < other.end_time && newEndTime > other.start_time;
      });

      if (hasConflict) {
        res.status(400).json({ error: 'The chosen time slot conflicts with an existing appointment.' });
        return;
      }

      // 4. Update appointment
      const { error: updateErr } = await serverSupabase
        .from('appointments')
        .update({
          appointment_date: newDate,
          start_time: newStartTime,
          end_time: newEndTime,
        })
        .eq('id', appointmentId);

      if (updateErr) {
        res.status(500).json({ error: updateErr.message });
        return;
      }

      res.json({ success: true, message: 'Appointment rescheduled successfully.' });
      return;
    }

    // Fallback in-memory
    const target = fallbackAppointments.find((a) => a.id === appointmentId);
    if (!target) {
      res.status(404).json({ error: 'Appointment not found.' });
      return;
    }
    if (target.email.toLowerCase() !== userEmail.toLowerCase()) {
      res.status(403).json({ error: 'Unauthorized.' });
      return;
    }
    target.appointment_date = newDate;
    target.start_time = newStartTime;
    target.end_time = newEndTime;
    res.json({ success: true, message: 'Appointment rescheduled successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

app.post('/api/client/reschedule', handleRescheduleAppointment);
app.post('/api/client/appointments/:id/reschedule', handleRescheduleAppointment);

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shanon Lee Tutoring server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
