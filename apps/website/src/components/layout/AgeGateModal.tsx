'use client';

import { useState, useSyncExternalStore, useCallback } from 'react';
import Image from 'next/image';

const AGE_GATE_KEY = 'frost-age-verified';

function getSnapshot(): boolean {
  return localStorage.getItem(AGE_GATE_KEY) === 'true';
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function AgeGateModal() {
  const isVerifiedInStorage = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  const handleConfirm = useCallback(() => {
    localStorage.setItem(AGE_GATE_KEY, 'true');
    setDismissed(true);
  }, []);

  const handleDeny = useCallback(() => {
    window.location.href = 'https://www.google.com';
  }, []);

  if (isVerifiedInStorage || dismissed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
    >
      <div className="relative z-10 mx-4 w-full max-w-sm flex flex-col items-center px-6">
        {/* Logo */}
        <Image
          src="/FrostLogo_SnowflakeOnly.png"
          alt="Frost"
          width={240}
          height={240}
          className="h-[120px] w-[120px] mb-8"
        />

        {/* Question */}
        <h2 className="text-xl font-semibold text-white mb-2">
          Are you 21 or older?
        </h2>
        <p className="text-sm text-white/30 mb-8 text-center">
          You must be of legal age to view this website.
        </p>

        {/* Confirm button — matches login "Explore Demo" style */}
        <button
          type="button"
          onClick={handleConfirm}
          className="mb-3 w-full rounded-lg bg-[#5BB8E6] py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          Yes, I&apos;m 21+
        </button>

        {/* Deny button — matches login "Sign In" style */}
        <button
          type="button"
          onClick={handleDeny}
          className="w-full rounded-lg bg-white/10 border border-white/10 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/15 hover:text-white"
        >
          No, I&apos;m not
        </button>

        {/* Compliance note */}
        <p className="mt-8 text-xs leading-relaxed text-white/30 text-center">
          This website contains information about cannabis products. By entering, you confirm
          that you are at least 21 years of age or a valid medical cannabis patient.
        </p>
      </div>
    </div>
  );
}
