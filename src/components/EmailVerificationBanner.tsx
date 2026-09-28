import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Mail, 
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';

export const EmailVerificationBanner: React.FC = () => {
  const { currentUser, isEmailVerified, resendVerificationEmail, checkVerificationStatus, formatAuthError } = useAuth();
  
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [bannerFeedback, setBannerFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!currentUser || isEmailVerified) {
    return null;
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    try {
      setResending(true);
      setBannerFeedback(null);
      await resendVerificationEmail();
      setCooldown(60); // 60s cooldown to prevent Firebase rate-limit
      setBannerFeedback({
        type: 'success',
        message: `Verification link successfully dispatched to ${currentUser.email}! Please check your Inbox and Spam folder.`
      });
    } catch (err) {
      setBannerFeedback({
        type: 'error',
        message: formatAuthError(err)
      });
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      setChecking(true);
      setBannerFeedback(null);
      const verified = await checkVerificationStatus();
      if (verified) {
        setBannerFeedback({
          type: 'success',
          message: 'Hooray! Your email has been verified successfully. Your account is now fully unlocked!'
        });
      } else {
        setBannerFeedback({
          type: 'error',
          message: 'Still unverified. Please open the link in your email and click "Check Verification Status" again.'
        });
      }
    } catch (err) {
      setBannerFeedback({
        type: 'error',
        message: formatAuthError(err)
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-b border-amber-300 dark:border-amber-800/80 px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm shadow-amber-500/30">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Email Verification Required
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Action Pending
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              A verification link was sent to <strong className="font-semibold text-slate-800 dark:text-slate-100">{currentUser.email}</strong>. 
              Verify your email to ensure secure account recovery and access high-security features.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap self-end md:self-center shrink-0">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-indigo-500 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking...' : "I've Verified My Email"}</span>
          </button>

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white shadow-sm shadow-orange-600/30 transition-all disabled:opacity-50 disabled:hover:bg-orange-600"
          >
            {cooldown > 0 ? (
              <>
                <Clock className="h-3.5 w-3.5" />
                <span>Resend in {cooldown}s</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>{resending ? 'Sending...' : 'Resend Email'}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Banner Feedback alert */}
      {bannerFeedback && (
        <div className={`mt-2.5 mx-auto max-w-7xl px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 ${
          bannerFeedback.type === 'success' 
            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800' 
            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {bannerFeedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{bannerFeedback.message}</span>
          </div>
          <button
            onClick={() => setBannerFeedback(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
