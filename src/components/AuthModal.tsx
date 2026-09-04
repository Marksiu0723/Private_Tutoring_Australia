import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup' | 'reset';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const { t } = useLanguage();
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (mode !== 'reset' && !password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    if (mode === 'signin') {
      const res = await signIn(email, password);
      setLoading(false);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.error || 'Failed to sign in.');
      }
    } else if (mode === 'signup') {
      const res = await signUp(email, password);
      setLoading(false);
      if (res.success) {
        if (res.confirmationRequired) {
          setSuccessMsg('Account created! Please check your email inbox to confirm your address before signing in.');
        } else {
          onClose();
          if (onSuccess) onSuccess();
        }
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    } else if (mode === 'reset') {
      const res = await resetPassword(email);
      setLoading(false);
      if (res.success) {
        setSuccessMsg('Password reset instructions have been dispatched to your email.');
      } else {
        setErrorMsg(res.error || 'Password reset request failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2E25]/60 dark:bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#FDFCF8] dark:bg-[#1C1C17] rounded-[32px] shadow-2xl border border-[#E8E4D9] dark:border-[#33332A] overflow-hidden">
        {/* Header */}
        <div className="bg-[#F5F2ED] dark:bg-[#23231D] text-[#2D2C27] dark:text-[#EDEAE1] px-7 py-5 flex items-center justify-between border-b border-[#E8E4D9] dark:border-[#33332A]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5A5A40] dark:text-[#A3B18A] block">
              Shanon Lee Tutoring
            </span>
            <h3 className="text-2xl font-serif font-bold tracking-tight text-[#2D2C27] dark:text-[#EDEAE1]">
              {mode === 'signin' && t('auth.signIn')}
              {mode === 'signup' && t('auth.signUp')}
              {mode === 'reset' && t('auth.resetPassword')}
            </h3>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#8C867A] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] hover:bg-[#E8E4D9] dark:hover:bg-[#2F2F26] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8E4D9] dark:border-[#33332A] bg-[#F5F2ED] dark:bg-[#23231D]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#FDFCF8] dark:bg-[#1C1C17] text-[#2D2C27] dark:text-[#EDEAE1] border-b-2 border-[#5A5A40] dark:border-[#A3B18A]'
                : 'text-[#8C867A] dark:text-[#9E9A8E] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1]'
            }`}
          >
            {t('auth.signInBtn')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#FDFCF8] dark:bg-[#1C1C17] text-[#2D2C27] dark:text-[#EDEAE1] border-b-2 border-[#5A5A40] dark:border-[#A3B18A]'
                : 'text-[#8C867A] dark:text-[#9E9A8E] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1]'
            }`}
          >
            {t('auth.signUpBtn')}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#434336] text-xs text-[#5A5A40] dark:text-[#C6D4AB] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295] mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-3" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.enterEmail')}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:border-[#5A5A40] dark:focus:border-[#A3B18A] focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#A6A295]">
                  {t('auth.password')}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-[#5A5A40] dark:text-[#A3B18A] hover:underline font-medium cursor-pointer"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C867A] dark:text-[#A6A295] absolute left-3.5 top-3" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.enterPassword')}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#23231D] border border-[#E8E4D9] dark:border-[#33332A] rounded-xl text-sm text-[#2D2C27] dark:text-[#EDEAE1] focus:ring-1 focus:ring-[#5A5A40] dark:focus:ring-[#A3B18A] focus:border-[#5A5A40] dark:focus:border-[#A3B18A] focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-full text-xs uppercase tracking-widest font-semibold text-white dark:text-[#171714] bg-[#5A5A40] dark:bg-[#A3B18A] hover:bg-[#484833] dark:hover:bg-[#8F9E72] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-xs mt-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white dark:border-[#171714] border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : mode === 'signin' ? (
              t('auth.signInBtn')
            ) : mode === 'signup' ? (
              t('auth.signUpBtn')
            ) : (
              t('auth.sendResetLink')
            )}
          </button>

          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="w-full text-center text-xs font-semibold text-[#8C867A] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1] pt-2 cursor-pointer"
            >
              Back to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
