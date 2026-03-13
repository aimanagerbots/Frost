'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type PageState = 'loading' | 'ready' | 'success' | 'error' | 'expired';

export default function SetPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState('');

  // On mount, listen for Supabase to exchange the URL hash token for a session
  useEffect(() => {
    if (!supabase) {
      setState('error');
      setError('System not configured.');
      return;
    }

    // Supabase client detects the hash fragment and fires onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name || '');
          setState('ready');
        }
      }
      if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name || '');
          setState('ready');
        } else {
          // No session from hash — check if hash params exist
          const hash = window.location.hash;
          if (!hash || !hash.includes('access_token')) {
            setState('expired');
          }
          // If hash exists but no session yet, wait for SIGNED_IN event
        }
      }
    });

    // Timeout fallback — if no auth event fires in 5s, show expired
    const timeout = setTimeout(() => {
      if (state === 'loading') setState('expired');
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!supabase) {
      setError('System not configured.');
      return;
    }

    setIsSaving(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setIsSaving(false);
        return;
      }

      // Call confirm-activation to mark profile active + send confirmation email
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
          await fetch(`${supabaseUrl}/functions/v1/confirm-activation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionData.session.access_token}`,
            },
          });
        }
      } catch {
        // Non-critical — profile trigger will also mark active
      }

      // Sign out so they go through the normal login flow
      await supabase.auth.signOut();
      setState('success');
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSaving(false);
    }
  }

  // Password strength indicator
  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

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
          className="h-[100px] w-[100px] mb-8"
          priority
        />

        {/* Loading state */}
        {state === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#5BB8E6]" />
            <p className="text-sm text-white/50">Verifying your invite...</p>
          </div>
        )}

        {/* Expired / invalid link */}
        {state === 'expired' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Invite Link Expired</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              This invite link is no longer valid. Please ask your administrator to send a new invitation.
            </p>
          </div>
        )}

        {/* Error state */}
        {state === 'error' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Something Went Wrong</h2>
            <p className="text-sm text-white/50">{error}</p>
          </div>
        )}

        {/* Success state */}
        {state === 'success' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20" style={{ animation: 'scaleIn 0.4s ease-out' }}>
              <CheckCircle className="h-7 w-7 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">You&apos;re All Set</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Your password has been set. You can now sign in to Frost.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#5BB8E6] py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              Go to Sign In
            </button>
          </div>
        )}

        {/* Set password form */}
        {state === 'ready' && (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-white">
                {userName ? `Welcome, ${userName}` : 'Welcome to Frost'}
              </h2>
              <p className="mt-1.5 text-sm text-white/40">
                Set a password to activate your account.
              </p>
            </div>

            {error && (
              <div className="mb-4 w-full rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#5BB8E6]/50 focus:bg-white/[0.05]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength indicator */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            strength >= level ? strengthColors[strength] : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-white/40">{strengthLabels[strength]}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  required
                  minLength={8}
                  className={`w-full rounded-lg border bg-white/[0.03] px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:bg-white/[0.05] ${
                    confirm.length > 0 && confirm !== password
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : 'border-white/10 focus:border-[#5BB8E6]/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirm.length > 0 && confirm !== password && (
                <p className="text-xs text-red-400">Passwords do not match</p>
              )}

              <button
                type="submit"
                disabled={isSaving || password.length < 8 || password !== confirm}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5BB8E6] py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting password...
                  </>
                ) : (
                  'Set Password & Activate'
                )}
              </button>
            </form>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
