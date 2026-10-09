"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

/* -------- Scroll reveal -------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* -------- Depth parallax wrapper -------- */
export function Parallax({
  children,
  speed = 0.5,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 60, speed * -60]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* -------- Animated counter -------- */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.8,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* -------- Marquee row -------- */
export function MarqueeRow({
  items,
  reverse = false,
  fast = false,
  className = "",
  itemClassName = "",
}: {
  items: string[];
  reverse?: boolean;
  fast?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className={`mx-5 inline-flex items-center gap-5 whitespace-nowrap ${itemClassName}`}>
          {t}
          <Sparkles className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
        </span>
      ))}
    </>
  );
  return (
    <div className={`relative flex w-full overflow-hidden ${className}`}>
      <div
        className={`flex w-max items-center ${fast ? "animate-marquee-fast" : "animate-marquee"}`}
        style={reverse ? { animationDirection: "reverse" } : undefined}
        aria-hidden={false}
      >
        {row}
        {row}
      </div>
    </div>
  );
}

/* -------- Section heading -------- */
export function SectionHeading({
  kicker,
  title,
  sub,
  dark = false,
  align = "center",
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <p
          className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.22em] uppercase ${
            dark ? "bg-white/10 text-gold" : "bg-gold-soft text-gold-deep"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl ${
            dark ? "text-cream" : "text-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={0.16}>
          <p className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? "text-cream/70" : "text-ink/60"}`}>{sub}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
