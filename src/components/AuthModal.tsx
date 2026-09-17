import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Gamepad2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { 
    language, 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    resetPassword,
    addToast 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        addToast(
          language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully',
          language === 'ar' ? `مرحباً بك مجدداً!` : `Welcome back!`,
          'success'
        );
        onClose();
      } else if (mode === 'register') {
        if (!displayName.trim() || !gamerTag.trim()) {
          setErrorMsg(language === 'ar' ? 'يرجى إدخال اسمك ولقب اللاعب' : 'Please fill in your name and GamerTag');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName, gamerTag);
        addToast(
          language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account Created!',
          language === 'ar' ? 'تم إرسال رابط التحقق إلى بريدك الإلكتروني' : 'Verification email has been sent',
          'success'
        );
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        addToast(
          language === 'ar' ? 'تم إرسال الرابط' : 'Link Sent',
          language === 'ar' ? 'تحقق من صندوق الوارد لاستعادة كلمة المرور' : 'Check your inbox to reset password',
          'info'
        );
        setMode('login');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = err.message || 'Authentication failed';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password';
      } else if (err.code === 'auth/email-already-in-use') {
        message = language === 'ar' ? 'هذا البريد الإلكتروني مسجل مسبقاً' : 'Email is already registered';
      } else if (err.code === 'auth/weak-password') {
        message = language === 'ar' ? 'كلمة المرور يجب ألا تقل عن 6 خانات' : 'Password must be at least 6 characters';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      addToast(
        language === 'ar' ? 'تم تسجيل الدخول عبر Google' : 'Signed in with Google',
        language === 'ar' ? 'مرحباً بك في نكسس كيز!' : 'Welcome to NexusKeys!',
        'success'
      );
      onClose();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101222] border border-purple-500/40 rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl overflow-hidden glow-purple animate-in fade-in zoom-in-95 duration-200">
        
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full filter blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full filter blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-[#1c1f36] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-600/40 flex items-center justify-center mx-auto text-cyan-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white font-gaming">
            {mode === 'login' && (language === 'ar' ? 'تسجيل الدخول الحقيقي' : 'Real Gamer Login')}
            {mode === 'register' && (language === 'ar' ? 'إنشاء حساب جديد' : 'Create Gamer Account')}
            {mode === 'forgot' && (language === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password')}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' && (language === 'ar' ? 'سجّل دخولك لحفظ مفاتيحك ورصيد محفظتك دائماً' : 'Sign in to access your keys and wallet')}
            {mode === 'register' && (language === 'ar' ? 'انضم للمتجر مع تحقق حقيقي وتشفير آمن للبيانات' : 'Join with verified encryption and permanent storage')}
            {mode === 'forgot' && (language === 'ar' ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة آمن' : 'Enter your email to receive recovery instructions')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <div className="space-y-4 mb-4">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full bg-[#181a30] hover:bg-[#202340] border border-purple-800/60 hover:border-cyan-400 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-3 transition-all shadow-md group"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{language === 'ar' ? 'تسجيل الدخول الفعلي عبر Google' : 'Sign in with Google OAuth'}</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-purple-900/40" />
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{language === 'ar' ? 'أو عبر البريد' : 'OR WITH EMAIL'}</span>
              <div className="h-px flex-1 bg-purple-900/40" />
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 text-xs block mb-1">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={language === 'ar' ? 'سعود' : 'Saud'}
                    className="w-full bg-[#15182a] border border-purple-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-xs block mb-1">{language === 'ar' ? 'لقب اللاعب' : 'GamerTag'}</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    placeholder="Shadow_Sniper"
                    className="w-full bg-[#15182a] border border-purple-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-gaming"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-300 text-xs block mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-[#15182a] border border-purple-900/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 text-xs">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#15182a] border border-purple-900/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 disabled:opacity-50 text-slate-950 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all font-gaming shadow-lg shadow-cyan-400/20 mt-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              <>
                <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            ) : mode === 'register' ? (
              <>
                <span>{language === 'ar' ? 'إنشاء حساب جديد وتأكيد الإيميل' : 'Create Account & Verify'}</span>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            ) : (
              <span>{language === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Recovery Link'}</span>
            )}
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div className="pt-5 mt-4 border-t border-purple-900/40 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              {language === 'ar' ? 'ليس لديك حساب بعد؟' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-cyan-400 font-bold hover:underline"
              >
                {language === 'ar' ? 'إنشاء حساب جديد' : 'Register now'}
              </button>
            </p>
          ) : (
            <p>
              {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-cyan-400 font-bold hover:underline"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
