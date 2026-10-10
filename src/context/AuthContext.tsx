import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface SignUpOptions {
  firstName: string;
  lastName: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  adminCheckLoading: boolean;
  adminError: string | null;
  signIn: (email: string, password: string, context?: 'admin' | 'client') => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    extra?: SignUpOptions
  ) => Promise<{ success: boolean; error?: string; confirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  checkAdminStatus: (userId: string, email?: string) => Promise<boolean>;
  loginAsDemoAdmin: () => void;
  loginAsDemoClient: (email?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_EMAILS = ['shanon.lcm@gmail.com'];

// Helper to construct a valid Session token for preview / offline sessions
function createMockSession(mockUser: any): Session {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: mockUser.id,
      email: mockUser.email,
      role: mockUser.app_metadata?.role || 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 86400 * 30,
    })
  );
  const token = `${header}.${payload}.mock-signature`;

  return {
    access_token: token,
    token_type: 'bearer',
    expires_in: 86400 * 30,
    refresh_token: 'mock-refresh-token',
    user: mockUser,
    expires_at: Math.floor(Date.now() / 1000) + 86400 * 30,
  } as unknown as Session;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminCheckLoading, setAdminCheckLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminWhitelist, setAdminWhitelist] = useState<string[]>(DEFAULT_ADMIN_EMAILS);

  // Dynamically synchronize the admin whitelist with public.admin_users
  const syncAdminWhitelist = useCallback(async (): Promise<string[]> => {
    try {
      const res = await fetch('/api/admin/whitelist', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.emails) && data.emails.length > 0) {
          setAdminWhitelist(data.emails);
          return data.emails;
        }
      }
    } catch (e) {
      console.warn('Could not sync admin whitelist from server:', e);
    }

    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('admin_users').select('email');
        if (data && data.length > 0) {
          const emails = Array.from(
            new Set([
              ...DEFAULT_ADMIN_EMAILS,
              ...data.map((r: any) => r.email?.trim().toLowerCase()).filter(Boolean),
            ])
          );
          setAdminWhitelist(emails);
          return emails;
        }
      } catch (err) {
        console.warn('Could not query admin_users table directly:', err);
      }
    }

    return DEFAULT_ADMIN_EMAILS;
  }, []);

  // Check if current user.id exists in admin_users table (exact requirement: admin_users.user_id = auth.uid())
  const checkAdminStatus = useCallback(async (userId: string, email?: string): Promise<boolean> => {
    const lowerEmail = email?.trim().toLowerCase();

    // 1. Sync live whitelist from public.admin_users
    const currentWhitelist = await syncAdminWhitelist();

    // 2. Check against live whitelist
    if (lowerEmail && currentWhitelist.includes(lowerEmail)) {
      setIsAdmin(true);
      setAdminError(null);
      return true;
    }

    if (!userId || !isSupabaseConfigured) {
      setIsAdmin(false);
      return false;
    }

    setAdminCheckLoading(true);
    setAdminError(null);

    try {
      // 3. Query public.admin_users by user_id OR email
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, user_id, email')
        .or(`user_id.eq.${userId}${lowerEmail ? `,email.eq.${lowerEmail}` : ''}`)
        .maybeSingle();

      if (error) {
        console.warn('Admin status query note:', error.message);
        if (lowerEmail && currentWhitelist.includes(lowerEmail)) {
          setIsAdmin(true);
          return true;
        }
        setIsAdmin(false);
        setAdminError(error.message);
        return false;
      }

      const authorized = Boolean(data);
      setIsAdmin(authorized);
      if (!authorized) {
        setAdminError('You are signed in, but you are not authorized as an admin.');
      } else {
        setAdminError(null);
        if (lowerEmail && !currentWhitelist.includes(lowerEmail)) {
          setAdminWhitelist(prev => [...prev, lowerEmail]);
        }
      }
      return authorized;
    } catch (err: any) {
      console.warn('Admin status check exception:', err);
      const authorized = Boolean(lowerEmail && currentWhitelist.includes(lowerEmail));
      setIsAdmin(authorized);
      return authorized;
    } finally {
      setAdminCheckLoading(false);
    }
  }, [syncAdminWhitelist]);

  const loginAsDemoAdmin = useCallback(() => {
    const mockAdminUser: any = {
      id: 'admin-shanon-lee',
      email: 'shanon.lcm@gmail.com',
      user_metadata: { full_name: 'Shanon Lee (Administrator)' },
      app_metadata: { role: 'admin' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    setUser(mockAdminUser);
    setSession(createMockSession(mockAdminUser));
    setIsAdmin(true);
    setAdminError(null);
    localStorage.setItem('shanon_demo_admin', 'true');
  }, []);

  const loginAsDemoClient = useCallback((clientEmail: string = 'jessica.chen@example.com') => {
    const mockClientUser: any = {
      id: 'demo-student-jessica',
      email: clientEmail.toLowerCase().trim(),
      user_metadata: { full_name: 'Jessica Chen' },
      app_metadata: { role: 'authenticated' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    setUser(mockClientUser);
    setSession(createMockSession(mockClientUser));
    setIsAdmin(false);
    setAdminError(null);
    localStorage.removeItem('shanon_demo_admin');
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        await syncAdminWhitelist();
        const wasDemoAdmin = localStorage.getItem('shanon_demo_admin') === 'true';

        if (!isSupabaseConfigured) {
          if (wasDemoAdmin) {
            loginAsDemoAdmin();
          }
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }

        if (currentSession?.user) {
          await checkAdminStatus(currentSession.user.id, currentSession.user.email);
        } else {
          setIsAdmin(false);
          setAdminError(null);
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    if (!isSupabaseConfigured) {
      return () => { mounted = false; };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await checkAdminStatus(newSession.user.id, newSession.user.email);
      } else {
        setIsAdmin(false);
        setAdminError(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus, loginAsDemoAdmin, syncAdminWhitelist]);

  const signIn = async (email: string, password: string, context?: 'admin' | 'client') => {
    setAdminError(null);
    const trimmedEmail = email.trim().toLowerCase();

    // Dynamically retrieve the latest admin whitelist from public.admin_users
    const currentWhitelist = await syncAdminWhitelist();
    const isOwnerEmail = currentWhitelist.includes(trimmedEmail);

    if (context === 'client' && isOwnerEmail) {
      return { success: false, error: 'Admin emails cannot be used to log into the client portal.' };
    }

    // If Supabase credentials are not yet configured or placeholder, offer smooth preview sign-in
    if (!isSupabaseConfigured) {
      if (context === 'admin' && !isOwnerEmail) {
        return { success: false, error: 'Only authorized administrator emails can access the admin dashboard.' };
      }
      const mockUser: any = {
        id: isOwnerEmail ? 'admin-shanon-lee' : `user-${Date.now()}`,
        email: trimmedEmail,
        user_metadata: { full_name: isOwnerEmail ? 'Shanon Lee (Admin)' : trimmedEmail.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      setSession(createMockSession(mockUser));
      setIsAdmin(isOwnerEmail);
      if (isOwnerEmail) {
        localStorage.setItem('shanon_demo_admin', 'true');
      }
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message || 'Invalid email or password. Please check your Supabase credentials.' };
      }

      if (data.session) {
        setSession(data.session);
      }
      if (data.user) {
        const authorizedAdmin = await checkAdminStatus(data.user.id, data.user.email);
        if (context === 'admin' && !authorizedAdmin) {
          await signOut();
          return {
            success: false,
            error: 'You are signed in, but your account is not authorized as an administrator in public.admin_users.'
          };
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign in' };
    }
  };

  const signUp = async (email: string, password: string, extra?: SignUpOptions) => {
    const trimmedEmail = email.trim().toLowerCase();
    const fullName = extra ? `${extra.firstName.trim()} ${extra.lastName.trim()}`.trim() : trimmedEmail.split('@')[0];
    
    // Save student profile locally for instant persistence & profile view
    if (extra) {
      try {
        const studentProfile = {
          firstName: extra.firstName.trim(),
          lastName: extra.lastName.trim(),
          email: trimmedEmail,
          phone: extra.phone.trim(),
        };
        localStorage.setItem(`student_profile_${trimmedEmail}`, JSON.stringify(studentProfile));
      } catch (e) {
        console.warn('Could not save local student profile:', e);
      }
    }

    if (!isSupabaseConfigured) {
      const mockUser: any = {
        id: `user-${Date.now()}`,
        email: trimmedEmail,
        user_metadata: {
          full_name: fullName,
          first_name: extra?.firstName?.trim() || '',
          last_name: extra?.lastName?.trim() || '',
          phone: extra?.phone?.trim() || '',
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      setSession(createMockSession(mockUser));
      return { success: true, confirmationRequired: false };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName,
            first_name: extra?.firstName?.trim() || '',
            last_name: extra?.lastName?.trim() || '',
            phone: extra?.phone?.trim() || '',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        setSession(data.session);
      }
      if (data.user) {
        setUser(data.user);
      }

      const confirmationRequired = !data.session && Boolean(data.user);
      return { success: true, confirmationRequired };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create account' };
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed' };
    }
  };

  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured) return { success: true };
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update password' };
    }
  };

  const deleteAccount = async () => {
    if (!isSupabaseConfigured) {
      signOut();
      return { success: true };
    }
    try {
      if (!session?.access_token) throw new Error('No active session found.');
      const response = await fetch('/api/client/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        await signOut();
        return { success: true };
      } else {
        const result = await response.json();
        return { success: false, error: result.error || 'Failed to delete account' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete account' };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('shanon_demo_admin');
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setAdminError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        adminCheckLoading,
        adminError,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        deleteAccount,
        checkAdminStatus,
        loginAsDemoAdmin,
        loginAsDemoClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
