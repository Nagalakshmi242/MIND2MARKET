import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Mind2Market Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyAlNj3uxu8sc83-xiCPyETQPOe_ijE4UbA",
  authDomain: "mind2market-d6a16.firebaseapp.com",
  projectId: "mind2market-d6a16",
  storageBucket: "mind2market-d6a16.firebasestorage.app",
  messagingSenderId: "332761211770",
  appId: "1:332761211770:web:d0388013865f43f7b2acc3"
};

// Initialize Firebase safely preventing duplicate initialization
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider configured for popups
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
