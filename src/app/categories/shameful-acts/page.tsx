import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import ChallengeArena from "@/components/ChallengeArena";

export const metadata: Metadata = {
  title: "😳 Shameful Acts (1,000 Challenges) — Reel Dare",
  description:
    "Can you handle the embarrassment? 1,000 awkward, cringe-worthy, funny, and confidence-testing challenges to break out of your comfort zone. Spin now on Reel Dare.",
  openGraph: {
    title: "😳 Shameful Acts — 1,000 Challenges | Reel Dare",
    description: "Can you handle the embarrassment? 1,000 cringe and confidence-building challenges.",
  },
};

export default function ShamefulActsPage() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main>
        <ChallengeArena category="shameful_acts" />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
