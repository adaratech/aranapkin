import type { Metadata } from "next";
import { Patrick_Hand } from "next/font/google";
import "./globals.css";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick-hand",
});

export const metadata: Metadata = {
  title: "AraNapkin — Visual Thinking Agent",
  description:
    "Trasforma idee complesse in chiarezza visiva con la metodologia di Dan Roam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${patrickHand.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        {children}
      </body>
    </html>
  );
}
