'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, Store } from 'lucide-react';
import { usePortalAuth } from '@/modules/portal/shared/hooks';

const DEMO_ACCOUNTS = [
  { id: 'acct-1', name: 'Greenfield Dispensary', tier: 'Tier 1 — Premium', desc: 'Thriving account, VMI enrolled, full integrations' },
  { id: 'acct-2', name: 'Pacific Leaf', tier: 'Tier 2 — Standard', desc: 'At-risk, overdue payments, needs attention' },
  { id: 'acct-3', name: 'Cascade Wellness', tier: 'Tier 3 — New', desc: 'Recently onboarded, auto-accept enabled' },
] as const;

export default function PortalLoginPage() {
  const router = useRouter();
  const { login } = usePortalAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login('acct-1');
      router.push('/dashboard');
    }, 800);
  }

  function handleDemoLogin(accountId: string) {
    login(accountId);
    router.push('/dashboard');
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-base overflow-hidden">
      {/* Snowflake glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-primary/[0.03] blur-[120px] pointer-events-none" />

      <div className="animate-fade-in-up relative z-10 flex w-full max-w-md flex-col items-center px-6">
        {/* Logo */}
        <Image
          src="/FrostLogo_SnowflakeOnly.png"
          alt="Frost"
          width={240}
          height={240}
          className="h-[100px] w-[100px] mb-8 logo-glow-img"
          priority
        />

        {/* Portal badge */}
        <p className="text-xs text-text-muted tracking-widest uppercase mb-6 font-display">
          Partner Portal
        </p>

        {/* Demo Account Buttons */}
        <div className="w-full space-y-3 mb-6">
          <p className="text-xs text-text-muted uppercase tracking-wider text-center mb-3">
            Demo Accounts
          </p>
          {DEMO_ACCOUNTS.map((acct) => (
            <button
              key={acct.id}
              onClick={() => handleDemoLogin(acct.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-border-default bg-card px-4 py-3 text-left transition-all hover:bg-card-hover hover:border-accent-primary/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                <Store className="h-5 w-5 text-accent-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-default truncate">
                  {acct.name}
                </p>
                <p className="text-[11px] text-text-muted truncate">
                  {acct.tier} — {acct.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex w-full items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border-default" />
          <span className="text-xs text-text-muted uppercase tracking-wider">or sign in</span>
          <div className="flex-1 h-px bg-border-default" />
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="w-full space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-lg border border-border-default bg-elevated px-4 py-3 text-sm text-text-default placeholder:text-text-muted outline-none transition-colors focus:border-accent-primary/50 focus:bg-card-hover"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-lg border border-border-default bg-elevated px-4 py-3 pr-11 text-sm text-text-default placeholder:text-text-muted outline-none transition-colors focus:border-accent-primary/50 focus:bg-card-hover"
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

          <div className="flex justify-end">
            <button type="button" className="text-xs text-text-muted hover:text-text-default transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-default bg-white/[0.05] py-3 text-sm font-semibold text-text-default transition-all hover:bg-white/[0.1] disabled:opacity-60"
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

        {/* Age acknowledgment */}
        <p className="mt-6 text-[11px] text-text-muted text-center leading-relaxed">
          By accessing this portal, you confirm you are 21 years of age or older
          and hold a valid Washington State cannabis retail license.
        </p>

        {/* Contact link */}
        <p className="mt-4 text-sm text-text-muted">
          Need access?{' '}
          <a href="mailto:partners@frost.com" className="text-accent-primary/80 hover:text-accent-primary transition-colors">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
