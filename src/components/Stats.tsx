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
    { value: stats.experiences, suffix: "+", label: "Experiences in the library", sub: "and counting toward 10,000" },
    { value: stats.completions, suffix: "", label: "Things actually done", sub: "real wishes, completed" },
    { value: stats.members, suffix: "", label: "Humans collecting memories", sub: "instead of things" },
    { value: stats.countries, suffix: "", label: "Countries on the life map", sub: "every pin is a memory" },
  ];

  return (
    <section className="bg-cream py-20 sm:py-24" aria-label="Community numbers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
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
