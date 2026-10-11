"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import {
  RANK_TIERS,
  getRankForXp,
  COMMUNITY_LEADERBOARD,
  type RankTier,
  type LeaderboardEntry,
} from "@/lib/shared";

export {
  RANK_TIERS,
  getRankForXp,
  COMMUNITY_LEADERBOARD,
  type RankTier,
  type LeaderboardEntry,
};

export interface EvidenceSubmission {
  id: string;
  expId: number;
  expTitle: string;
  category: string;
  whatYouDid: string;
  timeSpent: string;
  completedDate: string;
  evidenceLink: string;
  xpEarned: number;
  submittedAt: string;
}

export interface UserPreferences {
  activities: string[];
  budget: string;
  time: string;
  comfortLevel: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  socialLink: string;
  instagram?: string;
  avatar?: string;
  bio?: string;
  accentColor?: string;
  xp: number;
  completedTasks: number;
  spinsCount: number;
  createdAt: string;
  preferences?: UserPreferences;
  completedEvidences?: EvidenceSubmission[];
}

export interface XpAwardEvent {
  amount: number;
  reason: string;
  newTotalXp: number;
  leveledUp: boolean;
  newRankName?: string;
  timestamp: number;
}

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  /** true once localStorage has been read on the client (avoids a logged-out flash on first paint) */
  isReady: boolean;
  currentRank: RankTier;
  nextRank: RankTier | null;
  xpProgressPercent: number;
  recentAward: XpAwardEvent | null;
  clearRecentAward: () => void;
  login: (emailOrUsername: string, password?: string) => Promise<boolean> | boolean;
  signInWithGoogle: () => Promise<boolean>;
  register: (data: {
    username: string;
    email: string;
    password?: string;
    socialLink: string;
    bio?: string;
    preferences?: UserPreferences;
  }) => Promise<void> | void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  awardXP: (amount: number, reason: string) => void;
  submitEvidence: (evidence: Omit<EvidenceSubmission, "id" | "submittedAt">) => void;
  getLeaderboard: () => LeaderboardEntry[];
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = "tdbd-user-profile";
const ACCOUNTS_KEY = "tdbd-accounts";

function readAccounts(): UserProfile[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as UserProfile[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function upsertAccount(profile: UserProfile) {
  try {
    const accounts = readAccounts().filter((a) => a.id !== profile.id);
    accounts.push(profile);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [recentAward, setRecentAward] = useState<XpAwardEvent | null>(null);

  // Restore the logged-in user from localStorage, then synchronize with backend API
  useEffect(() => {
    let localUser: UserProfile | null = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localUser = JSON.parse(stored);
        setUser(localUser);
      }
    } catch {}
    setIsReady(true);

    // Sync with backend /api/user/me
    if (localUser?.id) {
      fetch("/api/user/me", {
        headers: { "x-user-id": localUser.id },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.user) {
            setUser((prev) => ({
              ...(prev || localUser!),
              ...data.user,
              completedEvidences: data.user.completedEvidences ?? prev?.completedEvidences ?? [],
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  const saveUser = (updated: UserProfile | null) => {
    setUser(updated);
    try {
      if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        upsertAccount(updated);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      window.dispatchEvent(new Event("tdbd-user-changed"));
    } catch {}
  };

  const login = async (emailOrUsername: string, password?: string): Promise<boolean> => {
    const needle = emailOrUsername.trim().toLowerCase();
    if (!needle) return false;

    // 1. If Firebase credentials provided and email looks valid, attempt Firebase Auth
    if (password && needle.includes("@") && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      try {
        const { auth, signInWithEmailAndPassword, db } = await import("@/lib/firebase");
        const userCredential = await signInWithEmailAndPassword(auth, needle, password);
        const fbUser = userCredential.user;

        // Fetch user data from Firestore
        let profileData: Partial<UserProfile> = {};
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          if (snap.exists()) {
            profileData = snap.data() as Partial<UserProfile>;
          }
        } catch {}

        const mappedUser: UserProfile = {
          id: fbUser.uid,
          username: profileData.username || fbUser.displayName?.replace(/\s+/g, "_").toLowerCase() || needle.split("@")[0],
          email: fbUser.email || needle,
          displayName: profileData.displayName || fbUser.displayName || undefined,
          avatar: profileData.avatar || fbUser.photoURL || undefined,
          socialLink: profileData.socialLink || "",
          bio: profileData.bio || "Live more. Regret nothing.",
          xp: profileData.xp || 150,
          completedTasks: profileData.completedTasks || 0,
          spinsCount: profileData.spinsCount || 0,
          createdAt: profileData.createdAt || new Date().toISOString(),
          preferences: profileData.preferences,
          completedEvidences: profileData.completedEvidences || [],
        };

        saveUser(mappedUser);
        return true;
      } catch (fbErr) {
        console.warn("Firebase email login error:", fbErr);
        // If password was wrong or auth failed, propagate or fallback
      }
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: needle, password }),
      });
      const data = await res.json();
      if (res.ok && data?.user) {
        saveUser(data.user);
        return true;
      }
    } catch {}

    // Fallback to local accounts if backend is unreachable
    const account = readAccounts().find(
      (a) => a.email.toLowerCase() === needle || a.username.toLowerCase() === needle
    );
    if (!account) return false;
    saveUser(account);
    return true;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const { auth, googleProvider, signInWithPopup, db } = await import("@/lib/firebase");
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;

      let profileData: Partial<UserProfile> = {};
      try {
        const { doc, getDoc, setDoc } = await import("firebase/firestore");
        const docRef = doc(db, "users", fbUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          profileData = snap.data() as Partial<UserProfile>;
        } else {
          // Initialize new profile document in Firestore
          profileData = {
            id: fbUser.uid,
            username: (fbUser.displayName || fbUser.email?.split("@")[0] || "explorer")
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, "_"),
            displayName: fbUser.displayName || undefined,
            email: fbUser.email || "",
            avatar: fbUser.photoURL || undefined,
            socialLink: "",
            bio: "Live more. Regret nothing.",
            xp: 150,
            completedTasks: 0,
            spinsCount: 0,
            createdAt: new Date().toISOString(),
          };
          await setDoc(docRef, profileData, { merge: true });
        }
      } catch (fsErr) {
        console.warn("Firestore profile sync notice:", fsErr);
      }

      const mappedUser: UserProfile = {
        id: fbUser.uid,
        username: profileData.username || fbUser.email?.split("@")[0] || "explorer",
        displayName: fbUser.displayName || profileData.displayName,
        email: fbUser.email || "",
        avatar: fbUser.photoURL || profileData.avatar,
        socialLink: profileData.socialLink || "",
        bio: profileData.bio || "Live more. Regret nothing.",
        xp: profileData.xp ?? 150,
        completedTasks: profileData.completedTasks ?? 0,
        spinsCount: profileData.spinsCount ?? 0,
        createdAt: profileData.createdAt || new Date().toISOString(),
        preferences: profileData.preferences,
        completedEvidences: profileData.completedEvidences || [],
      };

      saveUser(mappedUser);
      return true;
    } catch (err: any) {
      console.error("Google Sign-In failed:", err);
      throw err;
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password?: string;
    socialLink: string;
    bio?: string;
    preferences?: UserPreferences;
  }) => {
    const cleanUsername = data.username.trim().toLowerCase().replace(/\s+/g, "_");
    const cleanEmail = data.email.trim();

    // 1. If password provided, register with Firebase Auth & save to Firestore
    if (data.password && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      try {
        const { auth, createUserWithEmailAndPassword, updateProfile: fbUpdateProfile, db } = await import("@/lib/firebase");
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
        const fbUser = cred.user;

        await fbUpdateProfile(fbUser, { displayName: data.username });

        const newUser: UserProfile = {
          id: fbUser.uid,
          username: cleanUsername,
          displayName: data.username,
          email: cleanEmail,
          socialLink: data.socialLink.trim(),
          bio: data.bio || "Live more. Regret nothing.",
          xp: 150,
          completedTasks: 0,
          spinsCount: 0,
          createdAt: new Date().toISOString(),
          preferences: data.preferences,
          completedEvidences: [],
        };

        try {
          const { doc, setDoc } = await import("firebase/firestore");
          await setDoc(doc(db, "users", fbUser.uid), newUser, { merge: true });
        } catch (fsErr) {
          console.warn("Firestore user creation notice:", fsErr);
        }

        saveUser(newUser);

        setRecentAward({
          amount: 150,
          reason: "Welcome Explorer Bonus! Profile & preferences created.",
          newTotalXp: 150,
          leveledUp: false,
          timestamp: Date.now(),
        });
        return;
      } catch (fbErr) {
        console.warn("Firebase registration error:", fbErr);
        throw fbErr;
      }
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          email: cleanEmail,
          socialLink: data.socialLink.trim(),
          bio: data.bio || "Live more. Regret nothing.",
          preferences: data.preferences,
        }),
      });
      const result = await res.json();
      if (res.ok && result?.user) {
        saveUser(result.user);
        setRecentAward({
          amount: 150,
          reason: "Welcome Explorer Bonus! Profile & preferences created.",
          newTotalXp: result.user.xp,
          leveledUp: false,
          timestamp: Date.now(),
        });
        return;
      }
    } catch {}

    // Fallback local creation if offline
    const newUser: UserProfile = {
      id: "usr-" + Date.now().toString(36),
      username: cleanUsername,
      email: cleanEmail,
      socialLink: data.socialLink.trim(),
      bio: data.bio || "Live more. Regret nothing.",
      xp: 150,
      completedTasks: 0,
      spinsCount: 0,
      createdAt: new Date().toISOString(),
      preferences: data.preferences,
      completedEvidences: [],
    };
    saveUser(newUser);

    setRecentAward({
      amount: 150,
      reason: "Welcome Explorer Bonus! Profile & preferences created.",
      newTotalXp: 150,
      leveledUp: false,
      timestamp: Date.now(),
    });
  };

  const logout = () => {
    import("@/lib/firebase")
      .then(({ auth, signOut }) => signOut(auth))
      .catch(() => {});
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    saveUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUser(updated);

    // Sync to Firestore if Firebase is initialized
    if (user.id) {
      import("@/lib/firebase")
        .then(({ db }) => import("firebase/firestore").then(({ doc, setDoc }) => {
          setDoc(doc(db, "users", user.id), data, { merge: true }).catch(() => {});
        }))
        .catch(() => {});
    }

    // Sync to backend
    fetch("/api/user/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({
        userId: user.id,
        ...data,
      }),
    }).catch(() => {});
  };

  const awardXP = (amount: number, reason: string) => {
    if (!user) return;
    const oldXp = user.xp;
    const newXp = oldXp + amount;
    const oldRank = getRankForXp(oldXp);
    const newRank = getRankForXp(newXp);
    const leveledUp = newRank.level > oldRank.level;

    const updated: UserProfile = {
      ...user,
      xp: newXp,
      completedTasks: user.completedTasks + 1,
    };
    saveUser(updated);

    // Sync to backend
    fetch("/api/user/xp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({
        userId: user.id,
        amount,
        reason,
      }),
    }).catch(() => {});

    const event: XpAwardEvent = {
      amount,
      reason,
      newTotalXp: newXp,
      leveledUp,
      newRankName: leveledUp ? newRank.name : undefined,
      timestamp: Date.now(),
    };
    setRecentAward(event);
  };

  const submitEvidence = (evidenceData: Omit<EvidenceSubmission, "id" | "submittedAt">) => {
    if (!user) return;
    const newEvidence: EvidenceSubmission = {
      ...evidenceData,
      id: "ev-" + Date.now().toString(36),
      submittedAt: new Date().toISOString(),
    };

    const oldXp = user.xp;
    const newXp = oldXp + evidenceData.xpEarned;
    const oldRank = getRankForXp(oldXp);
    const newRank = getRankForXp(newXp);
    const leveledUp = newRank.level > oldRank.level;

    const updatedEvidences = [...(user.completedEvidences || []), newEvidence];
    const updated: UserProfile = {
      ...user,
      xp: newXp,
      completedTasks: user.completedTasks + 1,
      completedEvidences: updatedEvidences,
    };
    saveUser(updated);

    // Sync evidence to backend
    fetch("/api/user/evidence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({
        userId: user.id,
        ...evidenceData,
      }),
    }).catch(() => {});

    const event: XpAwardEvent = {
      amount: evidenceData.xpEarned,
      reason: `Verified completion: "${evidenceData.expTitle}" with proof!`,
      newTotalXp: newXp,
      leveledUp,
      newRankName: leveledUp ? newRank.name : undefined,
      timestamp: Date.now(),
    };
    setRecentAward(event);
  };

  const clearRecentAward = () => {
    setRecentAward(null);
  };

  const currentRank = user ? getRankForXp(user.xp) : RANK_TIERS[0];
  const nextRank =
    currentRank.level < RANK_TIERS.length
      ? RANK_TIERS.find((r) => r.level === currentRank.level + 1) ?? null
      : null;

  let xpProgressPercent = 100;
  if (nextRank && user) {
    const range = nextRank.minXp - currentRank.minXp;
    const progress = user.xp - currentRank.minXp;
    xpProgressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
  }

  const getLeaderboard = (): LeaderboardEntry[] => {
    const all = [...COMMUNITY_LEADERBOARD];
    if (user) {
      all.push({
        username: user.username,
        socialLink: user.socialLink,
        avatar: user.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
        xp: user.xp,
        level: currentRank.level,
        rankName: currentRank.name,
        completedTasks: user.completedTasks,
        isCurrentUser: true,
      });
    }

    // Sort descending by XP
    all.sort((a, b) => b.xp - a.xp);

    return all.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isReady,
        currentRank,
        nextRank,
        xpProgressPercent,
        recentAward,
        clearRecentAward,
        login,
        signInWithGoogle,
        register,
        logout,
        updateProfile,
        awardXP,
        submitEvidence,
        getLeaderboard,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
