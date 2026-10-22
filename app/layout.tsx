import { Loader } from "@/components/public/loader";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import type { Metadata } from "next";
import { Hind_Siliguri, Instrument_Serif, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: "italic",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  variable: "--font-bengali",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EEE Academy",
    template: "%s · EEE Academy",
  },
  description:
    "Diploma EEE courses, mentors, and class demos for polytechnic students in Bangladesh.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${instrument.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg font-body text-text-primary">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Loader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
