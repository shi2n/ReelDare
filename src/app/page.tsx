"use client";

import Nav from "@/components/Nav";
import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import Spin from "@/components/Spin";
import DailyWish from "@/components/DailyWish";
import Categories from "@/components/Categories";
import Modes from "@/components/Modes";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Community from "@/components/Community";
import BeforeIDie from "@/components/BeforeIDie";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { MarqueeRow } from "@/components/ui/primitives";
import { useUser } from "@/lib/user";

const MARQUEE_A = [
  "SLEEP UNDER THE STARS",
  "TALK TO 10 STRANGERS",
  "FEED 100 PEOPLE",
  "RUN A HALF MARATHON",
  "MAKE YOUR FIRST REEL",
  "TAKE YOUR PARENTS ON A TRIP",
  "EAT BREAKFAST FOR DINNER",
  "WRITE TO YOUR FUTURE SELF",
];
const MARQUEE_B = [
  "LEARN SOMETHING USELESS",
  "WATCH A SUNRISE SOMEWHERE NEW",
  "PAY FOR A STRANGER'S MEAL",
  "DANCE LIKE NOBODY'S GRADING",
  "VISIT A CITY YOU CAN'T PRONOUNCE",
  "BUILD A FAKE MUSEUM",
  "SPEND A DAY IN SILENCE",
  "SAY YES ONCE",
];

export default function Home() {
  const { isLoggedIn, isReady } = useUser();

  return (
    <>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />

        {/* gold ticker band */}
        <div className="relative z-10 -mt-7 mb-2 rotate-[-1.2deg] scale-[1.02]">
          <MarqueeRow items={MARQUEE_A} className="bg-gold py-3.5 font-display text-sm font-bold tracking-[0.18em] text-coal" />
          <MarqueeRow
            items={MARQUEE_B}
            reverse
            fast
            className="mt-1.5 bg-coal py-3 font-display text-xs font-semibold tracking-[0.22em] text-gold"
          />
        </div>

        <Spin />
        <DailyWish />
        <Categories />
        <Modes />
        <Features />
        <Stats />
        <Community />
        <BeforeIDie />
        {/* Do not show pricing and FAQ after login */}
        {(!isReady || !isLoggedIn) && (
          <>
            <Pricing />
            <FAQ />
          </>
        )}
        <FinalCTA />
        <Newsletter />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
