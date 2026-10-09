import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import ChallengeArena from "@/components/ChallengeArena";

export const metadata: Metadata = {
  title: "🔥 Public Acts (1,000 Challenges) — Reel Dare",
  description:
    "Do it in public. If you dare. 1,000 bold, respectful, street-smart confidence challenges designed to test your courage in the real world. Spin now on Reel Dare.",
  openGraph: {
    title: "🔥 Public Acts — 1,000 Challenges | Reel Dare",
    description: "Do it in public. If you dare. 1,000 bold real-world confidence challenges.",
  },
};

export default function PublicActsPage() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main>
        <ChallengeArena category="public_acts" />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
