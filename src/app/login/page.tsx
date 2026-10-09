"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { Reveal } from "@/components/ui/primitives";
import {
  User,
  Mail,
  Link as LinkIcon,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user";

function getRedirectTarget(): string {
  try {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  } catch {}
  return "/profile";
}

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register } = useUser();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Step 1: Credentials
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Questionnaire
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    "Adventure & Outdoors",
    "Creative & Art",
  ]);
  const [budgetPref, setBudgetPref] = useState("₹0 — ₹500 (Budget Friendly)");
  const [timePref, setTimePref] = useState("1 - 3 hours (Quick Adventure)");
  const [comfortPref, setComfortPref] = useState("Mild Thrill (Push boundaries comfortably)");

  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleActivity = (act: string) => {
    setSelectedActivities((prev) =>
      prev.includes(act)
        ? prev.length > 1
          ? prev.filter((a) => a !== act)
          : prev
        : [...prev, act]
    );
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please choose a username.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!socialLink.trim()) {
      setError("Please enter your social media profile link (Instagram, X/Twitter, YouTube, etc.).");
      return;
    }
    setSignupStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Format social link if user just typed handle
    let formattedSocial = socialLink.trim();
    if (!formattedSocial.startsWith("http://") && !formattedSocial.startsWith("https://")) {
      if (formattedSocial.startsWith("@")) {
        formattedSocial = `https://instagram.com/${formattedSocial.substring(1)}`;
      } else {
        formattedSocial = `https://${formattedSocial}`;
      }
    }

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        socialLink: formattedSocial,
        preferences: {
          activities: selectedActivities,
          budget: budgetPref,
          time: timePref,
          comfortLevel: comfortPref,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(getRedirectTarget());
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginIdentifier.trim()) {
      setError("Please enter your username or email address.");
      return;
    }
    const ok = await login(loginIdentifier.trim());
    if (!ok) {
      setError("No account found with that username or email. Create a profile first.");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push(getRedirectTarget());
    }, 800);
  };

  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-coal pt-28 pb-20 text-cream">
        <div className="relative mx-auto max-w-xl px-4 sm:px-6">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

          {/* Heading */}
          <div className="text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Community Membership
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display mt-5 text-4xl font-semibold sm:text-5xl">
                {mode === "signup" ? (
                  <>
                    Create Your <span className="text-gold italic">Profile</span>
                  </>
                ) : (
                  <>
                    Welcome Back, <span className="text-gold italic">Explorer</span>
                  </>
                )}
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-3 text-sm text-cream/70 sm:text-base">
                {mode === "signup"
                  ? "Track completed challenges, level up your rank, and earn XP for living boldly."
                  : "Sign in to access your saved bucket lists, ranks, and earned XP."}
              </p>
            </Reveal>

            {/* Mode Tabs */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className={`rounded-full px-6 py-2.5 text-xs font-bold transition-all ${
                    mode === "signup"
                      ? "bg-gold text-coal shadow-[0_4px_16px_rgba(212,168,67,0.3)]"
                      : "text-cream/60 hover:text-cream"
                  }`}
                >
                  Create Profile (+150 XP)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className={`rounded-full px-6 py-2.5 text-xs font-bold transition-all ${
                    mode === "login"
                      ? "bg-gold text-coal shadow-[0_4px_16px_rgba(212,168,67,0.3)]"
                      : "text-cream/60 hover:text-cream"
                  }`}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="noise mt-8 rounded-[2rem] border border-white/10 bg-coal-2 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-10">
            {error && (
              <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs font-semibold text-rose-300">
                {error}
              </div>
            )}

            {success ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400 animate-bounce" />
                <h3 className="font-display mt-5 text-2xl font-semibold text-cream">
                  {mode === "signup" ? "Profile Created Successfully!" : "Welcome back!"}
                </h3>
                <p className="mt-2 text-sm text-gold font-bold">
                  {mode === "signup" ? "+150 Welcome XP Awarded! Redirecting to your profile..." : "Redirecting to your dashboard..."}
                </p>
              </div>
            ) : mode === "signup" ? (
              signupStep === 1 ? (
                /* Step 1: Credentials Form */
                <form key="signup-step1-form" onSubmit={handleStep1Next} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold tracking-wider text-gold uppercase">Step 1 of 2: Basic Info</span>
                    <span className="text-[11px] text-cream/50">Next: Lifestyle Quiz</span>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-cream/70 uppercase">
                      Username <span className="text-gold">*</span>
                    </label>
                    <div className="relative mt-2">
                      <User className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cream/40" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. wanderer_aarav"
                        className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pr-4 pl-11 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-cream/70 uppercase">
                      Email Address <span className="text-gold">*</span>
                    </label>
                    <div className="relative mt-2">
                      <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cream/40" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. aarav@gmail.com"
                        className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pr-4 pl-11 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>

                  {/* Social Media Link */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-cream/70 uppercase">
                      Social Media Profile Link <span className="text-gold">*</span>
                    </label>
                    <div className="relative mt-2">
                      <LinkIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cream/40" />
                      <input
                        type="text"
                        required
                        value={socialLink}
                        onChange={(e) => setSocialLink(e.target.value)}
                        placeholder="e.g. instagram.com/aarav or @aarav"
                        className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pr-4 pl-11 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-cream/40">
                      Shown on your leaderboard rank so fellow adventurers can connect with your memories.
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-cream/70 uppercase">
                      Password (Optional)
                    </label>
                    <div className="relative mt-2">
                      <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cream/40" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pr-4 pl-11 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>

                  {/* Next Step button */}
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-4 text-base font-bold text-coal shadow-[0_10px_30px_rgba(212,168,67,0.35)] transition-all hover:brightness-110 active:scale-[0.99]"
                  >
                    <span>Continue to Preference Quiz</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              ) : (
                /* Step 2: Questionnaire Form */
                <form key="signup-step2-form" onSubmit={handleRegister} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold tracking-wider text-gold uppercase">Step 2 of 2: Personalize Your Journey</span>
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="text-[11px] text-cream/60 hover:text-cream underline"
                    >
                      ← Back to Info
                    </button>
                  </div>

                  {/* Question 1: Activity Types */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-cream/80 uppercase">
                      1. Which types of activities excite you most? <span className="text-gold">*</span>
                    </label>
                    <p className="mt-1 text-[11px] text-cream/50">Pick one or more categories for customized spin recommendations.</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {[
                        { label: "Adventure & Outdoors", icon: "🧭" },
                        { label: "Crazy Stunts & Thrills", icon: "🔥" },
                        { label: "Creative & Art", icon: "🎨" },
                        { label: "Random Fun & Humor", icon: "😂" },
                        { label: "Mind & Personal Growth", icon: "🧠" },
                        { label: "Kindness & Giving Back", icon: "🤝" },
                        { label: "Spiritual & Peace", icon: "✨" },
                        { label: "Physical & Fitness", icon: "⚡" },
                      ].map((item) => {
                        const active = selectedActivities.includes(item.label);
                        return (
                          <button
                            type="button"
                            key={item.label}
                            onClick={() => toggleActivity(item.label)}
                            className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                              active
                                ? "border-gold bg-gold/15 text-gold font-bold shadow-sm"
                                : "border-white/10 bg-white/5 text-cream/70 hover:border-white/25 hover:text-cream"
                            }`}
                          >
                            <span>{item.icon}</span>
                            <span className="line-clamp-2">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question 2: Typical Budget */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-cream/80 uppercase">
                      2. What is your typical budget preference?
                    </label>
                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {[
                        "₹0 — Free only (No spending)",
                        "₹0 — ₹500 (Budget Friendly)",
                        "₹1,000+ (Flexible / Big Memories)",
                      ].map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudgetPref(b)}
                          className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                            budgetPref === b
                              ? "border-gold bg-gold/15 text-gold font-bold"
                              : "border-white/10 bg-white/5 text-cream/70 hover:border-white/25"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 3: Time Availability */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-cream/80 uppercase">
                      3. How much time do you usually have for spontaneous things?
                    </label>
                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {[
                        "15 - 30 minutes (Micro Moments)",
                        "1 - 3 hours (Quick Adventure)",
                        "Full Day or Weekend (Immersion)",
                      ].map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setTimePref(t)}
                          className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                            timePref === t
                              ? "border-gold bg-gold/15 text-gold font-bold"
                              : "border-white/10 bg-white/5 text-cream/70 hover:border-white/25"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 4: Comfort Zone Level */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-cream/80 uppercase">
                      4. What is your comfort zone style?
                    </label>
                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {[
                        "Chill & Cozy (Gentle & Safe)",
                        "Mild Thrill (Push boundaries comfortably)",
                        "Fearless (Maximum novelty & surprises)",
                      ].map((lvl) => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => setComfortPref(lvl)}
                          className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                            comfortPref === lvl
                              ? "border-gold bg-gold/15 text-gold font-bold"
                              : "border-white/10 bg-white/5 text-cream/70 hover:border-white/25"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* XP Perk Notice */}
                  <div className="rounded-2xl border border-gold/30 bg-gold/10 p-3.5 text-xs text-cream/80">
                    <span className="font-bold text-gold">⚡ +150 XP Ready:</span> Finishing onboarding
                    saves your profile, activates custom wheel matching, and unlocks the Spin Circle!
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-4 text-base font-bold text-coal shadow-[0_10px_30px_rgba(212,168,67,0.35)] transition-all hover:brightness-110 active:scale-[0.99]"
                  >
                    <span>Complete Profile & Claim 150 XP</span>
                    <Sparkles className="h-4 w-4 transition-transform group-hover:scale-125" />
                  </button>
                </form>
              )
            ) : (
              /* Login Form */
              <form key="login-form" onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-cream/70 uppercase">
                    Username or Email
                  </label>
                  <div className="relative mt-2">
                    <User className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cream/40" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. voyager_one or name@example.com"
                      className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pr-4 pl-11 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider text-cream/70 uppercase">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cream/40" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pr-4 pl-11 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-4 text-base font-bold text-coal shadow-[0_10px_30px_rgba(212,168,67,0.35)] transition-all hover:brightness-110 active:scale-[0.99]"
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
