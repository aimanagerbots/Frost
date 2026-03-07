'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store';

export default function LoginPage() {
  const router = useRouter();
  const { login, enterDemoMode } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="relative flex min-h-screen items-center justify-center bg-base overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(102,126,234,0.08)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(118,75,162,0.06)_0%,_transparent_60%)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo + Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute -inset-4 rounded-full bg-[#F59E0B]/5 blur-2xl" />
            <Image
              src="/FrostLogo_SnowflakeOnly.png"
              alt="Frost"
              width={160}
              height={160}
              className="relative h-20 w-20"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-[0.3em] text-text-bright">FROST</h1>
          <p className="mt-2 text-sm text-text-muted">AI-Powered Cannabis Operations Platform</p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-default bg-card p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-text-muted">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@frostfarms.com"
                  className="w-full rounded-lg border border-default bg-base py-2.5 pl-10 pr-4 text-sm text-text-default placeholder:text-text-muted/50 outline-none focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/20 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-text-muted">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-default bg-base py-2.5 pl-10 pr-10 text-sm text-text-default placeholder:text-text-muted/50 outline-none focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-default transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-default bg-base accent-[#F59E0B]"
                />
                <span className="text-xs text-text-muted">Remember me</span>
              </label>
              <button type="button" className="text-xs text-text-muted hover:text-text-default transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F59E0B] py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#F59E0B]/90 disabled:opacity-60"
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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-default" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-text-muted">or</span>
            </div>
          </div>

          {/* Demo Mode */}
          <button
            onClick={handleDemoMode}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-default py-2.5 text-sm font-medium text-text-default transition-all hover:border-[#F59E0B]/30 hover:bg-[#F59E0B]/5"
          >
            <Sparkles className="h-4 w-4 text-[#F59E0B]" />
            Enter Demo Mode — Explore with sample data
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-muted/60">&copy; 2026 Frost Farms LLC</p>
          <p className="mt-1 text-[10px] text-text-muted/40">Washington State Licensed Producer/Processor</p>
        </div>
      </div>
    </div>
  );
}
