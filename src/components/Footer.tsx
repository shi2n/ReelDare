"use client";

import { Dices, Mail, MapPin } from "lucide-react";
import Link from "next/link";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconYoutube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2.7 7.2a3 3 0 0 1 2.7-2.6C7.9 4.3 10.3 4.3 12 4.3s4.1 0 6.6.3a3 3 0 0 1 2.7 2.6c.2 1.5.2 3 .2 4.8s0 3.3-.2 4.8a3 3 0 0 1-2.7 2.6c-2.5.3-4.9.3-6.6.3s-4.1 0-6.6-.3a3 3 0 0 1-2.7-2.6C2.5 15.3 2.5 13.6 2.5 12s0-3.3.2-4.8Z" />
      <path d="M10 9.2v5.6l5-2.8-5-2.8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTiktok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M9.5 8.2v8.3a3.4 3.4 0 1 1-3.4-3.4" />
      <path d="M9.5 8.2a6.2 6.2 0 0 0 6 5.3V9.9a3.5 3.5 0 0 1-2.2-3.3h-3.8" />
    </svg>
  );
}
function IconMail({ className }: { className?: string }) {
  return <Mail className={className} aria-hidden />;
}

const EXPLORE = [
  { label: "Spin the Wheel", href: "/spin" },
  { label: "Browse Categories", href: "/categories" },
  { label: "Before I Die...", href: "/my-life" },
];
const PLATFORM = [
  { label: "My Life & The 100", href: "/my-life" },
  { label: "Features & Modes", href: "/features" },
  { label: "Safety & Ethics", href: "/faq" },
];
const START = [
  { label: "FAQ & Help", href: "/faq" },
  { label: "Get in touch", href: "mailto:hello@reeldare.com" },
];

export default function Footer() {
  return (
    <footer className="noise relative overflow-hidden bg-coal text-cream">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-10">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gold text-coal">
                <Dices className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-base leading-[1.05] font-bold tracking-wider uppercase">
                Reel
                <span className="block italic text-gold">Dare</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/55">
              A place to find something worth doing. Not a checklist — a library of your possible life, one dare at a
              time.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-cream/40">
              <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden />
              Everywhere there's a sky
            </p>
            <div className="mt-6 flex gap-2.5">
              {[
                { icon: IconInstagram, label: "Instagram", href: "https://instagram.com" },
                { icon: IconYoutube, label: "YouTube", href: "https://youtube.com" },
                { icon: IconTiktok, label: "TikTok", href: "https://tiktok.com" },
                { icon: IconMail, label: "Email us", href: "mailto:hello@reeldare.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 text-cream/60 transition-all hover:border-gold hover:bg-gold hover:text-coal"
                >
                  <s.icon className="h-4.5 w-4.5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Explore", links: EXPLORE },
            { title: "Platform", links: PLATFORM },
            { title: "Get started", links: START },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-bold tracking-[0.24em] text-gold uppercase">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("mailto") ? (
                      <a
                        href={l.href}
                        className="text-sm font-semibold text-cream/60 transition-colors hover:text-gold"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm font-semibold text-cream/60 transition-colors hover:text-gold"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="dashed-edge" aria-hidden />

        <p className="font-display py-10 text-center text-[7.5vw] leading-none font-semibold tracking-tight text-outline-cream select-none lg:text-[6rem]">
          REEL DARE
        </p>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs font-semibold text-cream/40 sm:flex-row">
          <p>© 2026 Reel Dare. Spin. Film. Live — safely, kindly, legally.</p>
          <div className="flex items-center gap-5">
            <Link href="/faq" className="transition-colors hover:text-gold">Privacy</Link>
            <Link href="/faq" className="transition-colors hover:text-gold">Terms</Link>
            <Link href="/faq" className="transition-colors hover:text-gold">Safety</Link>
            <Link href="/faq" className="transition-colors hover:text-gold">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
