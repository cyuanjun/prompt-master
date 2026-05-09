import type { Metadata } from "next";
import { Caveat, Kalam, Patrick_Hand } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
  weight: ["300", "400", "700"],
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-patrick",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Prompt Battle Arena",
  description: "Guess the prompt. Recreate the vision. Win the battle!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${kalam.variable} ${patrickHand.variable}`}
    >
      <body className="font-label">{children}</body>
    </html>
  );
}
