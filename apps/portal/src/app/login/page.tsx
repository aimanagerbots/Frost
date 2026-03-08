'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store';

export default function LoginPage() {
  const router = useRouter();
  const { login, enterDemoMode } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      router.push('/dashboard');
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

        {/* Form */}
        <form onSubmit={handleSignIn} className="w-full space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#5BB8E6]/50 focus:bg-white/[0.05]"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#5BB8E6]/50 focus:bg-white/[0.05]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5BB8E6] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-6 text-sm text-white/40">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#5BB8E6]/80 hover:text-[#5BB8E6] transition-colors">
            Sign up
          </Link>
        </p>
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
