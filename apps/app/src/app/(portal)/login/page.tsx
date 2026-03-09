'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Shield, ArrowRight, Snowflake } from 'lucide-react';
import { usePortalAuth } from '@/modules/portal/shared/hooks';
import { PORTAL_ACCOUNTS } from '@/modules/portal/shared/mock-data';

const AMBER = '#F59E0B';

export default function PortalLoginPage() {
  const router = useRouter();
  const { login } = usePortalAuth();
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLogin = async (accountId: string) => {
    if (!ageConfirmed) return;
    setIsLoading(accountId);
    await new Promise((r) => setTimeout(r, 600));
    login(accountId);
    router.push('/portal/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
            >
              <Snowflake className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">FROST</h1>
              <p className="text-sm text-gray-500 -mt-0.5">B2B Dispensary Portal</p>
            </div>
          </div>
          <p className="text-gray-600 mt-4">
            Sign in to manage your wholesale orders, track deliveries, and more.
          </p>
        </div>

        {/* Age confirmation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-500" />
                Age Verification
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                I confirm I am 21 years of age or older and am a licensed cannabis retailer.
              </p>
            </div>
          </label>
        </div>

        {/* Demo accounts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Demo Accounts</h2>
          <p className="text-xs text-gray-500 mb-4">Select a dispensary account to explore the portal.</p>

          <div className="space-y-3">
            {PORTAL_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                onClick={() => handleLogin(account.id)}
                disabled={!ageConfirmed || isLoading !== null}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${AMBER}15` }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: AMBER }} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{account.businessName}</p>
                      <p className="text-xs text-gray-500">
                        {account.primaryContact.name} · {account.pipelineLabel} · Tier {account.pricingTier}
                      </p>
                    </div>
                  </div>
                  {isLoading === account.id ? (
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by Frost Cannabis · portal.frost.com
        </p>
      </div>
    </div>
  );
}
