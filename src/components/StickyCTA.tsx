"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Dices } from "lucide-react";
import Link from "next/link";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const readSaved = () => {
      try {
        const s = JSON.parse(localStorage.getItem("tdbd-saved") ?? "[]") as unknown[];
        setSavedCount(Array.isArray(s) ? s.length : 0);
      } catch {
        setSavedCount(0);
      }
    };
    readSaved();
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("tdbd-update", readSaved);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("tdbd-update", readSaved);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 z-40 sm:right-6 sm:bottom-6 sm:left-auto"
        >
          <div className="flex gap-2">
            <Link
              href="/my-life"
              aria-label={`${savedCount} saved experiences — view my list`}
              className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-coal text-cream shadow-[0_14px_35px_rgba(33,29,25,0.4)] transition-transform hover:-translate-y-0.5"
            >
              <Bookmark className="h-5 w-5" aria-hidden />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-black text-coal">
                  {savedCount}
                </span>
              )}
            </Link>
            <Link
              href="/spin"
              className="group inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-black tracking-wide text-coal uppercase shadow-[0_18px_45px_rgba(212,168,67,0.5)] transition-all hover:-translate-y-0.5 sm:flex-none"
            >
              <Dices className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[180deg]" aria-hidden />
              Spin The Circle
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
