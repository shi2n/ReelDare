"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Mail, PartyPopper, Send } from "lucide-react";
import { Reveal } from "@/components/ui/primitives";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const pre = sessionStorage.getItem("tdbd-plan");
    if (pre) setPlan(pre);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const data = (await res.json()) as { ok?: boolean; duplicate?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("done");
        setMessage(
          data.duplicate
            ? "You're already on the list — one fresh wish lands every Monday."
            : "You're in. Your first wish arrives Monday morning."
        );
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("No connection right now — the universe wants you to try again.");
    }
  };

  return (
    <section id="newsletter" className="relative overflow-hidden bg-gold py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#211d19 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-coal px-4 py-1.5 text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              The Monday Wish
            </p>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] font-semibold text-coal sm:text-5xl">
              One wish. Every Monday. No excuses left.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed font-medium text-coal/70">
              A hand-picked experience, a one-line story from someone who did it, and one tiny push. Unsubscribe
              whenever — but your Mondays will miss you.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-coal/60">
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4" aria-hidden /> 48,210 subscribers
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4" aria-hidden /> Zero spam, ever
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4" aria-hidden /> ₹0 forever
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-3xl bg-coal p-6 shadow-[0_30px_60px_rgba(33,29,25,0.3)] sm:p-8">
              {status === "done" ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-gold text-coal">
                    <PartyPopper className="h-7 w-7" aria-hidden />
                  </span>
                  <p className="font-display text-2xl font-semibold text-cream">Consider it done.</p>
                  <p className="text-sm leading-relaxed text-cream/60">{message}</p>
                  <a href="#spin" className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-black text-coal">
                    Spin while you wait
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <label htmlFor="newsletter-email" className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                    Your email
                  </label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@somewhere.com"
                      className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-semibold text-cream placeholder:text-cream/30 focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 text-sm font-black tracking-wide text-coal uppercase transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    >
                      {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                      Send wishes
                    </button>
                  </div>
                  {status === "error" && <p className="mt-3 text-sm font-bold text-[#ffb4b4]">{message}</p>}
                  <p className="mt-4 text-[11px] leading-relaxed font-semibold text-cream/35">
                    By subscribing you agree to receive one email a week. We will never sell your data or send you
                    anything boring.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
