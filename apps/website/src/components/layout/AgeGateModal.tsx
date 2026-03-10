'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { verifyPassword } from '@/app/(site)/actions';

interface AgeGateModalProps {
  isAuthed: boolean;
}

export function AgeGateModal({ isAuthed }: AgeGateModalProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(isAuthed);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    setError('');
    setIsLoading(true);

    const result = await verifyPassword(password);

    if (result.success) {
      setDismissed(true);
      router.refresh();
    } else {
      setError('Incorrect password');
      setIsLoading(false);
    }
  }, [password, router]);

  const handleDeny = useCallback(() => {
    window.location.href = 'https://www.google.com';
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Age and password verification"
    >
      <div className="relative z-10 mx-4 w-full max-w-sm flex flex-col items-center px-6">
        {/* Logo */}
        <Image
          src="/FrostLogo_SnowflakeOnly.png"
          alt="Frost"
          width={240}
          height={240}
          className="h-[120px] w-[120px] mb-8 logo-glow-img"
        />

        {/* Question */}
        <h2 className="text-xl font-semibold text-white mb-2">
          Are you 21 or older?
        </h2>
        <p className="text-sm text-white/30 mb-6 text-center">
          You must be of legal age to view this website.
        </p>

        {/* Password field */}
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && password) handleConfirm(); }}
          placeholder="Enter password"
          className="mb-3 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white text-center placeholder:text-white/30 outline-none transition-colors focus:border-[#5BB8E6]/50 focus:bg-white/[0.05]"
        />

        {error && (
          <p className="mb-2 text-center text-xs text-red-400">{error}</p>
        )}

        {/* Confirm button */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading || !password}
          className="mb-3 w-full flex items-center justify-center gap-2 rounded-lg bg-[#5BB8E6] py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Yes, I\u2019m 21+"
          )}
        </button>

        {/* Deny button */}
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
