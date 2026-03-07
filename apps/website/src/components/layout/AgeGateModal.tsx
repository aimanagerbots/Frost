'use client';

import { useState, useEffect } from 'react';

const AGE_GATE_KEY = 'frost-age-verified';

export function AgeGateModal() {
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(AGE_GATE_KEY);
    if (stored === 'true') {
      setVerified(true);
    }
  }, []);

  // Don't render on server or if already verified
  if (!mounted || verified) {
    return null;
  }

  const handleConfirm = () => {
    localStorage.setItem(AGE_GATE_KEY, 'true');
    setVerified(true);
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
    >
      <div className="mx-4 w-full max-w-md space-y-8 rounded-2xl border border-border-default bg-card p-10 text-center">
        {/* Logo */}
        <h1 className="font-display text-4xl tracking-wide text-text-default">Frost</h1>

        {/* Question */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-text-default">
            Are you 21 or older?
          </h2>
          <p className="text-sm text-text-muted">
            You must be of legal age to view this website.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-accent-primary px-8 py-3 text-sm font-medium text-text-on-dark transition-colors hover:bg-accent-primary-hover"
          >
            Yes, I&apos;m 21+
          </button>
          <button
            type="button"
            onClick={handleDeny}
            className="rounded-full border border-border-default bg-transparent px-8 py-3 text-sm font-medium text-text-muted transition-colors hover:border-border-hover hover:text-text-default"
          >
            No, I&apos;m not
          </button>
        </div>

        {/* Compliance note */}
        <p className="text-xs leading-relaxed text-text-muted">
          This website contains information about cannabis products. By entering, you confirm
          that you are at least 21 years of age or a valid medical cannabis patient.
        </p>
      </div>
    </div>
  );
}
