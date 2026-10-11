"use client";

import { useEffect, useState } from "react";
import { CountUp, Reveal } from "@/components/ui/primitives";

export default function Stats() {
  const [stats, setStats] = useState({ experiences: 2000, members: 48210, completions: 128400, countries: 63 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.experiences === "number") setStats(d);
      })
      .catch(() => {});
  }, []);

  const items = [
    { value: 2053, suffix: "+", label: "Challenges & Dares", sub: "in the verified library" },
    { value: 13, suffix: "", label: "Life Categories", sub: "from Quiet to Crazy Stunts" },
    { value: 100, suffix: "%", label: "Free to Spin", sub: "no subscription needed" },
  ];

  return (
    <section className="bg-cream py-20 sm:py-24" aria-label="Platform numbers">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-5xl font-semibold text-ink sm:text-6xl">
                <CountUp to={s.value} suffix={s.suffix} />
                {s.suffix ? null : <span className="text-gold">.</span>}
              </p>
              <p className="mt-3 text-sm font-bold tracking-wide text-ink/70 uppercase">{s.label}</p>
              <p className="mt-1 text-xs font-semibold text-ink/40">{s.sub}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
