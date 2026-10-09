import { z } from "zod";

/**
 * Basic XSS sanitization: strips HTML tags and controls max length
 */
export function sanitizeString(val: string, maxLength = 1000): string {
  if (typeof val !== "string") return "";
  const cleaned = val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  return cleaned.slice(0, maxLength);
}

// 1. Auth Schemas
export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .max(320, { message: "Email too long" }),
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain alphanumeric characters, underscores, and dashes",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password cannot exceed 128 characters" }),
  socialLink: z
    .string()
    .max(300, { message: "Social link too long" })
    .optional()
    .default(""),
  bio: z
    .string()
    .max(300, { message: "Bio cannot exceed 300 characters" })
    .optional()
    .default("Live more. Regret nothing."),
});

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }).max(320),
  password: z.string().min(1, { message: "Password is required" }).max(128),
});

// 2. Profile Update Schema
export const profileUpdateSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  bio: z.string().max(300).optional(),
  socialLink: z.string().max(300).optional(),
  avatar: z.string().max(500).optional(),
});

// 3. XP Award Schema
export const awardXpSchema = z.object({
  xpEarned: z
    .number()
    .int()
    .min(1, { message: "XP earned must be at least 1" })
    .max(5000, { message: "XP per challenge cannot exceed 5000" }),
  taskTitle: z.string().trim().min(1).max(200).optional(),
  reason: z.string().trim().max(300).optional(),
  expId: z.number().int().optional(),
});

// 4. Evidence / Challenge Proof Submission Schema
export const evidenceSubmitSchema = z.object({
  expId: z.number().int(),
  expTitle: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(50),
  whatYouDid: z.string().trim().min(3).max(1000),
  timeSpent: z.string().trim().min(1).max(50),
  completedDate: z.string().trim().min(1).max(50),
  evidenceLink: z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .refine(
      (val) =>
        /^https?:\/\//i.test(val) ||
        val.startsWith("data:image/") ||
        val.startsWith("blob:"),
      {
        message: "Must provide a valid HTTP/HTTPS URL, image upload, or social link",
      }
    ),
  xpEarned: z.number().int().min(0).max(5000).default(0),
});

// 5. Custom Wish (Bucket List item) Schema
export const customWishSchema = z.object({
  title: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(50).default("Personal"),
});

// 6. Admin User Edit Schema
export const adminUserUpdateSchema = z.object({
  userId: z.string().min(1).max(100),
  username: z.string().trim().min(3).max(30).optional(),
  email: z.string().trim().email().max(320).optional(),
  xp: z.number().int().min(0).max(1000000).optional(),
  completedTasks: z.number().int().min(0).max(10000).optional(),
  bio: z.string().max(300).optional(),
  socialLink: z.string().max(300).optional(),
});
