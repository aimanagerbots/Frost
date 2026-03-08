import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
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
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-base text-text-default">
        {children}
      </body>
    </html>
  );
}
