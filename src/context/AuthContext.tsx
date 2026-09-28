import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  IdTokenResult,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  tokenResult: IdTokenResult | null;
  signUp: (email: string, pass: string, name: string) => Promise<{ user: User }>;
  signIn: (email: string, pass: string) => Promise<{ user: User }>;
  signInWithGoogle: () => Promise<{ user: User }>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  checkVerificationStatus: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserDisplayName: (name: string) => Promise<void>;
  changePassword: (newPass: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  formatAuthError: (error: unknown) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function formatAuthError(error: unknown): string {
  if (!error) return 'An unknown error occurred.';
  const authErr = error as AuthError;
  const code = authErr.code || '';
  const message = authErr.message || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/invalid-email':
      return 'The email address provided is not properly formatted.';
    case 'auth/operation-not-allowed':
      return 'Email/Password authentication is currently not enabled in your Firebase console. Go to Firebase Console > Authentication > Sign-in method and enable Email/Password.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters (8+ recommended).';
    case 'auth/user-disabled':
      return 'This user account has been disabled by an administrator.';
    case 'auth/user-not-found':
      return 'No account was found with this email. Please check your spelling or register.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or use the password reset link.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to many failed attempts. Please wait a few moments or reset your password.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before authentication could complete.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups from this window.';
    case 'auth/cancelled-popup-request':
      return 'The authentication popup request was cancelled.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please verify your internet connection.';
    case 'auth/requires-recent-login':
      return 'For security reasons, this sensitive operation requires recent sign-in. Please log out and sign back in.';
    case 'auth/quota-exceeded':
      return 'Firebase service quota exceeded. Please check your project limits.';
    case 'auth/unauthorized-domain':
      return `This domain is not authorized for OAuth operations. In Firebase Console > Authentication > Settings > Authorized Domains, add this app's domain.`;
    default:
      if (message.includes('API key not valid')) {
        return 'Invalid Firebase API Key. Please verify your Firebase project configuration.';
      }
      return message || 'Authentication failed. Please check your inputs and try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenResult, setTokenResult] = useState<IdTokenResult | null>(null);

  const fetchTokenDetails = async (user: User | null) => {
    if (!user) {
      setTokenResult(null);
      return;
    }
    try {
      const result = await user.getIdTokenResult(true);
      setTokenResult(result);
    } catch (err) {
      console.error('Failed to retrieve token details', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchTokenDetails(user);
      } else {
        setTokenResult(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name.trim()) {
      await updateProfile(cred.user, {
        displayName: name.trim()
      });
    }
    // Automatically trigger verification email upon registration
    try {
      await sendEmailVerification(cred.user);
    } catch (verifyErr) {
      console.warn('Could not send initial verification email:', verifyErr);
    }

    await cred.user.reload();
    const updated = auth.currentUser;
    setCurrentUser(updated ? { ...updated } as User : cred.user);
    await fetchTokenDetails(updated || cred.user);
    return { user: cred.user };
  };

  const signIn = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await cred.user.reload();
    const updated = auth.currentUser;
    setCurrentUser(updated ? { ...updated } as User : cred.user);
    await fetchTokenDetails(updated || cred.user);
    return { user: cred.user };
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    setCurrentUser(cred.user);
    await fetchTokenDetails(cred.user);
    return { user: cred.user };
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setTokenResult(null);
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    await sendEmailVerification(auth.currentUser);
  };

  const checkVerificationStatus = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    const refreshedUser = auth.currentUser;
    setCurrentUser({ ...refreshedUser } as User);
    await fetchTokenDetails(refreshedUser);
    return refreshedUser.emailVerified;
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const updateUserDisplayName = async (name: string) => {
    if (!auth.currentUser) throw new Error('No user signed in.');
    await updateProfile(auth.currentUser, { displayName: name.trim() });
    await auth.currentUser.reload();
    setCurrentUser({ ...auth.currentUser } as User);
  };

  const changePassword = async (newPass: string) => {
    if (!auth.currentUser) throw new Error('No user signed in.');
    await updatePassword(auth.currentUser, newPass);
  };

  const refreshToken = async () => {
    if (auth.currentUser) {
      await fetchTokenDetails(auth.currentUser);
    }
  };

  const isEmailVerified = useMemo(() => {
    return Boolean(currentUser?.emailVerified);
  }, [currentUser]);

  const value = {
    currentUser,
    loading,
    isEmailVerified,
    tokenResult,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resendVerificationEmail,
    checkVerificationStatus,
    sendPasswordReset,
    updateUserDisplayName,
    changePassword,
    refreshToken,
    formatAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
