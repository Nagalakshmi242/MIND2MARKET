import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegistrationSuccess: (email: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onRegistrationSuccess,
}) => {
  const { signUp, signInWithGoogle, formatAuthError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Password Analysis
  const passwordAnalysis = useMemo(() => {
    return evaluatePasswordStrength(password);
  }, [password]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name or company alias.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }
    if (!acceptTerms) {
      setError('Please agree to the Security Terms and Privacy Notice to proceed.');
      return;
    }

    try {
      setSubmitting(true);
      await signUp(email, password, name);
      onRegistrationSuccess(email.trim());
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleSubmitting(true);
      setError(null);
      await signInWithGoogle();
      // Google accounts usually come pre-verified by Google!
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Mind2Market Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Secure Firebase Auth registration with instant email verification
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Full Name or Alias
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Work or Personal Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@mind2market.com"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            A verification link will be immediately dispatched to this address.
          </p>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            {password && (
              <span className={`text-[11px] font-bold ${passwordAnalysis.color}`}>
                {passwordAnalysis.label}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Progress Bar */}
          {password && (
            <div className="mt-2 space-y-2">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordAnalysis.bgColor}`}
                  style={{ width: `${passwordAnalysis.progressPercent}%` }}
                />
              </div>

              {/* Real-time Checklist of 5 criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                {passwordAnalysis.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`flex items-center gap-1.5 ${
                      rule.passed
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <div
                      className={`h-3.5 w-3.5 rounded-full flex items-center justify-center shrink-0 ${
                        rule.passed
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rule.passed ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : '•'}
                    </div>
                    <span className="truncate">{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            {passwordsMatch !== null && (
              <span
                className={`text-[11px] font-bold ${
                  passwordsMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                }`}
              >
                {passwordsMatch ? 'Passwords match ✓' : 'Passwords do not match ✕'}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                passwordsMatch === false
                  ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                  : passwordsMatch === true
                  ? 'border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-orange-500/20 focus:border-orange-500'
              }`}
            />
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Terms and conditions */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500/20"
          />
          <label htmlFor="terms" className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            I agree to the <span className="font-semibold text-slate-700 dark:text-slate-300">Mind2Market Security Policy</span> and consent to receive account authentication & verification emails.
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting || googleSubmitting}
          className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:from-orange-700 active:to-amber-700 shadow-md shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registering Account & Sending Verification...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-medium">
            or continue with
          </span>
        </div>
      </div>

      {/* Google Sign-in */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={submitting || googleSubmitting}
        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
      >
        {googleSubmitting ? (
          <span className="inline-block h-4 w-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Google Account</span>
      </button>

      {/* Switch to login */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already registered?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-orange-600 hover:text-orange-500 dark:text-orange-400 underline underline-offset-4"
        >
          Sign In Here
        </button>
      </div>

    </div>
  );
};
