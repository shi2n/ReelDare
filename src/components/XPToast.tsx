"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Trophy, Zap, X } from "lucide-react";
import { useUser } from "@/lib/user";

export default function XPToast() {
  const { recentAward, clearRecentAward } = useUser();

  useEffect(() => {
    if (recentAward) {
      const timer = setTimeout(() => {
        clearRecentAward();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [recentAward, clearRecentAward]);

  return (
    <AnimatePresence>
      {recentAward && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm"
        >
          <div
            className={`flex items-start gap-3.5 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border ${
              recentAward.leveledUp
                ? "border-amber-400 bg-gradient-to-r from-amber-950 via-coal to-amber-950 text-cream"
                : "border-gold/40 bg-coal-2 text-cream"
            }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-lg ${
                recentAward.leveledUp
                  ? "bg-gradient-to-tr from-amber-400 to-yellow-200 text-coal"
                  : "bg-gold text-coal"
              }`}
            >
              {recentAward.leveledUp ? (
                <Trophy className="h-6 w-6 animate-bounce" />
              ) : (
                <Zap className="h-6 w-6" />
              )}
            </div>

            <div className="flex-1 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-gold">
                  +{recentAward.amount} XP EARNED!
                </span>
                {recentAward.leveledUp && (
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-coal uppercase animate-pulse">
                    LEVEL UP!
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-cream/80 font-medium leading-snug">
                {recentAward.reason}
              </p>

              {recentAward.leveledUp && recentAward.newRankName && (
                <p className="mt-1 text-xs font-bold text-amber-300">
                  🎉 New Rank Achieved: {recentAward.newRankName}!
                </p>
              )}

              <p className="mt-1.5 text-[10px] font-semibold text-cream/40">
                Total XP: {recentAward.newTotalXp.toLocaleString()} XP
              </p>
            </div>

            <button
              type="button"
              onClick={clearRecentAward}
              className="text-cream/40 transition-colors hover:text-cream"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
