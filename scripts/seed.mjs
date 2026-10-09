// Seed script: populates the experiences table with 2,000+ real experiences.
// Run with: node scripts/seed.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import pg from "pg";

const { Pool } = pg;

// --- load DATABASE_URL from .env (fallback to default sandbox DSN) ---
function loadEnv() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();
const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

// --- deterministic PRNG so reseeds are stable ---
let seedState = 1337;
function rnd() {
  seedState = (seedState * 1664525 + 1013904223) % 4294967296;
  return seedState / 4294967296;
}
function pick(arr) {
  return arr[Math.floor(rnd() * arr.length)];
}
function pickInt(min, max) {
  return min + Math.floor(rnd() * (max - min + 1));
}

const seen = new Set();
const rows = [];

// time slots: 10min 30min 1hour 3hours halfday day weekend multi
function add(row) {
  const key = row.title.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  rows.push({
    mood: "fun",
    difficulty: 2,
    budget: 0,
    time: "1hour",
    energy: "normal",
    location: "anywhere",
    social: "any",
    safety: "safe",
    reel: pickInt(2, 5),
    completions: pickInt(40, 3200),
    trending: false,
    featured: false,
    tags: "",
    ...row,
  });
}

/* ------------------------------------------------------------------ */
/* CURATED EXPERIENCES (hand-written)                                  */
/* [title, description, diff, budget, time, energy, location, social] */
/* ------------------------------------------------------------------ */

const travel = [
  ["Sleep under the stars", "Find a safe open spot, count constellations, and let the sky be your ceiling for one night.", 2, 0, "day", "low", "outdoor", "alone"],
  ["Travel alone to a city you've never visited", "Solo travel changes how you see yourself. Book it, go, figure it out.", 3, 3, "weekend", "normal", "travel", "alone"],
  ["Take a train to a random destination", "Pick the next departing train and get off somewhere you can't pronounce.", 3, 2, "day", "normal", "travel", "any"],
  ["Watch the sunrise somewhere new", "Wake before dawn, find a horizon you've never watched light up, and just be there.", 1, 0, "3hours", "low", "outdoor", "any"],
  ["Take an unplanned road trip", "Fill the tank, skip the itinerary, and let the road make the decisions.", 3, 2, "weekend", "normal", "travel", "friends"],
  ["Go camping for a night", "One tent, one fire, zero notifications. Relearn how quiet the world is.", 3, 1, "day", "normal", "outdoor", "any"],
  ["Visit a desert at least once", "Stand in a landscape with no buildings and hear what silence sounds like.", 4, 3, "multi", "active", "travel", "any"],
  ["Walk a city with no map or phone", "Navigate by smell, sound and curiosity. Get lost on purpose.", 2, 0, "3hours", "normal", "city", "alone"],
  ["Stay in a village homestay", "Eat what the family eats, sleep where they sleep, learn their rhythm.", 3, 2, "weekend", "low", "travel", "any"],
  ["Swim in the ocean at sunrise", "Cold water, golden light, absolute beginner's luck on the waves.", 2, 0, "3hours", "active", "outdoor", "any"],
  ["Ride a night bus across a state line", "Window seat, headphones, strangers' stories, and a new city by morning.", 2, 1, "day", "low", "travel", "alone"],
  ["Visit 10 cities you've never been to", "A lifetime quest: ten brand-new dots on your personal map.", 4, 4, "multi", "normal", "travel", "any"],
  ["Climb to the highest point in your city", "Rooftop, hill, tower — legally. Then look at your life from above.", 2, 0, "3hours", "normal", "city", "any"],
  ["Take a solo sunrise hike", "Headlamp, trail, thermos. Watch the world boot up.", 3, 0, "halfday", "active", "outdoor", "alone"],
  ["Learn to ride a motorbike", "Proper lessons, proper gear, proper respect. Freedom has an engine.", 4, 3, "multi", "active", "city", "any"],
  ["Chase a waterfall", "Find the nearest waterfall, hike to it, and stand close enough to get sprayed.", 3, 1, "day", "active", "outdoor", "any"],
];
const physical = [
  ["Run a half marathon", "21.1 km of negotiation with yourself. Train smart, taper, then finish.", 4, 1, "multi", "extreme", "outdoor", "any"],
  ["Run a full marathon", "The distance that turns 'I could never' into a medal around your neck.", 5, 2, "multi", "extreme", "outdoor", "any"],
  ["Learn swimming", "The most useful fear to delete. Take lessons, take your time.", 3, 1, "multi", "normal", "outdoor", "any"],
  ["Learn basic self-defence", "A few weekends with a qualified instructor, a lifetime of quiet confidence.", 3, 2, "weekend", "active", "city", "any"],
  ["Complete a 30-day fitness challenge", "Thirty mornings of showing up before your excuses wake up.", 3, 0, "multi", "active", "home", "alone"],
  ["Hike a mountain", "One summit, however small, teaches you what 'one more step' means.", 4, 2, "day", "active", "outdoor", "any"],
  ["Walk 30,000 steps in one day", "Eat breakfast, point your shoes somewhere, and don't stop till the number hits.", 3, 0, "day", "active", "city", "any"],
  ["Try a sport you've never played", "Borrow the gear, find a beginners' session, be gloriously bad at first.", 2, 1, "3hours", "active", "outdoor", "strangers"],
  ["Do 100 push-ups in a single day", "Break it into sets, break the idea that you can't.", 2, 0, "day", "active", "home", "alone"],
  ["Hold a 3-minute plank", "Seconds will feel like hours. Win anyway.", 2, 0, "30min", "active", "home", "alone"],
  ["Cycle 50 kilometres in a day", "Two wheels, one long playlist, and legs that will remember this.", 3, 0, "day", "active", "outdoor", "any"],
  ["Wake up at 5 AM for 30 days", "Own the quietest hours and watch your days stretch.", 3, 0, "multi", "normal", "home", "alone"],
  ["Do a cold shower for 7 days", "Thirty seconds of discomfort, a week of feeling unstoppable.", 2, 0, "multi", "normal", "home", "alone"],
  ["Learn to dance like nobody's grading you", "Take one class of a style you've never tried. Sweat counts as applause.", 2, 1, "3hours", "active", "city", "strangers"],
  ["Try bouldering at a climbing gym", "Puzzle-solving with your whole body, three metres off a soft mat.", 3, 1, "3hours", "active", "city", "any"],
  ["Finish a local 10K run", "The gateway distance. Sign up before you feel ready.", 3, 1, "multi", "active", "outdoor", "any"],
];
const create = [
  ["Make a short film", "Three minutes, one phone, one story. Premiere it for five friends.", 4, 1, "weekend", "normal", "anywhere", "friends"],
  ["Write a book", "Even a bad first draft puts you ahead of everyone who meant to.", 5, 0, "multi", "lazy", "home", "alone"],
  ["Make a song", "Hummed into a voice note counts. Recorded and shared counts double.", 4, 0, "weekend", "normal", "home", "alone"],
  ["Write a rap about your city", "Sixteen bars of local pride. Bonus: perform it at an open mic.", 3, 0, "3hours", "normal", "anywhere", "alone"],
  ["Create a photo documentary of your street", "One street, thirty honest frames, a story nobody else noticed.", 3, 0, "day", "low", "city", "alone"],
  ["Paint something and hang it on your wall", "It doesn't have to be good. It has to be yours.", 2, 1, "3hours", "lazy", "home", "any"],
  ["Build something with your hands", "Shelf, bench, birdhouse — sawdust is a seasoning for the soul.", 3, 1, "day", "normal", "home", "any"],
  ["Make your first Reel", "Forty seconds, one idea, zero overthinking. Post it.", 2, 0, "1hour", "lazy", "home", "alone"],
  ["Start a YouTube channel", "Upload video one. It's allowed to be rough — everyone starts at zero views.", 3, 0, "weekend", "normal", "home", "alone"],
  ["Write a poem about someone you love", "Then give it to them. Watching them read it is the masterpiece.", 2, 0, "1hour", "lazy", "home", "alone"],
  ["Create something that gets 1 million views", "A ridiculous goal with real lessons inside. Start today, iterate forever.", 5, 0, "multi", "normal", "home", "alone"],
  ["Record a podcast episode", "One mic, one opinion, thirty minutes of your actual voice.", 3, 0, "3hours", "lazy", "home", "one"],
  ["Design and print a poster", "Make the poster your wall always needed, then hang it proudly.", 3, 1, "day", "lazy", "home", "alone"],
  ["Cook an entire meal from memory and instinct", "No recipes. Taste as you go. Feast like a pirate with a spice rack.", 3, 1, "3hours", "normal", "home", "any"],
  ["Make a stop-motion video", "Move the props one frame at a time and bring inanimate things to life.", 3, 0, "3hours", "lazy", "home", "any"],
  ["Write 12 letters to 12 people who shaped you", "Twelve envelopes of gratitude. Post them all in one afternoon.", 2, 1, "day", "lazy", "home", "alone"],
];
const fun = [
  ["Eat breakfast for dinner", "Pancakes at 8 PM. Nobody can stop you. That's the whole point.", 1, 1, "1hour", "lazy", "home", "any"],
  ["Wear something ridiculous for one full day", "Mismatched shoes, a cape, a tiara — own it like high fashion.", 2, 0, "day", "normal", "city", "friends"],
  ["Learn a magic trick in 30 minutes", "One card trick, endlessly performed at every gathering forever.", 2, 0, "30min", "lazy", "home", "alone"],
  ["Order something you've never eaten", "Point at the menu item you can't pronounce. Adventure à la carte.", 1, 1, "1hour", "lazy", "city", "any"],
  ["Visit the most unusual shop in your city", "Every city hides a shop that sells only one strange thing. Find it.", 2, 0, "3hours", "low", "city", "any"],
  ["Take yourself on a café date", "One table, one book, one excellent hot chocolate. Dress up for you.", 1, 1, "1hour", "lazy", "city", "alone"],
  ["Watch a movie alone in a cinema", "No shared armrest negotiations. Just you and the big screen.", 1, 1, "3hours", "lazy", "city", "alone"],
  ["Let a friend choose your entire day", "Hand over every decision for 12 hours. Say yes to (almost) everything.", 3, 1, "day", "normal", "anywhere", "friends"],
  ["Have a picnic on your living-room floor", "Blanket, basket, fairy lights. Five-star dining, zero dress code.", 1, 1, "1hour", "lazy", "home", "any"],
  ["Try a blindfolded food tasting", "Guess five flavours blindfolded. Loser does the dishes.", 2, 1, "1hour", "lazy", "home", "friends"],
  ["Rearrange one entire room", "Move the sofa, change the light, trick your brain into a fresh start.", 2, 0, "3hours", "normal", "home", "any"],
  ["Spend an evening playing board games", "Gather humans, roll dice, accuse each other of treachery lovingly.", 1, 1, "3hours", "lazy", "home", "friends"],
  ["Do karaoke sober and mean it", "Pick the power ballad. Commit like the rent depends on it.", 3, 1, "3hours", "normal", "city", "friends"],
  ["Make a fort and watch a film inside it", "Architectural peak: blankets, chairs, snacks, and a movie marathon.", 1, 0, "3hours", "lazy", "home", "any"],
  ["Try every flavour of a street food stall", "Rate them, rank them, crown a champion. Take notes like a critic.", 2, 1, "3hours", "normal", "city", "friends"],
  ["Learn to juggle three objects", "Drop them ninety-nine times. Catch them the hundredth. Legend.", 2, 0, "1hour", "normal", "anywhere", "alone"],
];
const crazy = [
  ["Talk to 10 strangers in one day", "Ask genuine questions, listen, and collect ten tiny human stories.", 4, 0, "day", "active", "city", "alone"],
  ["Perform on a stage", "Open mic, community theatre, karaoke finals — stand where people can see you.", 4, 1, "3hours", "active", "city", "strangers"],
  ["Spend an entire day without social media", "Log out at midnight, log back in a different person.", 2, 0, "day", "lazy", "anywhere", "alone"],
  ["Go somewhere completely alone", "Dinner, movie, museum — prove that your own company is good company.", 2, 1, "3hours", "low", "city", "alone"],
  ["Try something you've been scared to try", "Name one fear, book one beginner session, breathe, begin.", 4, 2, "day", "active", "anywhere", "any"],
  ["Say yes to a new experience you'd normally refuse", "Within reason, safety and the law — say yes, then show up.", 3, 1, "day", "normal", "anywhere", "any"],
  ["Ask someone a question you've never dared to ask", "Respectfully. Then actually listen to the whole answer.", 3, 0, "30min", "low", "anywhere", "one"],
  ["Applaud a street performer like they headlined a stadium", "Single-handedly restore someone's faith in humanity for a minute.", 1, 1, "30min", "normal", "city", "strangers"],
  ["Compliment 5 strangers sincerely", "Five honest, specific compliments. Watch five faces light up.", 3, 0, "3hours", "normal", "city", "alone"],
  ["Spend a day speaking only in questions", "Surprisingly hard, unexpectedly hilarious. Waiters will remember you.", 4, 0, "day", "normal", "city", "friends"],
  ["Dance in public to music only you can hear", "Ten seconds of freedom in the middle of an ordinary afternoon.", 4, 0, "10min", "normal", "city", "alone"],
  ["Introduce yourself to a neighbour you've never spoken to", "They've lived ten metres away for years. Time to fix that.", 2, 0, "30min", "low", "home", "alone"],
];
const growth = [
  ["Learn a new language for 30 days", "Fifteen minutes a day. End the month able to order dinner somewhere far away.", 3, 0, "multi", "lazy", "home", "alone"],
  ["Read 10 books this year", "Ten lives borrowed through ten spines. Track them, feel smarter.", 3, 1, "multi", "lazy", "home", "alone"],
  ["Learn to cook 10 signature dishes", "Ten dishes you could serve anyone, anywhere, proud.", 3, 2, "multi", "normal", "home", "alone"],
  ["Learn a skill in 30 days", "Pick one skill, practise daily, film day 1 and day 30. Post the difference.", 3, 0, "multi", "normal", "anywhere", "alone"],
  ["Spend 24 hours without your phone", "Leave it in a drawer. Rediscover boredom — the birthplace of ideas.", 3, 0, "day", "lazy", "anywhere", "alone"],
  ["Take a public-speaking class", "The fear that ranks above death. Defeat it with a mic and a smile.", 4, 2, "weekend", "normal", "city", "strangers"],
  ["Learn basic financial literacy", "Budgets, compounding, index funds — the boring magic that frees your life.", 3, 0, "weekend", "lazy", "home", "alone"],
  ["Write morning pages for 30 days", "Three messy pages before the world wakes up. Meet your own mind.", 2, 0, "multi", "lazy", "home", "alone"],
  ["Learn to type with all ten fingers", "A one-week upgrade you'll use for thousands of hours.", 2, 0, "multi", "lazy", "home", "alone"],
  ["Memorise a poem you love", "Keep one beautiful thing in permanent memory, recallable anywhere.", 2, 0, "weekend", "lazy", "anywhere", "alone"],
  ["Take an online course and actually finish it", "Pick the course gathering dust. Finish it. Screenshot the certificate.", 3, 1, "multi", "lazy", "home", "alone"],
  ["Learn to solve a Rubik's cube", "Memorise the moves, then casually flex at every gathering.", 3, 1, "weekend", "lazy", "home", "alone"],
  ["Teach someone a skill you have", "Teaching doubles mastery. Pick your best trick and transfer it.", 3, 0, "3hours", "normal", "anywhere", "one"],
  ["Read the biography of someone you admire", "Borrow a life for a weekend and steal their best habits.", 2, 1, "weekend", "lazy", "home", "alone"],
];
const family = [
  ["Take your parents on a trip", "Reverse the roles. You plan, you pay, they finally relax.", 4, 4, "multi", "low", "travel", "family"],
  ["Buy your mother something meaningful", "Not expensive — meaningful. The thing she mentioned once, years ago.", 2, 2, "3hours", "low", "city", "alone"],
  ["Spend a full day with your father", "No agenda, no phones. Just his stories and your full attention.", 1, 1, "day", "lazy", "anywhere", "family"],
  ["Interview your grandparents", "Record their voices telling the family history. Future you will cry grateful tears.", 2, 0, "3hours", "lazy", "home", "family"],
  ["Recreate an old family photograph", "Same poses, same spot, twenty years later. Frame them side by side.", 2, 1, "day", "normal", "anywhere", "family"],
  ["Record your parents' life stories", "Twenty questions, one camera, and the documentary only you can make.", 3, 0, "day", "lazy", "home", "family"],
  ["Write a letter to someone important", "Say the unsaid things in ink. Letters outlive phones.", 1, 0, "1hour", "lazy", "home", "alone"],
  ["Cook the dish your grandmother used to make", "Call her for the recipe first. That call matters as much as the meal.", 2, 1, "3hours", "normal", "home", "family"],
  ["Have dinner with your entire family", "Everyone at one table, phones in another room, one long evening.", 2, 2, "3hours", "lazy", "home", "family"],
  ["Plant a tree with someone you love", "Dig the hole together. Visit the tree every year after.", 2, 1, "3hours", "normal", "outdoor", "family"],
  ["Frame a photo you forgot existed", "Rescue one memory from a shoebox and put it on a wall.", 2, 1, "1hour", "lazy", "home", "any"],
  ["Make a family recipe book", "Collect the unwritten recipes before they're lost. Type, print, bind.", 3, 1, "weekend", "lazy", "home", "family"],
];
const kindness = [
  ["Feed 100 people", "Organize a meal for a hundred strangers. The math of meaning.", 4, 4, "day", "active", "city", "friends"],
  ["Donate clothes you don't wear", "Empty half your cupboard, fill someone else's winter.", 1, 0, "3hours", "normal", "home", "alone"],
  ["Donate blood if you're eligible", "One hour of your day, up to three lives saved. Check eligibility first.", 2, 0, "1hour", "low", "city", "alone"],
  ["Help a struggling family", "Groceries, school fees, or simply your time — quietly, without cameras.", 3, 3, "day", "normal", "city", "alone"],
  ["Feed stray animals for a week", "Seven days of being the best part of a street dog's life.", 1, 1, "multi", "normal", "city", "any"],
  ["Perform 10 anonymous acts of kindness", "No name, no credit, no posts. Just ten quiet good deeds.", 3, 2, "day", "normal", "city", "alone"],
  ["Volunteer for a full day", "Shelter, cleanup, classroom — show up and do whatever's needed.", 2, 0, "day", "active", "city", "strangers"],
  ["Pay for a stranger's meal", "Leave the money before they know. Exit like a superhero.", 1, 1, "30min", "lazy", "city", "alone"],
  ["Leave a thank-you note for a delivery rider", "Gratitude, handwritten, where they least expect it.", 1, 0, "10min", "lazy", "anywhere", "alone"],
  ["Clean up a corner of your neighbourhood", "One bag of litter, one prouder street.", 2, 0, "1hour", "normal", "outdoor", "any"],
  ["Sponsor a child's school supplies", "Notebooks and pencils that quietly rewrite a kid's year.", 2, 2, "1hour", "lazy", "city", "alone"],
  ["Give your books to a local library", "Stories you've finished, given a second life.", 1, 0, "1hour", "low", "city", "alone"],
  ["Call an old friend who might be lonely", "Fifteen minutes of your evening could be the best part of their week.", 1, 0, "30min", "lazy", "anywhere", "alone"],
  ["Help someone learn a skill you have", "Free lessons, genuine patience, multiplying what you know.", 2, 0, "3hours", "normal", "anywhere", "one"],
  ["Write a positive review for a small business", "Two minutes for you; rent money of goodwill for them.", 1, 0, "10min", "lazy", "home", "alone"],
];
const money = [
  ["Start a business from zero", "One problem, one offer, one paying stranger. That's a business.", 5, 2, "multi", "active", "anywhere", "any"],
  ["Make your first ₹1,000 online", "Freelance, sell, tutor — the first thousand rewires your brain forever.", 4, 0, "weekend", "normal", "home", "alone"],
  ["Build something people will pay for", "A tiny product solving a tiny pain for a tiny crowd. It counts.", 4, 1, "multi", "normal", "home", "alone"],
  ["Launch a product in one weekend", "Friday idea, Saturday build, Sunday launch. Ship something real.", 4, 1, "weekend", "normal", "home", "alone"],
  ["Sell something you created", "Bake it, paint it, print it, code it — then put a price tag on it.", 3, 1, "weekend", "normal", "market", "alone"],
  ["Interview an entrepreneur", "Ask them the ten questions you wish someone asked you.", 2, 0, "1hour", "low", "anywhere", "one"],
  ["Build a business without spending money", "Constraint breeds creativity. Zero capital, pure hustle.", 5, 0, "multi", "active", "anywhere", "any"],
  ["Sell five things you no longer use", "Declutter and get paid for it. First step: list them today.", 2, 0, "weekend", "lazy", "home", "alone"],
  ["Negotiate one bill down", "One phone call, ten minutes of politeness, real monthly savings.", 2, 0, "30min", "lazy", "home", "alone"],
  ["Track every rupee you spend for 30 days", "Brutal honesty in a spreadsheet. Watch your habits confess.", 2, 0, "multi", "lazy", "anywhere", "alone"],
  ["Create a stream of income that works while you sleep", "Ebook, template, course, print — build once, earn forever.", 5, 1, "multi", "normal", "home", "alone"],
  ["Pitch an idea to a stranger", "Not for money — for the rep. Watch your voice stop shaking.", 4, 0, "30min", "normal", "city", "alone"],
];
const spiritual = [
  ["Spend a day in silence", "No talking, no scrolling. Listen to the noise inside you quiet down.", 3, 0, "day", "lazy", "anywhere", "alone"],
  ["Visit a place that feels sacred to you", "Temple, forest, ocean bench — go where your chest unclenches.", 2, 1, "day", "low", "outdoor", "alone"],
  ["Write down everything you're grateful for", "Keep going until the list embarrasses you with its length.", 1, 0, "30min", "lazy", "home", "alone"],
  ["Spend a sunset doing absolutely nothing", "Just sit and watch the sky change playlists.", 1, 0, "1hour", "lazy", "outdoor", "any"],
  ["Write a letter to your future self", "Seal it, date it, hide it somewhere you'll find in five years.", 1, 0, "1hour", "lazy", "home", "alone"],
  ["Meditate for 10 minutes daily for a month", "Sit, breathe, get distracted, return. That's the whole practice.", 2, 0, "multi", "lazy", "home", "alone"],
  ["Reflect on what you want your life to mean", "One notebook, one honest afternoon, one big question.", 2, 0, "3hours", "lazy", "anywhere", "alone"],
  ["Volunteer anonymously", "Help somewhere and tell absolutely no one. Not even the internet.", 2, 0, "day", "normal", "city", "alone"],
  ["Take a long walk with no destination", "The Japanese call it a purposeless walk. Your mind calls it maintenance.", 1, 0, "1hour", "low", "outdoor", "alone"],
  ["Watch the moon for an hour", "Sit outside and actually look up. Free since forever.", 1, 0, "1hour", "lazy", "outdoor", "any"],
  ["Forgive someone, quietly, in your own heart", "No phone call required. Just put the weight down.", 3, 0, "30min", "lazy", "anywhere", "alone"],
  ["Keep a gratitude jar for one year", "One folded note a week. Open all fifty-two next December.", 1, 0, "multi", "lazy", "home", "alone"],
];
const weird = [
  ["Eat only foods of one colour for a day", "Orange day: carrots, oranges, cheese… prepare for questions.", 2, 1, "day", "lazy", "anywhere", "any"],
  ["Create a ridiculous invention", "Solve a problem nobody has. Patent optional, giggles guaranteed.", 3, 1, "day", "normal", "home", "any"],
  ["Build something completely useless", "A machine that turns itself off. A hat for a plant. Art, basically.", 2, 1, "3hours", "lazy", "home", "any"],
  ["Spend an hour following random directions", "Flip a coin at every turn. Let probability walk you home.", 2, 0, "1hour", "normal", "city", "alone"],
  ["Create a fake museum in your room", "Curate your own junk with tiny exhibit labels. Charge admission in snacks.", 2, 0, "3hours", "lazy", "home", "friends"],
  ["Learn a completely unnecessary skill", "Pen spinning, whistling with fingers, balancing spoons. Useless = perfect.", 2, 0, "1hour", "lazy", "home", "alone"],
  ["Make a tiny version of something large", "A cathedral from matchsticks, a city from cardboard. Absurd and magnificent.", 3, 1, "weekend", "lazy", "home", "any"],
  ["Have a conversation using only questions", "Ten minutes of pure question mark chaos with a willing friend.", 3, 0, "30min", "low", "anywhere", "one"],
  ["Create your own holiday", "Invent 'Sit On The Roof And Eat Mangoes Day'. Celebrate yearly.", 1, 1, "day", "lazy", "anywhere", "any"],
  ["Name a day after yourself", "Mark it on the calendar. Do exactly what you want, annually.", 1, 1, "day", "lazy", "anywhere", "any"],
  ["Start a collection of something tiny", "Matchboxes, bus tickets, hotel keys. Curate the evidence of living.", 1, 1, "multi", "lazy", "anywhere", "any"],
  ["Write a song about a household object", "An ode to the toaster. A ballad for the houseplant. Grammy pending.", 2, 0, "1hour", "lazy", "home", "alone"],
  ["Wear your clothes backwards for a day", "Kris Kross nostalgia or pure chaos — commit fully.", 1, 0, "day", "normal", "anywhere", "any"],
  ["Invent a handshake with a friend", "Ten steps minimum. Deploy at every reunion forever.", 1, 0, "30min", "low", "anywhere", "friends"],
];

const catMeta = {
  travel: ["travel", "adventure"], physical: ["physical", "fun"], create: ["create", "create"],
  fun: ["fun", "fun"], crazy: ["crazy", "crazy"], growth: ["growth", "growth"],
  family: ["family", "meaningful"], kindness: ["kindness", "meaningful"], money: ["money", "growth"],
  spiritual: ["spiritual", "meaningful"], weird: ["weird", "fun"],
};

function addCurated(catKey, list) {
  for (const [title, desc, diff, budget, time, energy, location, social] of list) {
    add({
      title, description: desc, category: catKey,
      mood: catMeta[catKey][1], difficulty: diff, budget, time, energy, location, social,
      reel: pickInt(3, 5),
      tags: `${catKey},${time}`,
    });
  }
}
addCurated("travel", travel); addCurated("physical", physical); addCurated("create", create);
addCurated("fun", fun); addCurated("crazy", crazy); addCurated("growth", growth);
addCurated("family", family); addCurated("kindness", kindness); addCurated("money", money);
addCurated("spiritual", spiritual); addCurated("weird", weird);

/* ------------------------------------------------------------------ */
/* GENERATED EXPERIENCES                                               */
/* ------------------------------------------------------------------ */

const cities = [
  "Jaipur","Goa","Kochi","Leh","Varanasi","Rishikesh","Pondicherry","Udaipur","Hampi","Manali",
  "Darjeeling","Jaisalmer","Mumbai","Delhi","Bengaluru","Kolkata","Chennai","Hyderabad","Amritsar","Mysuru",
  "Munnar","Alleppey","Coorg","Shillong","Ooty","Gokarna","Spiti","McLeod Ganj","Pushkar","Agra",
  "Tokyo","Kyoto","Paris","Istanbul","Bangkok","Bali","Dubai","Rome","Barcelona","Prague",
  "Marrakech","Cape Town","Santorini","Hanoi","Kathmandu","Thimphu","Lisbon","Amsterdam","Seoul","Sydney",
];
const travelT = [
  ["Travel to {c} — somewhere you've never been", "New streets reset your brain. Go with a loose plan and a curious stomach.", 3, 3, "multi", "normal", "travel", "any"],
  ["Watch the sunrise in {c}", "Find the horizon of a new place before the alarm of the waking city.", 2, 2, "3hours", "low", "travel", "any"],
  ["Take a street-food tour of {c}", "Follow the crowds and the smells. Eat what the locals queue for.", 2, 2, "3hours", "normal", "travel", "any"],
  ["Spend a day exploring {c} without a map", "Wander by instinct. Every wrong turn in a new city is a right one.", 2, 2, "day", "normal", "travel", "alone"],
  ["Find the best chai or coffee in {c}", "Ask five locals, visit their top pick, judge like a critic.", 1, 1, "3hours", "low", "travel", "any"],
  ["Photograph {c} like a tourist again", "Do the full tourist circuit, happily. Some clichés are cliché because they're wonderful.", 1, 2, "day", "normal", "travel", "any"],
  ["Visit a local museum or fort in {c}", "Learn one history lesson from the city itself.", 2, 1, "3hours", "low", "travel", "any"],
  ["Watch the sunset in {c}", "Every place owns a different sunset. Collect this one.", 1, 1, "1hour", "lazy", "travel", "any"],
  ["Take a night walk through old {c}", "Cities confess different stories after dark. Walk safely, go with company.", 2, 1, "3hours", "normal", "travel", "friends"],
  ["Ride public transport across all of {c}", "Window seat economics: see a whole city for the price of a snack.", 1, 1, "halfday", "low", "travel", "any"],
];
for (const c of cities) {
  for (const t of travelT) {
    add({
      title: t[0].replace("{c}", c), description: t[1], category: "travel", mood: "adventure",
      difficulty: t[2], budget: t[3], time: t[4], energy: t[5], location: t[6], social: t[7],
      tags: `${c.toLowerCase()},travel`,
    });
  }
}

const dishes = ["biryani","ramen","croissants","dumplings","pasta from scratch","dal makhani","tacos","sushi rolls","cheesecake","pad thai","idli from batter","wood-fired pizza","churros","lasagna","momos","arkansas pie","samosas","tiramisu","pav bhaji","poke bowls","falafel","banoffee pie","khichdi","kimchi","risotto","sourdough bread","phirni","laksa","cinnamon rolls","chole bhature","bao buns","ratatouille","mango sorbet","shakshuka","baklava","dosa","brownies","ravioli","gajar halwa","paella"];
for (const d of dishes) {
  add({ title: `Learn to cook ${d}`, description: "One dish, conquered properly. Make it three times until it's yours.", category: "growth", mood: "growth", difficulty: 2, budget: 1, time: "3hours", energy: "normal", location: "home", social: "any", tags: "cooking,food", reel: 4 });
  add({ title: `Eat authentic ${d} at its home-style best`, description: "Find the most loved spot serving it and taste the real thing.", category: "fun", mood: "fun", difficulty: 1, budget: 1, time: "1hour", energy: "lazy", location: "city", social: "any", tags: "food,explore", reel: 4 });
}

const skills = ["the guitar","watercolour painting","chess","calligraphy","skateboarding","photography","beatboxing","sign language","the harmonium","video editing","knitting","pottery","salsa dancing","the ukulele","VFX basics","tattoo-style sketching","lock picking (legal, on your own locks)","origami","whistling loudly","cardistry","the flute","swimming freestyle properly","archery","yoga inversions","speedcubing","pen spinning","latte art","basic woodworking","the drums","hula hooping","baking bread","the keyboard","street photography","public speaking","freestyle football tricks","bird-watching","stargazing constellations","map reading","Morse code","shadow puppetry","jewellery making"];
const skillT = [
  ["Learn the basics of {s}", "One skill, one inspired month of practice. Film day one for proof.", "multi"],
  ["Practice {s} for 30 straight days", "Small daily reps turn strangers into old friends — same with skills.", "multi"],
  ["Teach a kid the basics of {s}", "Teach it to understand it. Borrow the kid if needed.", "3hours"],
];
for (const s of skills) {
  for (const t of skillT) {
    add({ title: t[0].replace("{s}", s), description: t[1], category: "growth", mood: "growth", difficulty: s.length > 15 ? 3 : 2, budget: pick([0,0,1]), time: t[2], energy: "lazy", location: pick(["home","city","anywhere"]), social: "alone", tags: "skill,learning", reel: pickInt(3,5) });
  }
}

const sports = ["frisbee","table tennis","badminton","skateboarding","boxing at a gym","indoor rock climbing","squash","roller skating"," kayaking in a safe club","football with strangers","golf at a driving range","archery","go-karting","bowling","ice skating","beach volleyball","a martial-arts trial class","disc golf","pickleball","pool or snooker","darts at a proper board","mini golf","street cricket with locals","a morning yoga class in a park"];
for (const sp of sports) {
  add({ title: `Try ${sp.trim().replace(/^a /,"").replace(/^ /,"")} this week`, description: "Beginner's luck is real. Borrow gear, show up humble, leave grinning.", category: "physical", mood: "fun", difficulty: 2, budget: 1, time: "3hours", energy: "active", location: "city", social: "any", tags: "sports,try-new", reel: 4 });
}

const mediums = ["a comic strip","a photo essay","a lo-fi beat","a cover song","a vlog of an ordinary day","a zine","a mural sketch","a spoken-word poem","a time-lapse video","a 6-second loop","a recipe reel","a doodle a day for a week","a mini documentary about your building","an animated GIF of your pet","a dramatic reading of a menu","a song from only kitchen sounds"];
for (const m of mediums) {
  add({ title: `Create ${m}`, description: "One finished thing, shared with the world. Done beats perfect.", category: "create", mood: "create", difficulty: 2, budget: 0, time: "3hours", energy: "normal", location: "home", social: "alone", tags: "create,content", reel: 5 });
}
const createWeekend = ["a short story","an illustrated letter","a loaf of bread shaped like art","a playlist with a story arc","a paper-mâché mask","a stop-motion short","a painted denim jacket","a family sketch-comedy sketch","a board game of your own rules","a newspaper for your family"];
for (const m of createWeekend) {
  add({ title: `Make ${m} in one weekend`, description: "Friday night to Sunday evening. Constraints make art.", category: "create", mood: "create", difficulty: 3, budget: 1, time: "weekend", energy: "normal", location: "home", social: "any", tags: "weekend,create", reel: 5 });
}

const familyP = ["your mother","your father","your grandmother","your grandfather","your sibling","a favourite aunt or uncle","a cousin you grew up with","the oldest person in your family","the youngest person in your family","a relative you haven't called in a year"];
const familyA = [
  ["Cook a full meal for {p}", "Serve them like guests of honour. Watch them pretend not to be moved.", 2, 1, "3hours", "normal", "home"],
  ["Take {p} out for a meal they love", "Their pick, your treat. Ask for childhood stories over dessert.", 1, 2, "3hours", "lazy", "city"],
  ["Go on a long walk with {p}", "The best conversations walk slowly. No clock-watching allowed.", 1, 0, "1hour", "low", "outdoor"],
  ["Look through old photo albums with {p}", "Ask who every stranger in the photos is. There's gold in there.", 1, 0, "3hours", "lazy", "home"],
  ["Film a mini-interview with {p}", "Ten questions about their life. Keep the recording forever.", 2, 0, "1hour", "lazy", "home"],
  ["Plant something together with {p}", "A sapling, a herb pot, a tiny garden — grow a shared thing.", 1, 1, "1hour", "normal", "outdoor"],
];
for (const p of familyP) {
  for (const a of familyA) {
    add({ title: a[0].replace("{p}", p), description: a[1], category: "family", mood: "meaningful", difficulty: a[2], budget: a[3], time: a[4], energy: a[5], location: a[6], social: "family", tags: "family,memory", reel: 4 });
  }
}

const kindnessA = [
  ["Leave a ₹100 tip for excellent service", "Normal meal, abnormal gratitude. Watch disbelief turn to smile.", 1, 1, "30min", "lazy", "city"],
  ["Buy a hot meal for someone who needs it", "No filming, no fuss — just dinner for a stranger.", 1, 1, "30min", "low", "city"],
  ["Donate a bag of good books", "You've read them. Let them live again.", 1, 0, "1hour", "low", "city"],
  ["Offer your seat and your smile all day", "Tiny kindness reps. Your face will hurt by evening. Good pain.", 1, 0, "day", "normal", "city"],
  ["Bring snacks for your building's security staff", "The people who watch over your nights deserve a warm plate.", 1, 1, "1hour", "lazy", "home"],
  ["Write a thank-you note to a former teacher", "They wondered for years if it mattered. Tell them it did.", 1, 0, "30min", "lazy", "home"],
  ["Pick up litter in a park for 30 minutes", "Leave one public corner better than you found it.", 2, 0, "30min", "normal", "outdoor"],
  ["Give a genuinely glowing review to a street vendor", "For a small business, your kind words are advertising money can't buy.", 1, 0, "10min", "lazy", "city"],
  ["Donate to a cause you've never supported before", "Pick one at random from a verified list. Learn their story first.", 1, 1, "30min", "lazy", "home"],
  ["Offer to photograph a tourist family", "Everyone deserves one photo where all of them are in the frame.", 1, 0, "10min", "normal", "outdoor"],
];
for (let i = 0; i < 3; i++) {
  for (const a of kindnessA) {
    const suffix = i === 0 ? "" : i === 1 ? " this week" : " without telling anyone";
    add({ title: a[0] + suffix, description: a[1], category: "kindness", mood: "meaningful", difficulty: a[2], budget: a[3], time: a[4], energy: a[5], location: a[6], social: "alone", tags: "kindness,giving", reel: pickInt(2,4) });
  }
}

const hustles = ["old textbooks","handmade bookmarks","your photography prints","baked cookies","custom playlists as gifts","tutoring a school subject","resume reviews","instagram captions for small cafés","weekend photography gigs","voice-over samples","digital stickers","a tiny newsletter people love","custom phone wallpapers","hand-lettered name cards","second-hand clothes, curated"];
for (const h of hustles) {
  add({ title: `Sell ${h} and earn your first money`, description: "Make the first rupee prove the next hundred possible.", category: "money", mood: "growth", difficulty: 3, budget: 0, time: "weekend", energy: "normal", location: "home", social: "alone", tags: "hustle,money", reel: pickInt(3,5) });
}

const quiet = [
  [" Have a technology-free morning", "Sunlight before screens. Tea before timelines.", "30min"],
  ["Sit in a park and people-watch for an hour", "Free theatre with the best casting on Earth.", "1hour"],
  ["Write three pages about what 'enough' means to you", "Define it before the world defines it for you.", "1hour"],
  ["Eat one meal in complete silence", "Taste everything. Phone nowhere.", "1hour"],
  ["Stargaze for 30 minutes", "Ancient light, modern peace.", "30min"],
  ["Take a bath or shower with full attention", "A spa day measured in minutes.", "30min"],
  ["Sketch your street from a window", "No skill required — attention is the talent.", "1hour"],
  ["Lie on the floor and do nothing for 15 minutes", "It is harder than it sounds. That is the point.", "10min"],
  ["Listen to one full album, start to finish", "Music as the artist ordered it. No shuffle.", "1hour"],
  ["Watch birds for 20 minutes", "The oldest streaming service on Earth.", "30min"],
  ["Write down 10 things that went right this year", "Your brain undercounts its wins. Audit it.", "30min"],
  ["Do a slow evening stretch session", "Twenty minutes of negotiating peace with your spine.", "30min"],
];
for (const q of quiet) {
  add({ title: q[0].trim(), description: q[1], category: "spiritual", mood: "meaningful", difficulty: 1, budget: 0, time: q[2], energy: "lazy", location: "anywhere", social: "alone", tags: "quiet,mindful", reel: 2 });
}

const tenMin = [
  ["Call someone you haven't spoken to recently", "Their face will light up on the other end. You'll feel it.", "kindness", "meaningful"],
  ["Write 10 things you're grateful for", "A gratitude sprint. Set a timer, beat your own count.", "spiritual", "meaningful"],
  ["Learn 10 words in another language", "Ten new words are ten new doors. Pick a language at random.", "growth", "growth"],
  ["Compliment someone sincerely", "Specific, honest, and watch them carry it all day.", "kindness", "meaningful"],
  ["Take 10 interesting photographs", "Look twice at ordinary things. Post your favourite.", "create", "create"],
  ["Sit outside and watch the world", "Ten minutes of main-character energy, no plot required.", "spiritual", "meaningful"],
  ["Write a note to your future self", "One sentence of hope, sealed for later.", "spiritual", "meaningful"],
  ["Stretch every part of your body once", "Ten minutes of maintenance your future back will thank you for.", "physical", "fun"],
  ["Learn one card trick move", "One flourish today, a magic show by next festival.", "fun", "fun"],
  ["Send a friend a meme that made you laugh", "Micro-dose of friendship. Zero calories.", "fun", "fun"],
  ["Draw a self-portrait in 10 minutes", "No erasing. Hang the glorious disaster.", "create", "create"],
  ["Donate ₹50 to any verified cause", "Tiny money, real impact, instant mood upgrade.", "kindness", "meaningful"],
];
for (const t of tenMin) {
  add({ title: t[0], description: t[1], category: t[2], mood: t[3], difficulty: 1, budget: 0, time: "10min", energy: "lazy", location: "anywhere", social: "alone", tags: "quick,10-minute", reel: 3 });
}
for (const t of tenMin) {
  add({ title: t[0] + " — with a friend", description: t[1] + " Doing it together makes it a memory.", category: t[2], mood: t[3], difficulty: 1, budget: 0, time: "10min", energy: "lazy", location: "anywhere", social: "friends", tags: "quick,10-minute,together", reel: 3 });
}

const weirdGen = [
  ["Eat only {c}-coloured foods for a day", "A nutritional monochrome. Challenge your inner painter."],
  ["Photograph only {c} things for one hour", "Give your eyes a single assignment."],
];
for (const c of ["red","green","yellow","blue","white","orange","purple","brown"]) {
  for (const w of weirdGen) {
    add({ title: w[0].replace("{c}", c), description: w[1], category: "weird", mood: "fun", difficulty: 2, budget: 0, time: "day", energy: "lazy", location: "anywhere", social: "any", tags: "weird,colour", reel: 4 });
  }
}
const tinyThings = ["the Taj Mahal","a famous skyscraper","your own house","a cruise ship","a metro train","a cricket stadium","a wedding cake","a famous bridge"];
for (const t of tinyThings) {
  add({ title: `Build a tiny model of ${t}`, description: "Cardboard, patience, absurdity. Museum-worthy nonsense.", category: "weird", mood: "fun", difficulty: 3, budget: 1, time: "weekend", energy: "lazy", location: "home", social: "any", tags: "weird,craft", reel: 5 });
}

const thirtyDay = [
  ["drink only water for all beverages", "physical","fun"],
  ["write one good thing that happened today", "spiritual","meaningful"],
  ["take one photo of something beautiful", "create","create"],
  ["walk 10,000 steps", "physical","fun"],
  ["learn one new word", "growth","growth"],
  ["sleep before midnight", "growth","growth"],
  ["no sugar", "physical","fun"],
  ["no online shopping", "growth","growth"],
  ["make your bed every morning", "growth","growth"],
  ["call one family member a week", "family","meaningful"],
];
for (const t of thirtyDay) {
  add({ title: `30-day challenge: ${t[0]}`, description: "Thirty small wins stacked end to end. Miss one? Life happened. Start again.", category: t[1], mood: t[2], difficulty: 3, budget: 0, time: "multi", energy: "lazy", location: "anywhere", social: "alone", tags: "challenge,30-day", reel: 4 });
}

const scaryish = [
  ["Eat alone at a busy restaurant", "Table for one, main-character energy. Bring a book as armour.", 3],
  ["Strike a conversation in an elevator", "Thirty seconds of courage between floors.", 3],
  ["Ask a shopkeeper about the story of their shop", "Every counter hides a founder story. Ask, listen.", 3],
  ["Give an impromptu toast at a family dinner", "Stand up, glass up, one minute of heart.", 2],
  ["Wear one bold colour head-to-toe", "Walk like the city is your runway. It is.", 2],
  ["Request a song at a live venue", "Use your outside voice for a beautiful cause.", 2],
  ["Ask for a discount, politely, once", "The worst answer is no. The best is a story.", 2],
  ["Speak to someone whose shoes you admire", "A compliment is the world's easiest icebreaker.", 3],
];
for (const s of scaryish) {
  add({ title: s[0], description: s[1], category: "crazy", mood: "crazy", difficulty: s[2], budget: 0, time: "30min", energy: "normal", location: "city", social: "alone", tags: "uncomfortable,bold", reel: 4 });
}

/* ---------------- EXPANSION PACK: more cities & templates --------------- */
const cities2 = [
  "Nainital","Kasol","Tawang","Ziro","Diu","Dwarka","Bodh Gaya","Khajuraho","Cherrapunji","Itanagar",
  "Mount Abu","Lonavala","Mahabaleshwar","Kanha","Bandhavgarh","Kutch","Majuli","Kumarakom","Kovalam","Thekkady",
  "Chikmagalur","Yercaud","Pachmarhi","Bir Billing","Kodaikanal",
];
for (const c of cities2) {
  for (const t of travelT) {
    add({
      title: t[0].replace("{c}", c), description: t[1], category: "travel", mood: "adventure",
      difficulty: t[2], budget: t[3], time: t[4], energy: t[5], location: t[6], social: t[7],
      tags: `${c.toLowerCase()},travel`,
    });
  }
  add({ title: `Find a hidden viewpoint in ${c}`, description: "Every place hides one bench with the best view. Ask an old-timer, they'll know.", category: "travel", mood: "adventure", difficulty: 1, budget: 0, time: "3hours", energy: "low", location: "travel", social: "any", tags: `${c.toLowerCase()},viewpoint`, reel: 4 });
}

const cities3 = [
  "Ahmedabad","Surat","Indore","Bhopal","Nagpur","Lucknow","Patna","Bhubaneswar","Chandigarh","Dehradun",
  "Ranchi","Guwahati","Imphal","Aizawl","Gangtok","Shimla","Jodhpur","Bikaner","Ajmer","Trichy",
  "Madurai","Coimbatore","Vizag","Mangalore","Thrissur","Kozhikode","Cuttack","Siliguri","Panjim","Shillong",
];
for (const c of cities3) {
  for (const t of travelT) {
    add({
      title: t[0].replace("{c}", c), description: t[1], category: "travel", mood: "adventure",
      difficulty: t[2], budget: t[3], time: t[4], energy: t[5], location: t[6], social: t[7],
      tags: `${c.toLowerCase()},travel`,
    });
  }
  add({ title: `Eat breakfast at ${c}'s most-loved morning stall`, description: "Ask a local where they go at 7 AM. Order what the queue orders.", category: "travel", mood: "adventure", difficulty: 1, budget: 1, time: "1hour", energy: "lazy", location: "travel", social: "any", tags: `${c.toLowerCase()},food`, reel: 4 });
}

const cuisines = ["Korean","Ethiopian","Peruvian","Vietnamese","Moroccan","Malaysian","Georgian","Lebanese","Thai","Mexican","Japanese","Italian","Rajasthani","Bengali","Kashmiri","Goan","Punjabi","Tamil","Kerala-style","Spanish","Turkish","Greek","Iranian","Burmese","Filipino"];
for (const cz of cuisines) {
  add({ title: `Cook a full ${cz} meal from scratch`, description: "Three dishes, one cuisine, zero shortcuts. Your kitchen becomes an embassy for the night.", category: "growth", mood: "growth", difficulty: 3, budget: 1, time: "3hours", energy: "normal", location: "home", social: "any", tags: `cooking,${cz.toLowerCase()}`, reel: 4 });
  add({ title: `Find the best ${cz} food in your city`, description: "Ask the internet, then ask a human. The human's answer is the adventure.", category: "fun", mood: "fun", difficulty: 1, budget: 2, time: "3hours", energy: "lazy", location: "city", social: "any", tags: `food,${cz.toLowerCase()}`, reel: 4 });
  add({ title: `Rate 5 ${cz} dishes you've never tried`, description: "A tasting mission with a notebook. Crown one champion.", category: "fun", mood: "fun", difficulty: 1, budget: 2, time: "3hours", energy: "lazy", location: "city", social: "friends", tags: `food,${cz.toLowerCase()}`, reel: 5 });
}

const jobs = ["auto-rickshaw driver","florist","watchmaker","street photographer","fisherman","pastry chef","radio host","archaeologist","bus conductor","tailor","puppeteer","librarian","beekeeper","lifeguard","school caretaker","tea-stall owner","potter","train guard","astronomer","mountain guide","calligrapher","barista"," midwife","veterinarian","street magician","bookbinder","ferry operator","weatherman","sign painter","museum curator","wax sculptor","zookeeper","night-shift nurse","firefighter","deep-sea diver","traffic cop"];
for (const j of jobs) {
  add({ title: `Interview someone who works as a ${j.trim()}`, description: "Five honest questions about a life different from yours. Everyone's a story waiting to be asked.", category: "growth", mood: "growth", difficulty: 3, budget: 0, time: "1hour", energy: "low", location: "city", social: "strangers", tags: "stories,people", reel: 4 });
  add({ title: `Ask a ${j.trim()} about the best part of their work`, description: "One question. Watch a stranger light up mid-sentence.", category: "kindness", mood: "meaningful", difficulty: 2, budget: 0, time: "30min", energy: "low", location: "city", social: "strangers", tags: "people,gratitude", reel: 3 });
  add({ title: `Thank a ${j.trim()} for the work they do`, description: "Specific gratitude beats generic praise. Watch disbelief become a smile.", category: "kindness", mood: "meaningful", difficulty: 1, budget: 0, time: "10min", energy: "lazy", location: "anywhere", social: "alone", tags: "gratitude,kindness", reel: 2 });
}

const langs = ["Japanese","Korean","Spanish","French","Tamil","Marathi","Bengali","Italian","Arabic","Portuguese","German","Telugu","Punjabi","Thai","Turkish","Malayalam","Russian","Swahili"];
for (const l of langs) {
  add({ title: `Learn 30 ${l} words in a week`, description: "Five words a day. By Sunday you can introduce yourself somewhere far away.", category: "growth", mood: "growth", difficulty: 2, budget: 0, time: "multi", energy: "lazy", location: "home", social: "alone", tags: `language,${l.toLowerCase()}`, reel: 3 });
  add({ title: `Watch one film in ${l} — no dubbing`, description: "Subtitles on, phone away. Let the language wash over you.", category: "fun", mood: "fun", difficulty: 1, budget: 0, time: "3hours", energy: "lazy", location: "home", social: "any", tags: `film,${l.toLowerCase()}`, reel: 2 });
}

const photoSubjects = ["your own street","strangers' dogs (ask first)","every blue door nearby","your city's oldest building","hands at work","a market at 7 AM","the same tree every day for a week","reflections after rain","your childhood neighbourhood","every sunset for a week","the people you love, unposed","street food being made","your commute, like a tourist","shadows at noon","your grandparents' hands","every library in town","a vegetable vendor's setup","bridges at dusk","your desk through the seasons","children laughing","the oldest shop in your area","a festival you don't celebrate (respectfully)","your morning light for 30 days","people waiting","the full moon","free things that look expensive","your shoes everywhere they took you","the city's smallest lane"];
for (const p of photoSubjects) {
  add({ title: `Photograph ${p}`, description: "One subject, full attention, no deleting for perfection. Pick the best frame and print it.", category: "create", mood: "create", difficulty: 1, budget: 0, time: "1hour", energy: "low", location: "anywhere", social: "alone", tags: "photo,chase-light", reel: 4 });
}

const bookTopics = ["space","the ocean's deepest parts","how memory works","a country you've never visited","money that actually makes sense","an animal smarter than you think","history's greatest heists","why we sleep","how cities are built","a religion you don't follow (respectfully)","the invention of everyday things","an explorer who disappeared","how your gut talks to your brain","the psychology of habits","a civilization lost to time"];
for (const b of bookTopics) {
  add({ title: `Read one book about ${b}`, description: "One topic, one book, one rainy weekend. Come back slightly new.", category: "growth", mood: "growth", difficulty: 2, budget: 1, time: "weekend", energy: "lazy", location: "home", social: "alone", tags: "reading,learn", reel: 2 });
  add({ title: `Watch the best documentary about ${b}`, description: "Ninety minutes of someone else's obsession becoming yours.", category: "growth", mood: "growth", difficulty: 1, budget: 0, time: "3hours", energy: "lazy", location: "home", social: "any", tags: "documentary,learn", reel: 2 });
}

const courseSubjects = ["graphic design","video editing","public speaking","basic accounting","filmmaking","chess strategy","nutrition basics","first aid","web development","negotiation","personal finance","gardening","creative writing","marketing","photography","music theory","psychology of happiness","astronomy","sign language","self-defence theory"];
for (const s of courseSubjects) {
  add({ title: `Take a free online course in ${s}`, description: "The world's best teachers now live in your browser. Finish one module today.", category: "growth", mood: "growth", difficulty: 2, budget: 0, time: "multi", energy: "lazy", location: "home", social: "alone", tags: "course,skill", reel: 3 });
}

const weekendWith = [
  ["go stargazing outside the city","low","outdoor"],
  ["try a new hiking trail","normal","outdoor"],
  ["have a device-free picnic","lazy","outdoor"],
  ["explore a nearby town by bus","normal","travel"],
  ["host a bad-movie marathon","lazy","home"],
  ["run a tiny photography contest","normal","city"],
  ["build an unnecessarily large puzzle","lazy","home"],
  ["cook a feast where everyone makes one dish","normal","home"],
  ["visit a religious or cultural place you've never entered (respectfully)","low","city"],
  ["do a sunrise-to-sunset photo challenge","normal","outdoor"],
  ["camp in someone's backyard","normal","outdoor"],
  ["tour your own city like a guidebook tourist","normal","city"],
  ["have a cake-decorating duel","normal","home"],
  ["replay your childhood games tournament-style","lazy","home"],
  ["go bird-watching at 6 AM","low","outdoor"],
  ["volunteer somewhere that needs hands","active","city"],
];
for (const w of weekendWith) {
  add({ title: `This weekend: ${w[0]}`, description: "Two free days are a small fortune. Spend them like they matter — because they do.", category: "fun", mood: "fun", difficulty: 2, budget: 1, time: "weekend", energy: w[1], location: w[2], social: "friends", tags: "weekend,together", reel: 4 });
  add({ title: `${w[0][0].toUpperCase() + w[0].slice(1)} — with family`, description: "Same plan, better company. These are the days everyone remembers at weddings.", category: "family", mood: "meaningful", difficulty: 2, budget: 1, time: "weekend", energy: w[1], location: w[2], social: "family", tags: "weekend,family", reel: 4 });
}

const soloDates = ["a long coffee and a good book","a movie — yes, alone","a museum afternoon","a street-food crawl","a bookstore hour with zero agenda","a sunrise sit with your thoughts","a fancy lunch you dress up for","a sketch-what-you-see walk","a full 'say yes to yourself' day","a headphone album walk at dusk"];
for (const d of soloDates) {
  add({ title: `Take yourself out for ${d}`, description: "Date the main character. You're surprisingly good company.", category: "spiritual", mood: "meaningful", difficulty: 1, budget: 1, time: "3hours", energy: "lazy", location: "city", social: "alone", tags: "solo,date", reel: 3 });
  add({ title: `Solo mission: ${d}`, description: "Alone on purpose. Loneliness and solitude are cousins, not twins.", category: "crazy", mood: "crazy", difficulty: 2, budget: 1, time: "3hours", energy: "low", location: "city", social: "alone", tags: "solo,comfort-zone", reel: 4 });
}

const everyThings = ["public park","museum","famous bakery","library","viewpoint","heritage building","street mural","old market","botanical corner","community space"];
for (const e of everyThings) {
  add({ title: `Visit every ${e} in your city`, description: "A month-long treasure hunt hiding inside your own postcode.", category: "travel", mood: "adventure", difficulty: 2, budget: 0, time: "multi", energy: "normal", location: "city", social: "any", tags: "city-hunt,explore", reel: 4 });
  add({ title: `Rate every ${e} you can find nearby`, description: "Judge with love, rank with ruthlessness, publish the list.", category: "fun", mood: "fun", difficulty: 1, budget: 0, time: "day", energy: "normal", location: "city", social: "friends", tags: "city-hunt,fun", reel: 5 });
}

const playlistOcc = ["your future self's graduation","a train window at dusk","the morning you finally start","a road trip with one friend","cooking like nobody's watching","the last day of being this age","your fictional victory montage","rain with nowhere to be","the friendship that raised you","dancing alone in the kitchen","a city at 5 AM","the version of you that made it"];
for (const p of playlistOcc) {
  add({ title: `Make a playlist for ${p}`, description: "Twelve tracks. One mood. Soundtrack your own cinema.", category: "create", mood: "create", difficulty: 1, budget: 0, time: "1hour", energy: "lazy", location: "home", social: "alone", tags: "music,playlist", reel: 3 });
}

for (const c of ["red","green","yellow","blue","white","black","orange","purple"]) {
  add({ title: `Wear only ${c} for one entire day`, description: "Commit to the bit. The city is your runway, the mirror your judge.", category: "weird", mood: "fun", difficulty: 1, budget: 0, time: "day", energy: "normal", location: "anywhere", social: "any", tags: "weird,colour", reel: 4 });
}

const twoWeek = [
  ["walk after every dinner","low"], ["write one line about the day","lazy"], ["stretch for ten minutes","lazy"],
  ["talk to one new person","normal"], ["make your bed before your phone","lazy"], ["no delivery food","normal"],
  ["one act of quiet kindness daily","normal"], ["read ten pages","lazy"], ["no complaining aloud","lazy"],
  ["learn one magic move","lazy"], ["sketch one small thing","lazy"], ["watch one sunrise or sunset","low"],
];
for (const t of twoWeek) {
  add({ title: `Two-week experiment: ${t[0]}`, description: "Fourteen days — short enough to survive, long enough to change something. Miss one? Start again, no guilt.", category: "growth", mood: "growth", difficulty: 2, budget: 0, time: "multi", energy: t[1], location: "anywhere", social: "alone", tags: "challenge,habit", reel: 3 });
}

const microTrips = ["the next town over","the village your grandparents came from","the last stop of your metro line","a hill you've seen but never climbed","the river closest to home","your city's oldest neighbourhood","the nearest fort or ruin","the beach two trains away","the lake your city forgot","the famous breakfast place across town"];
for (const m of microTrips) {
  add({ title: `Micro-trip: go to ${m}`, description: "Travel doesn't need a suitcase. It needs a Saturday and bus fare.", category: "travel", mood: "adventure", difficulty: 2, budget: 1, time: "day", energy: "normal", location: "travel", social: "any", tags: "micro-trip,weekend", reel: 4 });
}

for (const h of hustles) {
  add({ title: `Run a one-day stall selling ${h}`, description: "One table, one price sign, real customers. The market is the world's oldest business school.", category: "money", mood: "growth", difficulty: 4, budget: 1, time: "day", energy: "active", location: "city", social: "strangers", tags: "hustle,stall", reel: 5 });
}

/* completions + trending flags */
for (const r of rows) {
  if (r.completions > 2200 && rnd() > 0.4) r.trending = true;
  if (rnd() > 0.985) r.featured = true;
}

/* ------------------------------------------------------------------ */
/* INSERT                                                              */
/* ------------------------------------------------------------------ */
async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();
  try {
    console.log(`Seeding ${rows.length} experiences...`);
    await client.query("DELETE FROM experiences");
    const cols = '("title","description","category","mood","difficulty","budget","time","energy","location","social","safety","reel","completions","trending","featured","tags")';
    const batch = 250;
    for (let i = 0; i < rows.length; i += batch) {
      const slice = rows.slice(i, i + batch);
      const values = [];
      const params = [];
      slice.forEach((r, j) => {
        const base = j * 16;
        values.push(`(${Array.from({ length: 16 }, (_, k) => `$${base + k + 1}`).join(",")})`);
        params.push(r.title, r.description, r.category, r.mood, r.difficulty, r.budget, r.time, r.energy, r.location, r.social, r.safety, r.reel, r.completions, r.trending, r.featured, r.tags);
      });
      const runId = crypto.randomUUID().slice(0, 4);
      await client.query(`INSERT INTO experiences ${cols} VALUES ${values.join(",")} /* seed:${runId} */`, params);
      process.stdout.write(`\r  inserted ${Math.min(i + batch, rows.length)}/${rows.length}`);
    }
    const { rows: c } = await client.query("SELECT count(*)::int AS c FROM experiences");
    console.log(`\nDone. experiences table now has ${c[0].c} rows.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
