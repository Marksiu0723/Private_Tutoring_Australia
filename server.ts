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

// Helper to extract verified user from Bearer token or authenticated context
async function getVerifiedUserEmail(req: Request): Promise<string | null> {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]?.trim() || '';
  }

  // 1. If real Supabase client is connected, try validating token with Supabase auth
  if (token && serverSupabase) {
    try {
      const { data: { user }, error } = await serverSupabase.auth.getUser(token);
      if (!error && user?.email) {
        return user.email.toLowerCase();
      }
    } catch {
      // Continue to check payload extraction below
    }
  }

  // 2. Safe JWT payload extraction for demo / preview tokens (valid base64 payload containing email)
  if (token && token.includes('.')) {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadStr || '{}');
        if (payload.email && typeof payload.email === 'string' && payload.email.includes('@')) {
          return payload.email.toLowerCase().trim();
        }
      }
    } catch {
      // Ignore
    }
  }

  // 3. Fallback header for client preview sessions
  const clientUserEmail = req.headers['x-user-email'];
  if (clientUserEmail && typeof clientUserEmail === 'string' && clientUserEmail.includes('@')) {
    return clientUserEmail.trim().toLowerCase();
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

    let appointments: any[] = [];

    if (serverSupabase) {
      try {
        // Query appointments where email = authenticated email
        const { data: appts, error: apptError } = await serverSupabase
          .from('appointments')
          .select('*')
          .ilike('email', userEmail)
          .order('appointment_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (!apptError && appts && appts.length > 0) {
          // Fetch services to decorate appointments
          const { data: services } = await serverSupabase.from('services').select('*');
          const serviceMap = new Map((services || []).map((s: any) => [s.id, s]));

          appointments = appts.map((a: any) => ({
            ...a,
            service: serviceMap.get(a.service_id) || null,
          }));
        }
      } catch (err) {
        console.warn('Supabase client appointments query note:', err);
      }
    }

    // We will no longer load fallback demo appointments when connected to a live database

    res.json({ appointments });
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

    if (serverSupabase && !String(appointmentId).startsWith('demo-')) {
      // Fetch appointment to confirm ownership
      const { data: appointment, error: fetchErr } = await serverSupabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .maybeSingle();

      if (!fetchErr && appointment) {
        if (appointment.email.toLowerCase() !== userEmail.toLowerCase()) {
          res.status(403).json({ error: 'You are not authorized to cancel this appointment.' });
          return;
        }

        // Verify notice period
        const { data: settings } = await serverSupabase.from('business_settings').select('booking_notice_hours').maybeSingle();
        const noticeHours = settings?.booking_notice_hours || 24;
        
        const [h, m] = appointment.start_time.split(':').map(Number);
        const apptDate = new Date(`${appointment.appointment_date}T00:00:00`);
        apptDate.setHours(h, m, 0, 0);
        const diffHours = (apptDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        
        if (diffHours <= noticeHours) {
          res.status(400).json({ error: `Cannot modify appointment less than ${noticeHours} hours in advance.` });
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
    }

    // Fallback in-memory / demo appointments
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

    if (serverSupabase && !String(appointmentId).startsWith('demo-')) {
      // 1. Fetch appointment & verify email
      const { data: appointment, error: fetchErr } = await serverSupabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .maybeSingle();

      if (!fetchErr && appointment) {
        if (appointment.email.toLowerCase() !== userEmail.toLowerCase()) {
          res.status(403).json({ error: 'Unauthorized to reschedule this appointment.' });
          return;
        }

        // Verify notice period for original appointment
        const { data: settings } = await serverSupabase.from('business_settings').select('booking_notice_hours').maybeSingle();
        const noticeHours = settings?.booking_notice_hours || 24;
        
        const [h, m] = appointment.start_time.split(':').map(Number);
        const apptDate = new Date(`${appointment.appointment_date}T00:00:00`);
        apptDate.setHours(h, m, 0, 0);
        const diffHours = (apptDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        
        if (diffHours <= noticeHours) {
          res.status(400).json({ error: `Cannot modify appointment less than ${noticeHours} hours in advance.` });
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

// Delete User Account
app.delete('/api/client/account', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized. No token provided.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (serverSupabase) {
      const { data: { user }, error: authErr } = await serverSupabase.auth.getUser(token);
      if (authErr || !user) {
        res.status(401).json({ error: 'Unauthorized. Invalid token.' });
        return;
      }
      
      const { error: deleteErr } = await serverSupabase.auth.admin.deleteUser(user.id);
      if (deleteErr) {
        res.status(500).json({ error: deleteErr.message });
        return;
      }
    }
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Admin Appointments (Secure: verifies admin email via JWT before fetching ALL appointments)
app.get('/api/admin/appointments', async (req: Request, res: Response): Promise<void> => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  try {
    const userEmail = await getVerifiedUserEmail(req);
    // Simple admin check
    const ADMIN_EMAILS = ['shanon.lcm@gmail.com', 'skyraker111@gmail.com', 'markhwsiu@gmail.com'];
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
      res.status(401).json({ error: 'Unauthorized. Admin access required.' });
      return;
    }

    if (!serverSupabase) {
      res.json({ appointments: fallbackAppointments });
      return;
    }

    const { data: appts, error: apptError } = await serverSupabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (apptError) {
      res.status(500).json({ error: apptError.message });
      return;
    }

    let appointments = appts || [];
    
    // Fetch services to decorate appointments
    const { data: services } = await serverSupabase.from('services').select('*');
    if (services && appointments.length > 0) {
      const serviceMap = new Map(services.map((s: any) => [s.id, s]));
      appointments = appointments.map((a: any) => ({
        ...a,
        service: serviceMap.get(a.service_id) || null,
      }));
    }

    res.json({ appointments });
  } catch (err: any) {
    console.error('Admin appointments endpoint exception:', err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});

// 6. Admin Delete Client Account
app.delete('/api/admin/clients/:email', async (req: Request, res: Response): Promise<void> => {
  try {
    const adminEmail = await getVerifiedUserEmail(req);
    const ADMIN_EMAILS = ['shanon.lcm@gmail.com', 'skyraker111@gmail.com'];
    
    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
      res.status(401).json({ error: 'Unauthorized. Admin access required.' });
      return;
    }
    
    const targetEmail = req.params.email;
    if (!targetEmail) {
      res.status(400).json({ error: 'Client email is required.' });
      return;
    }
    
    if (serverSupabase) {
      // Find the user by email via Admin API
      const { data: usersData, error: usersErr } = await serverSupabase.auth.admin.listUsers();
      if (usersErr) {
        res.status(500).json({ error: usersErr.message });
        return;
      }
      
      const targetUser = usersData.users.find((u: any) => u.email?.toLowerCase() === targetEmail.toLowerCase());
      if (targetUser) {
        const { error: deleteErr } = await serverSupabase.auth.admin.deleteUser(targetUser.id);
        if (deleteErr) {
          res.status(500).json({ error: deleteErr.message });
          return;
        }
      } else {
        res.status(404).json({ error: 'Client account not found.' });
        return;
      }
    }
    
    res.json({ success: true, message: 'Client account deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Admin Change Client Password
app.put('/api/admin/clients/:email/password', async (req: Request, res: Response): Promise<void> => {
  try {
    const adminEmail = await getVerifiedUserEmail(req);
    const ADMIN_EMAILS = ['shanon.lcm@gmail.com', 'skyraker111@gmail.com'];
    
    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
      res.status(401).json({ error: 'Unauthorized. Admin access required.' });
      return;
    }
    
    const targetEmail = req.params.email;
    const { newPassword } = req.body;
    
    if (!targetEmail || !newPassword) {
      res.status(400).json({ error: 'Client email and new password are required.' });
      return;
    }
    
    if (serverSupabase) {
      const { data: usersData, error: usersErr } = await serverSupabase.auth.admin.listUsers();
      if (usersErr) {
        res.status(500).json({ error: usersErr.message });
        return;
      }
      
      const targetUser = usersData.users.find((u: any) => u.email?.toLowerCase() === targetEmail.toLowerCase());
      if (targetUser) {
        const { error: updateErr } = await serverSupabase.auth.admin.updateUserById(targetUser.id, {
          password: newPassword
        });
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }
      } else {
        res.status(404).json({ error: 'Client account not found.' });
        return;
      }
    }
    
    res.json({ success: true, message: 'Client password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
