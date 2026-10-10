import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSupabase() {
  console.log("🚀 Starting Supabase Data Seeding for Reel Dare...");

  // 1. Seed Demo Community Users
  const demoUsers = [
    {
      id: "usr-demo-1",
      username: "shaizan",
      display_name: "Shaizan",
      email: "shaizan@reeldare.com",
      social_link: "https://www.instagram.com/shaizan/",
      instagram: "shaizan",
      bio: "Pushing comfort zones daily on Reel Dare.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      accent_color: "#a855f7",
      xp: 4250,
      completed_tasks: 38,
      spins_count: 52,
    },
    {
      id: "usr-demo-2",
      username: "alex_adventures",
      display_name: "Alex Rivera",
      email: "alex@reeldare.com",
      social_link: "https://www.instagram.com/alex_adventures/",
      instagram: "alex_adventures",
      bio: "Never say no to a spontaneous road trip.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      accent_color: "#06b6d4",
      xp: 2900,
      completed_tasks: 24,
      spins_count: 41,
    },
    {
      id: "usr-demo-3",
      username: "maya_creates",
      display_name: "Maya Lin",
      email: "maya@reeldare.com",
      social_link: "https://www.instagram.com/maya_creates/",
      instagram: "maya_creates",
      bio: "Filmmaker, artist, and chaotic memory collector.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
      accent_color: "#ec4899",
      xp: 3450,
      completed_tasks: 31,
      spins_count: 47,
    },
  ];

  console.log("Inserting demo users into 'users' table...");
  const { error: userErr } = await supabase.from("users").upsert(demoUsers, { onConflict: "id" });
  if (userErr) console.warn("Users upsert note:", userErr.message);
  else console.log("✅ Users seeded successfully!");

  // 2. Seed 2,000 Challenges (Shameful Acts + Public Acts)
  try {
    const shameful = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/shameful-acts.json"), "utf8"));
    const publicActs = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/public-acts.json"), "utf8"));
    const allChallenges = [...shameful, ...publicActs];

    console.log(`Seeding ${allChallenges.length} challenges in batches of 200...`);
    const batchSize = 200;
    for (let i = 0; i < allChallenges.length; i += batchSize) {
      const batch = allChallenges.slice(i, i + batchSize).map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        difficulty: c.difficulty,
        duration: c.duration,
        embarrassment_level: c.embarrassment_level,
        social_intensity: c.social_intensity,
        location: c.location,
        requires_consent: c.requires_consent,
        requires_permission: c.requires_permission,
        safety_note: c.safety_note,
        reel_potential: c.reel_potential,
        tags: c.tags,
      }));

      const { error: chErr } = await supabase.from("challenges").upsert(batch, { onConflict: "id" });
      if (chErr) {
        console.warn(`Batch ${i}-${i + batch.length} notice:`, chErr.message);
        break;
      }
      process.stdout.write(`.` );
    }
    console.log("\n✅ Challenges sync completed!");
  } catch (e) {
    console.warn("Challenges seed note:", e.message);
  }

  // 3. Seed Experiences Catalog
  try {
    const { RICH_EXPERIENCES } = await import("./src/lib/experiences-catalog.js").catch(async () => {
      return await import("../src/lib/experiences-catalog.ts");
    });
    if (RICH_EXPERIENCES && Array.isArray(RICH_EXPERIENCES)) {
      console.log(`Seeding ${RICH_EXPERIENCES.length} catalog experiences...`);
      const { error: expErr } = await supabase.from("experiences").upsert(
        RICH_EXPERIENCES.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          category: e.category,
          mood: e.mood,
          difficulty: e.difficulty,
          budget: e.budget,
          time: e.time,
          energy: e.energy,
          location: e.location,
          social: e.social,
          safety: e.safety,
          reel: e.reel,
          completions: e.completions,
          tags: e.tags,
        })),
        { onConflict: "id" }
      );
      if (expErr) console.warn("Experiences upsert note:", expErr.message);
      else console.log("✅ Experiences seeded successfully!");
    }
  } catch (e) {
    console.warn("Experiences catalog seed note:", e.message);
  }

  console.log("\n🎉 Supabase seed routine finished!");
}

seedSupabase().catch(console.error);
