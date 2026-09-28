import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  LogOut, 
  User as UserIcon, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Flame,
  Info
} from 'lucide-react';

interface NavbarProps {
  onOpenProjectInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProjectInfo }) => {
  const { currentUser, isEmailVerified, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 shadow-md shadow-orange-500/20 text-white">
            <Flame className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-900 dark:text-white text-lg">
                Mind<span className="text-orange-500">2</span>Market
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                Auth Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
              Project: mind2market-d6a16
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProjectInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors"
            title="Firebase Project Config"
          >
            <Info className="h-3.5 w-3.5 text-orange-500" />
            <span className="hidden md:inline">Firebase Config</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[160px] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  {isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                      <AlertTriangle className="h-3 w-3" /> Unverified
                    </span>
                  )}
                </span>
              </div>

              {/* User Avatar */}
              <div className="relative">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="h-9 w-9 rounded-full ring-2 ring-orange-500/30 object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                    isEmailVerified ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  title={isEmailVerified ? 'Email Verified' : 'Email Unverified'}
                />
              </div>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/60"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Firebase Auth Active
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
