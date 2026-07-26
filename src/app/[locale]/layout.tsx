import type { Metadata } from "next";
import { Inter, Playfair_Display, Merriweather } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import CookieBanner from "@/components/ui/CookieBanner";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LawGuide AI India | Enterprise Legal Tech",
    template: "%s | LawGuide AI"
  },
  description: "Advanced AI-powered legal guidance platform providing instant, accurate, and secure legal analysis for the Indian judicial system.",
  keywords: ["AI Lawyer", "Legal Tech", "India Law", "Legal Analysis", "LawGuide AI"],
  authors: [{ name: "LawGuide Team" }],
  creator: "LawGuide AI",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://lawguide.ai",
    title: "LawGuide AI India | Enterprise Legal Tech",
    description: "Advanced AI-powered legal guidance platform.",
    siteName: "LawGuide AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LawGuide AI India",
    description: "Enterprise-grade AI legal guidance platform.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#07111f" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${merriweather.variable} antialiased`}
      >
        <AnalyticsProvider>
          <AuthProvider>
            <ReduxProvider>
              <QueryProvider>
                <SmoothScroll>
                  <Navbar />
                  <main>{children}</main>
                  <CookieBanner />
                  <Footer />
                </SmoothScroll>
              </QueryProvider>
            </ReduxProvider>
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
