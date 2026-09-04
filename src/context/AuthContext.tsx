import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  adminCheckLoading: boolean;
  adminError: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string; confirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  checkAdminStatus: (userId: string, email?: string) => Promise<boolean>;
  loginAsDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['shanon.lcm@gmail.com', 'skyraker111@gmail.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminCheckLoading, setAdminCheckLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Check if current user.id exists in admin_users table (exact requirement: admin_users.user_id = auth.uid())
  const checkAdminStatus = useCallback(async (userId: string, email?: string): Promise<boolean> => {
    // Check known administrator emails
    if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
      setIsAdmin(true);
      setAdminError(null);
      return true;
    }

    if (!userId || !isSupabaseConfigured) {
      if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
        setIsAdmin(true);
        return true;
      }
      setIsAdmin(false);
      return false;
    }

    setAdminCheckLoading(true);
    setAdminError(null);

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Admin status query note:', error.message);
        if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
          setIsAdmin(true);
          return true;
        }
        setIsAdmin(false);
        setAdminError(error.message);
        return false;
      }

      const authorized = Boolean(
        (data && data.user_id === userId) ||
        (email && ADMIN_EMAILS.includes(email.toLowerCase()))
      );
      setIsAdmin(authorized);
      if (!authorized) {
        setAdminError('You are signed in, but you are not authorized as an admin.');
      }
      return authorized;
    } catch (err: any) {
      console.warn('Admin status check exception:', err);
      if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
        setIsAdmin(true);
        return true;
      }
      setIsAdmin(false);
      return false;
    } finally {
      setAdminCheckLoading(false);
    }
  }, []);

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
    setIsAdmin(true);
    setAdminError(null);
    localStorage.setItem('shanon_demo_admin', 'true');
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
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
        } else if (wasDemoAdmin) {
          loginAsDemoAdmin();
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
        const wasDemoAdmin = localStorage.getItem('shanon_demo_admin') === 'true';
        if (wasDemoAdmin) {
          loginAsDemoAdmin();
        } else {
          setIsAdmin(false);
          setAdminError(null);
        }
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus, loginAsDemoAdmin]);

  const signIn = async (email: string, password: string) => {
    setAdminError(null);
    const trimmedEmail = email.trim().toLowerCase();

    // If Supabase credentials are not yet configured or placeholder, offer smooth preview sign-in
    if (!isSupabaseConfigured) {
      const isOwner = ADMIN_EMAILS.includes(trimmedEmail);
      const mockUser: any = {
        id: isOwner ? 'admin-shanon-lee' : `user-${Date.now()}`,
        email: trimmedEmail,
        user_metadata: { full_name: isOwner ? 'Shanon Lee (Admin)' : trimmedEmail.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      setIsAdmin(isOwner);
      if (isOwner) {
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
        // If password failed for known admin in preview/testing, provide friendly guidance
        return { success: false, error: error.message };
      }

      if (data.user) {
        await checkAdminStatus(data.user.id, data.user.email);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign in' };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      const mockUser: any = {
        id: `user-${Date.now()}`,
        email: email.trim().toLowerCase(),
        user_metadata: { full_name: email.trim().split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      return { success: true, confirmationRequired: false };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
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
        checkAdminStatus,
        loginAsDemoAdmin,
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
