'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      // Return to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }, 800);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden">
      <div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-6"
        style={{ animation: 'fadeIn 0.8s ease-out' }}
      >
        {/* Logo */}
        <Image
          src="/FrostLogo_SnowflakeOnly.png"
          alt="Frost"
          width={240}
          height={240}
          className="h-[100px] w-[100px] mb-8"
          priority
        />

        {submitted ? (
          <div className="flex w-full flex-col items-center text-center">
            <p className="text-sm text-white">
              Check your email for instructions
            </p>
            <p className="mt-2 text-xs text-white/30">
              Redirecting to login...
            </p>
            <Link
              href="/login"
              className="mt-6 flex items-center gap-1.5 text-xs text-[#5BB8E6]/50 hover:text-[#5BB8E6] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-white/40 text-center">
              Enter your email and we&apos;ll send you reset instructions.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white outline-none transition-colors focus:border-[#5BB8E6]/50 focus:bg-white/[0.05]"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5BB8E6] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </form>

            <Link
              href="/login"
              className="mt-6 flex items-center gap-1.5 text-xs text-[#5BB8E6]/50 hover:text-[#5BB8E6] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to login
            </Link>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
