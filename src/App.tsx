import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { RegisterSuccessScreen } from './components/RegisterSuccessScreen';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { Dashboard } from './components/Dashboard';
import { EmailVerificationBanner } from './components/EmailVerificationBanner';
import { FirebaseProjectInfoModal } from './components/FirebaseProjectInfoModal';
import { 
  Flame, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Key, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [justRegisteredEmail, setJustRegisteredEmail] = useState<string | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xl shadow-orange-500/25 animate-pulse">
            <Flame className="h-9 w-9" />
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          Initializing Secure Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation */}
      <Navbar onOpenProjectInfo={() => setIsProjectInfoOpen(true)} />

      {/* Email Verification Banner */}
      <EmailVerificationBanner />

      {/* Main Container */}
      <main className="flex-1">
        {currentUser ? (
          /* Authenticated User Dashboard */
          <Dashboard />
        ) : (
          /* Unauthenticated Auth Flow */
          <div className="relative overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
            {/* Background ambient accents */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative mx-auto max-w-7xl">
              
              {/* If user just signed up, show the Dedicated Verification Onboarding Screen */}
              {justRegisteredEmail ? (
                <div className="my-6">
                  <RegisterSuccessScreen
                    registeredEmail={justRegisteredEmail}
                    onContinue={() => setJustRegisteredEmail(null)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column: Hero & Product Pitch */}
                  <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80 mb-4 shadow-sm">
                        <ShieldCheck className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                        <span>Firebase Authentication & Email Verification</span>
                      </div>
                      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                        Secure Access for <br />
                        <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-indigo-600 bg-clip-text text-transparent">
                          Mind2Market Ventures
                        </span>
                      </h1>
                      <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Complete identity management with email/password registration, automated email verification links, Google OAuth integration, and granular access control.
                      </p>
                    </div>

                    {/* Feature badges list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Email Verification
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Automated dispatch with one-click verification status check.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Lock className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Password Hardening
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Interactive 5-point password strength analyzer and match guards.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            User Management
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Full profile updates, token inspection, and session management.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <Key className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Password Recovery
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Instant recovery reset flow via Firebase Cloud dispatch.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center lg:justify-start text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Firebase Auth SDK v11
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Google Cloud Security
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Interactive Login/Register Form */}
                  <div className="lg:col-span-6 flex flex-col items-center">
                    
                    {/* Mode Switcher Tabs */}
                    <div className="flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-sm mb-6 border border-slate-300/60 dark:border-slate-700/60 w-full max-w-md">
                      <button
                        onClick={() => setAuthMode('login')}
                        className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                          authMode === 'login'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md shadow-slate-900/5'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setAuthMode('register')}
                        className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                          authMode === 'register'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md shadow-slate-900/5'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Create Account
                      </button>
                    </div>

                    {authMode === 'login' ? (
                      <LoginForm
                        onSwitchToRegister={() => setAuthMode('register')}
                        onForgotPassword={(email) => {
                          setForgotPasswordEmail(email || '');
                          setIsForgotPasswordOpen(true);
                        }}
                      />
                    ) : (
                      <RegisterForm
                        onSwitchToLogin={() => setAuthMode('login')}
                        onRegistrationSuccess={(email) => {
                          setJustRegisteredEmail(email);
                        }}
                      />
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Mind2Market. Protected by Firebase Authentication.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsProjectInfoOpen(true)}
              className="hover:text-orange-500 transition-colors"
            >
              Project: mind2market-d6a16
            </button>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              TLS / AES-256 Encrypted
            </span>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialEmail={forgotPasswordEmail}
      />

      {/* Firebase Project Info Modal */}
      <FirebaseProjectInfoModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
