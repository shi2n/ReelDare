"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X, Check } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "reeldare-cookie-consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Small delay so it animates in smoothly after initial render
        const timer = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {}
    setShow(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "essential-only");
    } catch {}
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl sm:bottom-6"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie and Privacy Consent"
        >
          <div className="noise rounded-2xl border border-white/15 bg-coal/95 p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="flex items-start gap-3.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                <Cookie className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex-1 text-xs text-cream/80 leading-relaxed sm:text-[13px]">
                <p className="font-semibold text-cream">
                  We value your privacy & transparency.
                </p>
                <p className="mt-1">
                  Reel Dare uses essential cookies & local storage to remember your saved dares, session, and level progress. We do not sell data or use third-party tracking. Learn more in our{" "}
                  <Link href="/cookies" className="text-gold underline hover:brightness-110 font-bold">
                    Cookies Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="text-gold underline hover:brightness-110 font-bold">
                    Terms & Conditions
                  </Link>
                  .
                </p>
                <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={accept}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-xs font-bold text-coal transition-all hover:brightness-110 active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={decline}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-cream/75 transition-colors hover:bg-white/10 hover:text-cream active:scale-95"
                  >
                    Essential Only
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={accept}
                aria-label="Close cookie banner"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-cream/50 transition-colors hover:bg-white/10 hover:text-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
