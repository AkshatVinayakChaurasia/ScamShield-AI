import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScamShield AI — Know Before You Trust",
  description:
    "Universal AI-powered scam detection and digital safety platform. Verify suspicious messages, links, screenshots, and documents before interacting.",
  keywords: [
    "scam detection",
    "phishing",
    "AI",
    "cybersecurity",
    "fraud prevention",
    "digital safety",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
