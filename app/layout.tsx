import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MixpanelProvider from "./components/MixpanelProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Honam DeFi Analyzer - AI-Powered DeFi Project Analysis",
  description: "Analyze DeFi projects with AI. Upload whitepapers, documentation, and code to get comprehensive risk analysis, highlights, and expert insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MixpanelProvider>
          {children}
        </MixpanelProvider>
      </body>
    </html>
  );
}
