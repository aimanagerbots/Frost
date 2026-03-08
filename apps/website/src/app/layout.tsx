import type { Metadata } from "next";
import { Sora, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frost — Craft Cannabis, Cultivated with Care",
  description:
    "Premium craft cannabis from Washington State. Explore our flower, concentrates, edibles, and more. Find a dispensary near you.",
  openGraph: {
    title: "Frost — Craft Cannabis, Cultivated with Care",
    description:
      "Premium craft cannabis from Washington State. Explore our flower, concentrates, edibles, and more.",
    siteName: "Frost",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-base text-text-default" style={{ fontFamily: 'var(--font-display), var(--font-sans), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
