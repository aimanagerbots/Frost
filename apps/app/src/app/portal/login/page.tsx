'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortalAuth } from '@/modules/portal/shared/hooks';

export default function PortalLoginPage() {
  const router = useRouter();
  const { login } = usePortalAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!supabase) {
      setError('Authentication not configured.');
      setIsLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    login('acct-1');
    router.push('/portal/dashboard');
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="card">
          <div className="avatar-wrap">
            <div className="avatar-badge">
              <Image src="/FrostLogo_SnowflakeOnly.png" alt="Frost" width={148} height={148} priority />
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: 16, width: '100%', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 16px', fontSize: 13, color: '#f87171', textAlign: 'center' }}>
              {error}
              <button onClick={() => setError(null)} style={{ marginLeft: 8, color: 'rgba(248,113,113,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <div className="input-row">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input type="email" placeholder="Email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="input-row">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <input type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>

            <button className="btn-login" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          font-family: 'Inter', var(--font-sans), sans-serif;
          background: #09090F;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow: hidden;
          position: relative;
          padding-top: 2vh;
        }
        .login-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(91,184,230,0.055) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .login-page::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }
        .login-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
        }
        .card {
          position: relative;
          background: #0E0E18;
          border: 1px solid rgba(91,184,230,0.22);
          border-radius: 20px;
          padding: 44px 36px 22px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.7);
          animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(91,184,230,0.4) 0%, transparent 40%, transparent 60%, rgba(91,184,230,0.2) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1px;
          pointer-events: none;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .avatar-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 52px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: formIn 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes formIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .input-row {
          display: flex;
          align-items: center;
          background: #13131F;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0 14px;
          height: 42px;
          gap: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-row:focus-within {
          border-color: rgba(91,184,230,0.5);
          box-shadow: 0 0 0 3px rgba(91,184,230,0.1);
        }
        .input-row svg {
          flex-shrink: 0;
          color: rgba(91,184,230,0.7);
          width: 16px;
          height: 16px;
        }
        .input-row input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-family: 'Inter', var(--font-sans), sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.01em;
        }
        .input-row input::placeholder {
          color: rgba(255,255,255,0.38);
        }
        .forgot {
          text-align: center;
          margin-top: -2px;
        }
        .forgot a {
          font-family: 'Inter', var(--font-sans), sans-serif;
          font-size: 12px;
          color: #5BB8E6;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s;
          letter-spacing: 0.01em;
        }
        .forgot a:hover { opacity: 1; }
        .btn-login {
          margin-top: 2px;
          width: 100%;
          height: 42px;
          background: #5BB8E6;
          border: none;
          border-radius: 10px;
          font-family: 'Sora', var(--font-display), sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #000;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(91,184,230,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-login:hover {
          background: #4DA8D6;
          box-shadow: 0 4px 28px rgba(91,184,230,0.45);
          transform: translateY(-1px);
        }
        .btn-login:active {
          transform: translateY(0);
          box-shadow: 0 2px 12px rgba(91,184,230,0.25);
        }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
