import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Reel Dare — Spin. Film. Live.",
  description:
    "A place to find something worth doing. 2,000+ experiences, a random dare wheel, your personal My 100 bucket list, Reel film plans, and verified proofs. Spin the wheel, film the dare, and share the memory.",
  keywords: [
    "reel dare",
    "bucket list",
    "video dares",
    "random challenge generator",
    "life experiences",
    "adventure ideas",
  ],
  openGraph: {
    title: "Reel Dare",
    description: "Spin. Film. Live. Find something you've never done and capture the dare.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#211d19",
  width: "device-width",
  initialScale: 1,
};

import Providers from "@/components/Providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-cream font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
