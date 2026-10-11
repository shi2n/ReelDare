import { db, hasDb, pool } from "@/db";
import { users, evidences, customWishes } from "@/db/schema";
import { eq, desc, or } from "drizzle-orm";
import fs from "fs";
import path from "path";

export interface BackendUser {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  passwordHash?: string | null;
  socialLink: string;
  instagram?: string;
  bio: string;
  avatar?: string;
  accentColor?: string;
  xp: number;
  completedTasks: number;
  spinsCount: number;
  preferences?: string | null; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface BackendEvidence {
  id: string;
  userId: string;
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

export interface BackendCustomWish {
  id: string;
  userId: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

// In-memory / file fallback store
interface StoreData {
  users: Record<string, BackendUser>;
  evidences: BackendEvidence[];
  wishes: BackendCustomWish[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "user-store.json");

let memoryStore: StoreData = {
  users: {},
  evidences: [],
  wishes: [],
};

// Seed initial memory store if file exists
function loadLocalStore(): StoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return memoryStore;
}

function saveLocalStore(data: StoreData) {
  memoryStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // In restricted serverless environments, in-memory cache remains active
  }
}

memoryStore = loadLocalStore();

let tablesChecked = false;
async function ensureDbTables() {
  if (!hasDb || tablesChecked) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(60) NOT NULL UNIQUE,
        email VARCHAR(320) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        social_link TEXT NOT NULL DEFAULT '',
        bio TEXT NOT NULL DEFAULT 'Live more. Regret nothing.',
        avatar TEXT,
        xp INTEGER NOT NULL DEFAULT 150,
        completed_tasks INTEGER NOT NULL DEFAULT 0,
        spins_count INTEGER NOT NULL DEFAULT 0,
        preferences TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS evidences (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        exp_id INTEGER NOT NULL,
        exp_title TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        what_you_did TEXT NOT NULL,
        time_spent VARCHAR(50) NOT NULL,
        completed_date VARCHAR(50) NOT NULL,
        evidence_link TEXT NOT NULL,
        xp_earned INTEGER NOT NULL DEFAULT 0,
        submitted_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS custom_wishes (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'Personal',
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    tablesChecked = true;
  } catch (err) {
    console.warn("Could not auto-create db tables, falling back gracefully:", err);
  }
}

// ---------------- USER OPERATIONS ----------------

export async function findUserById(id: string): Promise<BackendUser | null> {
    

  // 1. Try direct PostgreSQL / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (rows.length > 0) {
        const u = rows[0];
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          passwordHash: u.passwordHash,
          socialLink: u.socialLink,
          bio: u.bio,
          avatar: u.avatar ?? undefined,
          xp: u.xp,
          completedTasks: u.completedTasks,
          spinsCount: u.spinsCount,
          preferences: u.preferences,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString(),
        };
      }
    } catch {}
  }

  return memoryStore.users[id] ?? null;
}

export async function findUserByEmailOrUsername(identifier: string): Promise<BackendUser | null> {
  const clean = identifier.trim().toLowerCase();

    

  // 1. Try direct PostgreSQL / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      const rows = await db
        .select()
        .from(users)
        .where(or(eq(users.email, clean), eq(users.username, clean)))
        .limit(1);
      if (rows.length > 0) {
        const u = rows[0];
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          passwordHash: u.passwordHash,
          socialLink: u.socialLink,
          bio: u.bio,
          avatar: u.avatar ?? undefined,
          xp: u.xp,
          completedTasks: u.completedTasks,
          spinsCount: u.spinsCount,
          preferences: u.preferences,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString(),
        };
      }
    } catch {}
  }

  const found = Object.values(memoryStore.users).find(
    (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
  );
  return found ?? null;
}

export async function createBackendUser(data: {
  username: string;
  email: string;
  passwordHash?: string;
  socialLink?: string;
  bio?: string;
  avatar?: string;
  preferences?: any;
}): Promise<BackendUser> {
  const id = "usr-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const prefStr = data.preferences ? JSON.stringify(data.preferences) : null;

  const newUser: BackendUser = {
    id,
    username: data.username.trim().toLowerCase().replace(/\s+/g, "_"),
    email: data.email.trim().toLowerCase(),
    passwordHash: data.passwordHash || null,
    socialLink: data.socialLink || "",
    bio: data.bio || "Live more. Regret nothing.",
    avatar: data.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
    xp: 150,
    completedTasks: 0,
    spinsCount: 0,
    preferences: prefStr,
    createdAt: now,
    updatedAt: now,
  };

    

  // 2. Sync to Postgres / Drizzle if available
  if (hasDb) {
    try {
      await ensureDbTables();
      await db.insert(users).values({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        passwordHash: newUser.passwordHash,
        socialLink: newUser.socialLink,
        bio: newUser.bio,
        avatar: newUser.avatar,
        xp: newUser.xp,
        completedTasks: newUser.completedTasks,
        spinsCount: newUser.spinsCount,
        preferences: newUser.preferences,
      });
    } catch (e) {
      console.warn("DB user creation fallback:", e);
    }
  }

  memoryStore.users[newUser.id] = newUser;
  saveLocalStore(memoryStore);
  return newUser;
}

export async function updateBackendUser(
  id: string,
  updates: Partial<Omit<BackendUser, "id" | "createdAt">>
): Promise<BackendUser | null> {
  const current = await findUserById(id);
  if (!current) return null;

  const now = new Date().toISOString();
  const updated: BackendUser = {
    ...current,
    ...updates,
    updatedAt: now,
  };

    

  // 2. Sync to Postgres / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      await db
        .update(users)
        .set({
          username: updated.username,
          email: updated.email,
          socialLink: updated.socialLink,
          bio: updated.bio,
          avatar: updated.avatar,
          xp: updated.xp,
          completedTasks: updated.completedTasks,
          spinsCount: updated.spinsCount,
          preferences: updated.preferences,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
    } catch (e) {
      console.warn("DB user update fallback:", e);
    }
  }

  memoryStore.users[id] = updated;
  saveLocalStore(memoryStore);
  return updated;
}

// ---------------- EVIDENCE OPERATIONS ----------------

export async function addBackendEvidence(data: {
  userId: string;
  expId: number;
  expTitle: string;
  category: string;
  whatYouDid: string;
  timeSpent: string;
  completedDate: string;
  evidenceLink: string;
  xpEarned: number;
}): Promise<BackendEvidence> {
  const id = "ev-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const newEv: BackendEvidence = {
    id,
    userId: data.userId,
    expId: data.expId,
    expTitle: data.expTitle,
    category: data.category,
    whatYouDid: data.whatYouDid,
    timeSpent: data.timeSpent,
    completedDate: data.completedDate,
    evidenceLink: data.evidenceLink,
    xpEarned: data.xpEarned,
    submittedAt: now,
  };

    

  // 2. Sync to Postgres / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      await db.insert(evidences).values({
        id: newEv.id,
        userId: newEv.userId,
        expId: newEv.expId,
        expTitle: newEv.expTitle,
        category: newEv.category,
        whatYouDid: newEv.whatYouDid,
        timeSpent: newEv.timeSpent,
        completedDate: newEv.completedDate,
        evidenceLink: newEv.evidenceLink,
        xpEarned: newEv.xpEarned,
      });
    } catch (e) {
      console.warn("DB evidence insert fallback:", e);
    }
  }

  memoryStore.evidences.unshift(newEv);
  saveLocalStore(memoryStore);

  // Automatically increment user XP and completedTasks
  const user = await findUserById(data.userId);
  if (user) {
    await updateBackendUser(user.id, {
      xp: user.xp + data.xpEarned,
      completedTasks: user.completedTasks + 1,
    });
  }

  return newEv;
}

export async function getUserEvidences(userId: string): Promise<BackendEvidence[]> {
    

  // 1. Try Postgres / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      const rows = await db
        .select()
        .from(evidences)
        .where(eq(evidences.userId, userId))
        .orderBy(desc(evidences.submittedAt));
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          userId: r.userId,
          expId: r.expId,
          expTitle: r.expTitle,
          category: r.category,
          whatYouDid: r.whatYouDid,
          timeSpent: r.timeSpent,
          completedDate: r.completedDate,
          evidenceLink: r.evidenceLink,
          xpEarned: r.xpEarned,
          submittedAt: r.submittedAt.toISOString(),
        }));
      }
    } catch {}
  }

  return memoryStore.evidences.filter((e) => e.userId === userId);
}

// ---------------- CUSTOM WISHES OPERATIONS ----------------

export async function getUserCustomWishes(userId: string): Promise<BackendCustomWish[]> {
    

  // 1. Try Postgres / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      const rows = await db
        .select()
        .from(customWishes)
        .where(eq(customWishes.userId, userId))
        .orderBy(desc(customWishes.createdAt));
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          userId: r.userId,
          title: r.title,
          category: r.category,
          completed: r.completed,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch {}
  }

  return memoryStore.wishes.filter((w) => w.userId === userId);
}

export async function addBackendCustomWish(data: {
  userId: string;
  title: string;
  category?: string;
}): Promise<BackendCustomWish> {
  const id = "wish-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const item: BackendCustomWish = {
    id,
    userId: data.userId,
    title: data.title.trim(),
    category: data.category || "Personal",
    completed: false,
    createdAt: now,
  };

    

  // 2. Sync to Postgres / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      await db.insert(customWishes).values({
        id: item.id,
        userId: item.userId,
        title: item.title,
        category: item.category,
        completed: item.completed,
      });
    } catch (e) {
      console.warn("DB wish insert fallback:", e);
    }
  }

  memoryStore.wishes.unshift(item);
  saveLocalStore(memoryStore);
  return item;
}

export async function toggleBackendCustomWish(wishId: string): Promise<BackendCustomWish | null> {
  const existing = memoryStore.wishes.find((w) => w.id === wishId);
  const nextCompleted = existing ? !existing.completed : true;

    

  // 2. Sync to Postgres / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      await db
        .update(customWishes)
        .set({ completed: nextCompleted })
        .where(eq(customWishes.id, wishId));
    } catch (e) {
      console.warn("DB wish toggle fallback:", e);
    }
  }

  if (existing) {
    existing.completed = nextCompleted;
    saveLocalStore(memoryStore);
    return existing;
  }
  return null;
}

export async function deleteBackendCustomWish(wishId: string): Promise<boolean> {
    

  // 2. Sync to Postgres / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      await db.delete(customWishes).where(eq(customWishes.id, wishId));
    } catch (e) {
      console.warn("DB wish delete fallback:", e);
    }
  }

  const prevLen = memoryStore.wishes.length;
  memoryStore.wishes = memoryStore.wishes.filter((w) => w.id !== wishId);
  if (memoryStore.wishes.length !== prevLen) {
    saveLocalStore(memoryStore);
    return true;
  }
  return false;
}

// ---------------- GLOBAL LEADERBOARD ----------------

export async function getBackendLeaderboard(limit: number = 20): Promise<BackendUser[]> {
    

  // 1. Try Postgres / Drizzle
  if (hasDb) {
    try {
      await ensureDbTables();
      const rows = await db
        .select()
        .from(users)
        .orderBy(desc(users.xp))
        .limit(limit);
      if (rows.length > 0) {
        return rows.map((u) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          socialLink: u.socialLink,
          bio: u.bio,
          avatar: u.avatar ?? undefined,
          xp: u.xp,
          completedTasks: u.completedTasks,
          spinsCount: u.spinsCount,
          preferences: u.preferences,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString(),
        }));
      }
    } catch {}
  }

  return Object.values(memoryStore.users)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, limit);
}

// ---------------- ADMIN MANAGEMENT OPERATIONS ----------------

export async function getAllUsersAdmin(): Promise<BackendUser[]> {
    

  // 1. Try Postgres
  if (hasDb) {
    try {
      await ensureDbTables();
      const rows = await db.select().from(users).orderBy(desc(users.createdAt));
      if (rows.length > 0) {
        return rows.map((u) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          socialLink: u.socialLink,
          bio: u.bio,
          avatar: u.avatar ?? undefined,
          xp: u.xp,
          completedTasks: u.completedTasks,
          spinsCount: u.spinsCount,
          preferences: u.preferences,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString(),
        }));
      }
    } catch {}
  }

  return Object.values(memoryStore.users).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getAllEvidencesAdmin(): Promise<BackendEvidence[]> {
  

  if (hasDb) {
    try {
      await ensureDbTables();
      const rows = await db.select().from(evidences).orderBy(desc(evidences.submittedAt));
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          userId: r.userId,
          expId: r.expId,
          expTitle: r.expTitle,
          category: r.category,
          whatYouDid: r.whatYouDid,
          timeSpent: r.timeSpent,
          completedDate: r.completedDate,
          evidenceLink: r.evidenceLink,
          xpEarned: r.xpEarned,
          submittedAt: r.submittedAt.toISOString(),
        }));
      }
    } catch {}
  }

  return memoryStore.evidences;
}

export async function getAllWishesAdmin(): Promise<BackendCustomWish[]> {
  

  if (hasDb) {
    try {
      await ensureDbTables();
      const rows = await db.select().from(customWishes).orderBy(desc(customWishes.createdAt));
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          userId: r.userId,
          title: r.title,
          category: r.category,
          completed: r.completed,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch {}
  }

  return memoryStore.wishes;
}

export async function deleteBackendUser(userId: string): Promise<boolean> {
  

  if (hasDb) {
    try {
      await ensureDbTables();
      await db.delete(users).where(eq(users.id, userId));
    } catch (e) {
      console.warn("Postgres user delete fallback:", e);
    }
  }

  delete memoryStore.users[userId];
  memoryStore.evidences = memoryStore.evidences.filter((e) => e.userId !== userId);
  memoryStore.wishes = memoryStore.wishes.filter((w) => w.userId !== userId);
  saveLocalStore(memoryStore);
  return true;
}

