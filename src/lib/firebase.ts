import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const DEFAULT_CONFIG = {
  apiKey: "AIzaSyBVhPNwmiT5nTtF1-gAUlUFwgVltdfu358",
  authDomain: "reeldare-dd6b8.firebaseapp.com",
  projectId: "reeldare-dd6b8",
  storageBucket: "reeldare-dd6b8.firebasestorage.app",
  messagingSenderId: "241922649269",
  appId: "1:241922649269:web:d5c92abc91b6fbaa1da2fc",
  measurementId: "G-MCW52PZZ46",
};

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAULT_CONFIG.apiKey;

export const isFirebaseConfigured = Boolean(
  apiKey &&
  apiKey.trim() !== "" &&
  !apiKey.includes("<")
);

const firebaseConfig = {
  apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAULT_CONFIG.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_CONFIG.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAULT_CONFIG.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_CONFIG.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAULT_CONFIG.appId,
};

// Initialize Firebase app safely
export const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

// Initialize Firebase Authentication safely
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Initialize Cloud Firestore safely
export const db = app ? getFirestore(app) : null;

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
};
