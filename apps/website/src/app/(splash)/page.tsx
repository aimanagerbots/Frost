'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { verifyPassword } from './actions';

export default function SplashPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await verifyPassword(password);

    if (result.success) {
      router.push('/home');
      router.refresh();
    } else {
      setError('Incorrect password');
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <Image
        src="/frost-snowflake.png"
        alt="Frost"
        width={240}
        height={240}
        className="h-[120px] w-[120px] mb-10"
        priority
      />

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          placeholder="Password"
          required
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white text-center placeholder:text-white/30 outline-none transition-colors focus:border-[#5BB8E6]/50 focus:bg-white/[0.05]"
        />

        {error && (
          <p className="text-center text-xs text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5BB8E6] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Enter'
          )}
        </button>
      </form>
    </div>
  );
}
