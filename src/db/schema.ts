import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  mood: varchar("mood", { length: 40 }).notNull(),
  difficulty: integer("difficulty").notNull().default(1), // 1-5
  budget: integer("budget").notNull().default(0), // 0 free, 1 <500, 2 <1000, 3 <5000, 4 10000+
  time: varchar("time", { length: 20 }).notNull().default("1hour"),
  energy: varchar("energy", { length: 20 }).notNull().default("normal"),
  location: varchar("location", { length: 20 }).notNull().default("anywhere"),
  social: varchar("social", { length: 20 }).notNull().default("any"),
  safety: varchar("safety", { length: 20 }).notNull().default("safe"),
  reel: integer("reel").notNull().default(3), // reel potential 1-5
  completions: integer("completions").notNull().default(0),
  trending: boolean("trending").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  tags: text("tags").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  plan: varchar("plan", { length: 30 }).notNull().default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 100 }).primaryKey(),
  username: varchar("username", { length: 60 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  socialLink: text("social_link").notNull().default(""),
  bio: text("bio").notNull().default("Live more. Regret nothing."),
  avatar: text("avatar"),
  xp: integer("xp").notNull().default(150),
  completedTasks: integer("completed_tasks").notNull().default(0),
  spinsCount: integer("spins_count").notNull().default(0),
  preferences: text("preferences"), // JSON stringified UserPreferences
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const evidences = pgTable("evidences", {
  id: varchar("id", { length: 100 }).primaryKey(),
  userId: varchar("user_id", { length: 100 }).notNull().references(() => users.id),
  expId: integer("exp_id").notNull(),
  expTitle: text("exp_title").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  whatYouDid: text("what_you_did").notNull(),
  timeSpent: varchar("time_spent", { length: 50 }).notNull(),
  completedDate: varchar("completed_date", { length: 50 }).notNull(),
  evidenceLink: text("evidence_link").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const customWishes = pgTable("custom_wishes", {
  id: varchar("id", { length: 100 }).primaryKey(),
  userId: varchar("user_id", { length: 100 }).notNull().references(() => users.id),
  title: text("title").notNull(),
  category: varchar("category", { length: 50 }).notNull().default("Personal"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Experience = typeof experiences.$inferSelect;
export type DbUser = typeof users.$inferSelect;
export type DbEvidence = typeof evidences.$inferSelect;
export type DbCustomWish = typeof customWishes.$inferSelect;
