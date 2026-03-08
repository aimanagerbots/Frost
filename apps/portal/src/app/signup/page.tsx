'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store';

export default function SignupPage() {
  const router = useRouter();
  const { enterDemoMode } = useAuthStore();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  }

  function handleDemoMode() {
    enterDemoMode();
    router.push('/dashboard?demo=true');
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden">
      {/* Snowflake glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#5BB8E6]/[0.03] blur-[120px] pointer-events-none" />

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
          className="h-[120px] w-[120px] mb-10"
          priority
        />

        {isSubmitted ? (
          /* Success state */
          <div className="flex w-full flex-col items-center text-center" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <CheckCircle2 className="h-10 w-10 text-[#5BB8E6]/80 mb-4" />
            <p className="text-sm text-white/70 leading-relaxed">
              Check your email for further instructions.
            </p>
            <Link
              href="/login"
              className="mt-8 text-sm text-[#5BB8E6]/80 hover:text-[#5BB8E6] transition-colors"
            >
              Back to login
            </Link>
          </div>
        ) : (
          /* Signup form */
          <>
            <form onSubmit={handleSignUp} className="w-full space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#5BB8E6]/50 focus:bg-white/[0.05]"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5BB8E6] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <p className="mt-6 text-sm text-white/40">
              Already have an account?{' '}
              <Link href="/login" className="text-[#5BB8E6]/80 hover:text-[#5BB8E6] transition-colors">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>

      {/* Demo button — pinned to bottom */}
      <button
        onClick={handleDemoMode}
        className="absolute bottom-8 text-xs text-white/25 hover:text-white/50 tracking-widest uppercase transition-colors"
      >
        Demo
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
