import Image from "next/image";
import { Mail, Instagram, Twitter } from "lucide-react";

export default function MaintenancePage() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-6 py-16 max-w-lg mx-auto">
      <Image
        src="/FrostLogo_wordmark.png"
        alt="Frost"
        width={400}
        height={100}
        className="h-16 w-auto mb-12"
        priority
      />

      <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
        We&apos;ll Be Right Back
      </h1>

      <p className="text-white/60 text-lg leading-relaxed mb-8">
        Our site is currently undergoing scheduled maintenance. We should be
        back shortly. Thank you for your patience.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-8 py-6 mb-10 w-full">
        <p className="text-white/40 text-sm uppercase tracking-widest mb-1">
          Expected Back By
        </p>
        <p className="text-white text-2xl font-display">Coming Soon</p>
      </div>

      <div className="space-y-3 text-white/60 text-sm">
        <p className="flex items-center justify-center gap-2">
          <Mail className="w-4 h-4 text-[#5BB8E6]" />
          hello@frostcannabis.com
        </p>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <a
          href="https://instagram.com/frostcannabis"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a
          href="https://twitter.com/frostcannabis"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-colors"
          aria-label="Twitter"
        >
          <Twitter className="w-5 h-5" />
        </a>
      </div>
    </main>
  );
}
