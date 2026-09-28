import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';

interface RegisterSuccessScreenProps {
  registeredEmail: string;
  onContinue: () => void;
}

export const RegisterSuccessScreen: React.FC<RegisterSuccessScreenProps> = ({
  registeredEmail,
  onContinue,
}) => {
  const { isEmailVerified, resendVerificationEmail, checkVerificationStatus, formatAuthError } = useAuth();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    try {
      setResending(true);
      setFeedback(null);
      await resendVerificationEmail();
      setCooldown(60);
      setFeedback({
        type: 'success',
        message: 'A fresh verification email has been sent! Please check your inbox and junk folder.'
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: formatAuthError(err)
      });
    } finally {
      setResending(false);
    }
  };

  const handleCheck = async () => {
    try {
      setChecking(true);
      setFeedback(null);
      const verified = await checkVerificationStatus();
      if (verified) {
        setFeedback({
          type: 'success',
          message: 'Success! Your email is verified. Redirecting to your account dashboard...'
        });
        setTimeout(() => {
          onContinue();
        }, 1200);
      } else {
        setFeedback({
          type: 'error',
          message: 'Not verified yet. Please click the link in the email and try again.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: formatAuthError(err)
      });
    } finally {
      setChecking(false);
    }
  };

  const emailDomain = registeredEmail.split('@')[1]?.toLowerCase();
  let webmailLink = '';
  let webmailName = '';

  if (emailDomain?.includes('gmail')) {
    webmailLink = 'https://mail.google.com';
    webmailName = 'Open Gmail';
  } else if (emailDomain?.includes('outlook') || emailDomain?.includes('hotmail') || emailDomain?.includes('live')) {
    webmailLink = 'https://outlook.live.com';
    webmailName = 'Open Outlook';
  } else if (emailDomain?.includes('yahoo')) {
    webmailLink = 'https://mail.yahoo.com';
    webmailName = 'Open Yahoo Mail';
  }

  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Icon */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 mx-auto">
            <Mail className="h-10 w-10 animate-bounce duration-1000" />
          </div>
          <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
            <CheckCircle2 className="h-4 w-4" />
          </span>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 mb-2 border border-orange-200 dark:border-orange-800">
            <Sparkles className="h-3 w-3" /> Registration Successful!
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify Your Email Address
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            We have dispatched an encrypted verification link to: <br />
            <span className="font-semibold text-slate-900 dark:text-white text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md inline-block mt-1 border border-slate-200 dark:border-slate-700">
              {registeredEmail}
            </span>
          </p>
        </div>
      </div>

      {/* Instructions list */}
      <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs text-slate-600 dark:text-slate-300">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-xs">
          <Inbox className="h-4 w-4 text-orange-500" /> Quick Instructions
        </h4>
        <div className="space-y-2 pl-1">
          <div className="flex items-start gap-2.5">
            <span className="h-5 w-5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
            <p>Open your email inbox and search for message from <span className="font-mono text-slate-800 dark:text-slate-200">Firebase / mind2market</span>.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="h-5 w-5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
            <p>Click the secure link inside the email to authenticate your ownership.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="h-5 w-5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
            <p>Click the <strong>"Check Verification Status"</strong> button below to activate your account instantly.</p>
          </div>
        </div>
      </div>

      {/* Webmail Shortcut Button if detected */}
      {webmailLink && (
        <div className="mt-4">
          <a
            href={webmailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <span>{webmailName}</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>
      )}

      {/* Status Feedback alert */}
      {feedback && (
        <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <Mail className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleCheck}
          disabled={checking}
          className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:from-orange-700 active:to-amber-700 shadow-md shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
          <span>{checking ? 'Checking Status with Firebase...' : "Check Verification Status"}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {cooldown > 0 ? (
              <>
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Resend ({cooldown}s)</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5 text-orange-500" />
                <span>{resending ? 'Sending...' : 'Resend Link'}</span>
              </>
            )}
          </button>

          <button
            onClick={onContinue}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Didn't receive the email? Check your spam/junk filter or ensure your email was spelled correctly.
        </p>
      </div>

    </div>
  );
};
