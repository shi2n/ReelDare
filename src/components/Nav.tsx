"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Dices, Menu, X, Sparkles, User, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/user";

const LINKS = [
  { label: "Spin Wheel", href: "/spin" },
  { label: "Categories", href: "/categories" },
  { label: "My Life", href: "/my-life" },
  { label: "FAQ", href: "/faq" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoggedIn, isReady, currentRank } = useUser();

  // Hide marketing links (FAQ) once the user is confirmed logged in on client
  const activeLinks = isReady && isLoggedIn
    ? [
        { label: "Spin Wheel", href: "/spin" },
        { label: "Categories", href: "/categories" },
        { label: "My Life", href: "/my-life" },
        { label: "My Profile", href: "/profile" },
      ]
    : [
        { label: "Spin Wheel", href: "/spin" },
        { label: "Categories", href: "/categories" },
        { label: "My Life", href: "/my-life" },
        { label: "FAQ", href: "/faq" },
      ];

  const isDarkPage =
    pathname === "/spin" ||
    pathname === "/my-life" ||
    pathname === "/mylife" ||
    pathname === "/features" ||
    pathname === "/profile" ||
    pathname === "/login";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? isDarkPage
              ? "bg-coal/90 border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              : "bg-cream/90 border-b border-ink/5 shadow-[0_8px_30px_rgba(33,29,25,0.08)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="group flex items-center gap-3" aria-label="Reel Dare — home">
            <span
              className={`grid h-10 w-10 place-items-center rounded-2xl transition-colors ${
                scrolled
                  ? isDarkPage
                    ? "bg-gold text-coal"
                    : "bg-coal text-gold"
                  : "bg-gold text-coal"
              }`}
            >
              <Dices className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[360deg]" aria-hidden />
            </span>
            <span
              className={`font-display text-base leading-[1.05] font-bold tracking-wider uppercase transition-colors ${
                scrolled
                  ? isDarkPage
                    ? "text-cream"
                    : "text-ink"
                  : isDarkPage
                  ? "text-cream"
                  : "text-ink"
              }`}
            >
              Reel
              <span className="block italic text-gold">Dare</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {activeLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-gold/20 text-gold"
                      : scrolled
                      ? isDarkPage
                        ? "text-cream/80 hover:bg-white/10 hover:text-cream"
                        : "text-ink/75 hover:bg-ink/5 hover:text-ink"
                      : isDarkPage
                      ? "text-cream/80 hover:bg-white/10 hover:text-cream"
                      : "text-ink/75 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            {/* User Profile & Rank XP Pill */}
            {isReady && user ? (
              <Link
                href="/profile"
                className={`hidden items-center gap-2 rounded-full border border-gold/40 bg-gold/10 py-1.5 pr-2.5 pl-2 transition-all hover:bg-gold/20 sm:inline-flex`}
                title={`Level ${currentRank.level} (${currentRank.name}) · ${user.xp} XP`}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black shadow-sm"
                  style={{ backgroundColor: currentRank.color, color: "#211d19" }}
                >
                  {currentRank.badge}
                </span>
                <span className={`text-xs font-bold ${isDarkPage ? "text-cream" : scrolled ? "text-ink" : "text-cream"}`}>
                  @{user.username}
                </span>
                <span className="flex items-center gap-0.5 rounded-full bg-gold px-2 py-0.5 text-[10px] font-black text-coal">
                  <Zap className="h-2.5 w-2.5" />
                  {user.xp} XP
                </span>
              </Link>
            ) : isReady ? (
              <Link
                href="/login"
                className={`hidden items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors sm:inline-flex ${
                  isDarkPage
                    ? "border-white/20 text-cream hover:border-gold hover:text-gold"
                    : scrolled
                    ? "border-ink/20 text-ink hover:border-gold hover:text-gold-deep"
                    : "border-white/20 text-cream hover:border-gold hover:text-gold"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                Login
              </Link>
            ) : null}

            <Link
              href="/spin"
              className="hidden items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-coal shadow-[0_10px_30px_rgba(212,168,67,0.35)] transition-all hover:-translate-y-0.5 sm:inline-flex"
            >
              <Dices className="h-4 w-4" aria-hidden />
              Spin Circle
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`grid h-11 w-11 place-items-center rounded-2xl transition-colors lg:hidden ${
                scrolled
                  ? isDarkPage
                    ? "bg-white/10 text-cream"
                    : "bg-ink/5 text-ink"
                  : isDarkPage
                  ? "bg-white/10 text-cream"
                  : "bg-ink/5 text-ink"
              }`}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="noise fixed inset-0 z-[60] flex flex-col bg-coal"
          >
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">
              <span className="font-display text-base font-bold tracking-wider text-cream uppercase">
                Reel <span className="italic text-gold">Dare</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-cream"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {/* Profile snippet in mobile drawer */}
            {isReady && user && (
              <div className="mx-8 mt-2 rounded-2xl border border-gold/30 bg-gold/10 p-4">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black"
                      style={{ backgroundColor: currentRank.color, color: "#211d19" }}
                    >
                      {currentRank.badge}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-cream">@{user.username}</p>
                      <p className="text-[11px] text-gold font-semibold uppercase">
                        {currentRank.name} (Lvl {currentRank.level})
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-black text-coal">
                    ⚡ {user.xp} XP
                  </span>
                </Link>
              </div>
            )}

            <div className="flex flex-1 flex-col justify-center gap-1 px-8">
              {[
                { label: "Home", href: "/" },
                ...(isReady && isLoggedIn ? [] : [{ label: "Profile & Rank", href: "/login" }]),
                ...activeLinks,
              ].map((l, i) => (
                <motion.div
                  key={`${l.href}-${l.label}`}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.03, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 border-b border-white/10 py-3"
                  >
                    <span className="text-xs font-bold text-gold">0{i + 1}</span>
                    <span className="font-display text-2xl font-semibold text-cream transition-colors group-hover:text-gold sm:text-3xl">
                      {l.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-8 pb-8"
            >
              <Link
                href="/spin"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gold py-3.5 text-base font-bold text-coal"
              >
                <Dices className="h-5 w-5" aria-hidden />
                Spin The Circle
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
