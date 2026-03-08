import type { Metadata } from "next";
import { Sora, Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frost — Cannabis Operations Platform",
  description: "AI-powered cannabis operations platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('frost-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light')}var p=localStorage.getItem('frost-ui-preferences');if(p){var o=JSON.parse(p);var m={subtle:'rgba(91,184,230,0.05)',normal:'rgba(91,184,230,0.15)',strong:'rgba(91,184,230,0.30)'};if(o.hoverIntensity&&m[o.hoverIntensity]){document.documentElement.style.setProperty('--accent-hover',m[o.hoverIntensity])}}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${sora.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased bg-base text-text-default`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
