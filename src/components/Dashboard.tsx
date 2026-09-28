import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Lock, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Code,
  Flame,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  Unlock,
  AlertCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    isEmailVerified, 
    tokenResult, 
    resendVerificationEmail, 
    checkVerificationStatus,
    updateUserDisplayName, 
    changePassword,
    formatAuthError 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'token' | 'features'>('profile');

  // Display Name editing state
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Change Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Verification state
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationFeedback, setVerificationFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // UID Copy feedback
  const [copiedUid, setCopiedUid] = useState(false);

  // Protected Feature Interactive Demo State
  const [simulatedActionMessage, setSimulatedActionMessage] = useState<string | null>(null);

  const handleCopyUid = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileFeedback(null);
      await updateUserDisplayName(displayName);
      setProfileFeedback({ type: 'success', message: 'Profile display name successfully updated!' });
    } catch (err) {
      setProfileFeedback({ type: 'error', message: formatAuthError(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'New password must contain at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Password confirmation does not match.' });
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordFeedback(null);
      await changePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordFeedback({ type: 'success', message: 'Account password updated successfully!' });
    } catch (err) {
      setPasswordFeedback({ type: 'error', message: formatAuthError(err) });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleVerifyCheck = async () => {
    try {
      setCheckingVerification(true);
      setVerificationFeedback(null);
      const verified = await checkVerificationStatus();
      if (verified) {
        setVerificationFeedback({
          type: 'success',
          message: 'Status refreshed: Email is verified! All security features unlocked.'
        });
      } else {
        setVerificationFeedback({
          type: 'error',
          message: 'Still showing unverified in Firebase. Make sure you clicked the link in your inbox!'
        });
      }
    } catch (err) {
      setVerificationFeedback({ type: 'error', message: formatAuthError(err) });
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendingVerification || resendCooldown > 0) return;
    try {
      setResendingVerification(true);
      setVerificationFeedback(null);
      await resendVerificationEmail();
      setResendCooldown(60);
      setVerificationFeedback({
        type: 'success',
        message: `Fresh verification email dispatched to ${currentUser?.email}. Please check your inbox and spam folder.`
      });
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setVerificationFeedback({ type: 'error', message: formatAuthError(err) });
    } finally {
      setResendingVerification(false);
    }
  };

  const handleExecuteProtectedAction = (actionName: string, requiresVerification: boolean) => {
    if (requiresVerification && !isEmailVerified) {
      setSimulatedActionMessage(`BLOCKED: "${actionName}" requires a verified email address. Please click the verification link in your inbox first.`);
    } else {
      setSimulatedActionMessage(`SUCCESS: "${actionName}" executed successfully with valid Firebase Auth credentials!`);
    }
  };

  const passwordAnalysis = evaluatePasswordStrength(newPassword);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl ring-4 ring-orange-500/30 object-cover shadow-lg"
              />
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-orange-500/20">
                {(currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {currentUser?.displayName || 'Mind2Market Member'}
                </h1>
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified User
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <AlertTriangle className="h-3.5 w-3.5" /> Verification Pending
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{currentUser?.email}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  UID: {currentUser?.uid?.slice(0, 14)}...
                </span>
                <button
                  onClick={handleCopyUid}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                  title="Copy full UID"
                >
                  {copiedUid ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedUid ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick status summary badge box */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-slate-400 block text-[11px]">Primary Auth Provider</span>
              <span className="font-semibold text-slate-200 capitalize">
                {currentUser?.providerData[0]?.providerId === 'password' 
                  ? 'Password & Email' 
                  : currentUser?.providerData[0]?.providerId || 'Email / Password'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-slate-400 block text-[11px]">Firebase Project</span>
              <span className="font-mono font-semibold text-orange-400">mind2market-d6a16</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status Alert Card (if unverified) */}
      {!isEmailVerified && (
        <div className="rounded-3xl border border-amber-300/80 dark:border-amber-900/60 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Verify your email address to unlock all capabilities
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  We sent an email verification link to <strong>{currentUser?.email}</strong>. Once you click the link in your email, click the button below to update your status in real time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                onClick={handleVerifyCheck}
                disabled={checkingVerification}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-indigo-500 ${checkingVerification ? 'animate-spin' : ''}`} />
                <span>{checkingVerification ? 'Verifying...' : "I've Verified My Email"}</span>
              </button>

              <button
                onClick={handleResendVerification}
                disabled={resendingVerification || resendCooldown > 0}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {resendCooldown > 0 ? (
                  <>
                    <Clock className="h-3.5 w-3.5" />
                    <span>Resend in {resendCooldown}s</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>{resendingVerification ? 'Sending...' : 'Resend Link'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {verificationFeedback && (
            <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              verificationFeedback.type === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
            }`}>
              {verificationFeedback.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span>{verificationFeedback.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile & Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'features'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Access Control Demo</span>
        </button>

        <button
          onClick={() => setActiveTab('token')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'token'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>Auth Token & Claims</span>
        </button>
      </div>

      {/* Tab 1: Profile & Identity */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit Display Name */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Personal Information
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage your profile details stored securely in Firebase Auth
              </p>
            </div>

            {profileFeedback && (
              <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                profileFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
              }`}>
                {profileFeedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                )}
                <span>{profileFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full pl-10 pr-24 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 cursor-not-allowed"
                  />
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-400">
                    Primary
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Email is anchored to your Firebase authentication record.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {savingProfile ? (
                    <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Account Meta & Security Attributes */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Identity Meta
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-400 text-[11px] block">Firebase User UID</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 break-all select-all font-semibold">
                  {currentUser?.uid}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-400 text-[11px] block">Account Created</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-orange-500" />
                  {currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleString() : 'N/A'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-400 text-[11px] block">Last Sign-in</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                  {currentUser?.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() : 'N/A'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-400 text-[11px] block">Email Verification Status</span>
                <span className={`font-semibold inline-flex items-center gap-1.5 mt-0.5 ${
                  isEmailVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {isEmailVerified ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Verified & Confirmed
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" /> Unverified (Action Needed)
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Change Password
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Update your account password with instant Firebase encryption
              </p>
            </div>

            {passwordFeedback && (
              <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                passwordFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
              }`}>
                {passwordFeedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                )}
                <span>{passwordFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>

                {newPassword && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Strength:</span>
                      <span className={`font-bold ${passwordAnalysis.color}`}>{passwordAnalysis.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordAnalysis.bgColor}`}
                        style={{ width: `${passwordAnalysis.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {savingPassword ? (
                    <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Key className="h-3.5 w-3.5" />
                  )}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
              Security Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your account security status based on Firebase Auth parameters:
            </p>

            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                {isEmailVerified ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    {isEmailVerified ? 'Email Verified' : 'Email Unverified'}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {isEmailVerified ? 'Prevents unauthorized account takeover' : 'Verify via link sent to your email'}
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    TLS & Firebase JWT
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    All tokens cryptographically signed by Google
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Auto Session Refresh
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Tokens refresh hourly without user friction
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Access Control & Protected Features Demo */}
      {activeTab === 'features' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Role & Verification Gatekeeping
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Role-Based Access Control Demonstration
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              In production systems, sensitive operations require <span className="font-semibold text-slate-700 dark:text-slate-300">email_verified == true</span> in the Firebase Auth ID Token. Test the gatekeeper below to see how this prevents unverified accounts from executing restricted actions.
            </p>
          </div>

          {/* Interactive feedback */}
          {simulatedActionMessage && (
            <div className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
              simulatedActionMessage.startsWith('SUCCESS')
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
            }`}>
              <div className="flex items-center gap-2.5">
                {simulatedActionMessage.startsWith('SUCCESS') ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
                )}
                <span className="font-semibold">{simulatedActionMessage}</span>
              </div>
              <button
                onClick={() => setSimulatedActionMessage(null)}
                className="text-xs font-bold opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}

          {/* Action cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Action 1: Standard feature */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Open to All Signed-In
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Basic Project Workspace
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  View and manage public datasets and draft configurations.
                </p>
              </div>

              <button
                onClick={() => handleExecuteProtectedAction('Access Basic Project Workspace', false)}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white transition-colors"
              >
                Execute Workspace Action
              </button>
            </div>

            {/* Action 2: Requires Verified Email */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              isEmailVerified
                ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                : 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="h-8 w-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    isEmailVerified 
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                      : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
                  }`}>
                    {isEmailVerified ? 'Unlocked' : 'Requires Verification'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Market Publishing Engine
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Deploy applications and projects to the Mind2Market public catalogue.
                </p>
              </div>

              <button
                onClick={() => handleExecuteProtectedAction('Deploy to Mind2Market Catalogue', true)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                  isEmailVerified
                    ? 'bg-orange-600 hover:bg-orange-500 text-white'
                    : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300'
                }`}
              >
                {isEmailVerified ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                <span>Publish Project</span>
              </button>
            </div>

            {/* Action 3: Requires Verified Email */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              isEmailVerified
                ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                : 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Key className="h-4 w-4" />
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    isEmailVerified 
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                      : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
                  }`}>
                    {isEmailVerified ? 'Unlocked' : 'Requires Verification'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Production API Keys
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Generate high-rate production API credentials for programmatic integration.
                </p>
              </div>

              <button
                onClick={() => handleExecuteProtectedAction('Generate High-Rate Production API Key', true)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                  isEmailVerified
                    ? 'bg-orange-600 hover:bg-orange-500 text-white'
                    : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300'
                }`}
              >
                {isEmailVerified ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                <span>Generate API Key</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Token & Claims Inspector */}
      {activeTab === 'token' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code className="h-5 w-5 text-orange-500" />
                Firebase ID Token & Claims Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Decoded claims payload currently issued to this client
              </p>
            </div>
            <button
              onClick={handleVerifyCheck}
              disabled={checkingVerification}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3 w-3 ${checkingVerification ? 'animate-spin' : ''}`} />
              <span>Refresh Claims</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800">
              <span className="text-[11px] text-orange-400 font-sans font-bold uppercase tracking-wider block">
                Standard Security Claims
              </span>
              <div className="space-y-1 text-slate-300">
                <p><span className="text-slate-500">aud:</span> "mind2market-d6a16"</p>
                <p><span className="text-slate-500">iss:</span> "https://securetoken.google.com/mind2market-d6a16"</p>
                <p><span className="text-slate-500">sub:</span> "{currentUser?.uid}"</p>
                <p><span className="text-slate-500">email:</span> "{currentUser?.email}"</p>
                <p>
                  <span className="text-slate-500">email_verified:</span>{' '}
                  <span className={isEmailVerified ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isEmailVerified ? 'true' : 'false'}
                  </span>
                </p>
                <p><span className="text-slate-500">sign_in_provider:</span> "{tokenResult?.signInProvider || 'password'}"</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800">
              <span className="text-[11px] text-orange-400 font-sans font-bold uppercase tracking-wider block">
                Timestamps & Expiration
              </span>
              <div className="space-y-1 text-slate-300">
                <p><span className="text-slate-500">auth_time:</span> {tokenResult?.authTime ? new Date(tokenResult.authTime).toLocaleString() : 'Active'}</p>
                <p><span className="text-slate-500">issued_at:</span> {tokenResult?.issuedAtTime ? new Date(tokenResult.issuedAtTime).toLocaleString() : 'Active'}</p>
                <p><span className="text-slate-500">expires_at:</span> {tokenResult?.expirationTime ? new Date(tokenResult.expirationTime).toLocaleString() : '1 hour'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
