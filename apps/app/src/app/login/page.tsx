'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, enterDemoMode, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    await loginWithEmail(email, password);
    const state = useAuthStore.getState();
    if (state.isAuthenticated) {
      router.push('/dashboard');
    }
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
          className="h-[120px] w-[120px] mb-8"
          priority
        />

        {/* Demo Mode Button — prominent, above the form */}
        <button
          onClick={handleDemoMode}
          className="mb-6 w-full rounded-lg bg-[#5BB8E6] py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          Explore Demo
        </button>

        {/* Divider */}
        <div className="flex w-full items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/30 uppercase tracking-wider">or sign in</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 w-full rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
            <button onClick={clearError} className="ml-2 text-red-400/60 hover:text-red-400">
              &times;
            </button>
          </div>
        )}

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
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/10 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/15 hover:text-white disabled:opacity-60"
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
