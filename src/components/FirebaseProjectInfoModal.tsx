import React, { useState } from 'react';
import { X, Flame, Shield, Check, Copy, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';
import { firebaseConfig } from '../firebase/config';

interface FirebaseProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseProjectInfoModal: React.FC<FirebaseProjectInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Firebase Project Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active credentials & security configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Config Key-Values */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
              Connected Project Parameters
            </h4>

            <div className="space-y-2">
              {[
                { label: 'Project ID', value: firebaseConfig.projectId, key: 'proj' },
                { label: 'Auth Domain', value: firebaseConfig.authDomain, key: 'authDomain' },
                { label: 'App ID', value: firebaseConfig.appId, key: 'appId' },
                { label: 'Storage Bucket', value: firebaseConfig.storageBucket, key: 'bucket' },
                { label: 'Messaging Sender ID', value: firebaseConfig.messagingSenderId, key: 'senderId' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                >
                  <div>
                    <span className="text-slate-400 block text-[11px]">{item.label}</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      {item.value}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.value, item.key)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 transition-colors"
                    title="Copy value"
                  >
                    {copiedKey === item.key ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tips for Firebase Console Email Verification */}
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 space-y-2 text-xs text-orange-900 dark:text-orange-200">
            <h5 className="font-bold flex items-center gap-1.5 text-orange-800 dark:text-orange-300">
              <Mail className="h-4 w-4" /> Firebase Email Verification Setup
            </h5>
            <p className="leading-relaxed">
              Firebase sends automated verification emails using Google's cloud delivery infrastructure. To customize your email sender name or template:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-orange-800/90 dark:text-orange-200/90">
              <li>Open <a href="https://console.firebase.google.com/project/mind2market-d6a16/authentication/templates" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-orange-950 dark:hover:text-white">Firebase Console &gt; Authentication &gt; Templates</a>.</li>
              <li>Select <strong>Email address verification</strong>.</li>
              <li>You can customize the sender name, reply-to email, and email body to match Mind2Market.</li>
            </ol>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
