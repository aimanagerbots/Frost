'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import { LoadingSkeleton } from '@/components';
import { useTeamDashboard } from '../hooks/useTeamDashboard';
import { TeamRingChart } from './TeamRingChart';
import { ComplianceProgress } from './ComplianceProgress';
import { ComplianceCourses } from './ComplianceCourses';

export function MobileDashboard() {
  const { data, isLoading } = useTeamDashboard();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base p-6">
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base p-4 lg:p-8">
      {/* Two-phone layout on desktop, stacked on mobile */}
      <div className="mx-auto max-w-[860px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* ─── LEFT SCREEN: Dashboard Home ─── */}
        <div className="rounded-[2rem] border border-default bg-[#0A0D14] p-5 shadow-2xl shadow-black/40 flex flex-col">
          {/* Status bar (decorative) */}
          <div className="flex items-center justify-between text-[10px] text-text-muted mb-4 px-1">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="3" width="2" height="7" rx="0.5" opacity="0.3"/><rect x="3" y="2" width="2" height="8" rx="0.5" opacity="0.5"/><rect x="6" y="1" width="2" height="9" rx="0.5" opacity="0.7"/><rect x="9" y="0" width="2" height="10" rx="0.5"/></svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 1.5C4.5 1.5 2.3 2.5 0.8 4.2L2.2 5.6C3.4 4.2 5.1 3.3 7 3.3S10.6 4.2 11.8 5.6L13.2 4.2C11.7 2.5 9.5 1.5 7 1.5ZM7 5.1C5.8 5.1 4.7 5.6 3.9 6.4L5.3 7.8C5.8 7.3 6.4 7 7 7S8.2 7.3 8.7 7.8L10.1 6.4C9.3 5.6 8.2 5.1 7 5.1ZM7 8.8A1.2 1.2 0 107 11.2 1.2 1.2 0 107 8.8Z"/></svg>
              <svg width="22" height="10" viewBox="0 0 22 10" fill="currentColor"><rect x="0" y="1" width="18" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1"/><rect x="1.5" y="2.5" width="13" height="5" rx="1"/><rect x="19" y="3" width="2" height="4" rx="0.5" opacity="0.4"/></svg>
            </div>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/FrostLogo_SnowflakeOnly.png"
                alt="Frost"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="text-sm font-bold text-text-bright tracking-wide">Frost</span>
            </div>
            <button className="text-text-muted hover:text-text-bright transition-colors p-1">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Greeting */}
          <div className="mb-6 px-1">
            <h1 className="text-xl font-bold text-text-bright mb-1">{data.greeting}</h1>
            <p className="text-xs text-text-muted">{data.subtitle}</p>
          </div>

          {/* Ring Chart Card */}
          <TeamRingChart roles={data.roles} total={data.teamTotal} />

          {/* Compliance Progress */}
          <div className="mt-3">
            <ComplianceProgress
              rate={data.complianceRate}
              certified={data.certified}
              needsTraining={data.needsTraining}
            />
          </div>
        </div>

        {/* ─── RIGHT SCREEN: Compliance Courses ─── */}
        <div className="rounded-[2rem] border border-default bg-[#0A0D14] p-5 shadow-2xl shadow-black/40 flex flex-col">
          {/* Status bar (decorative) */}
          <div className="flex items-center justify-between text-[10px] text-text-muted mb-4 px-1">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="3" width="2" height="7" rx="0.5" opacity="0.3"/><rect x="3" y="2" width="2" height="8" rx="0.5" opacity="0.5"/><rect x="6" y="1" width="2" height="9" rx="0.5" opacity="0.7"/><rect x="9" y="0" width="2" height="10" rx="0.5"/></svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 1.5C4.5 1.5 2.3 2.5 0.8 4.2L2.2 5.6C3.4 4.2 5.1 3.3 7 3.3S10.6 4.2 11.8 5.6L13.2 4.2C11.7 2.5 9.5 1.5 7 1.5ZM7 5.1C5.8 5.1 4.7 5.6 3.9 6.4L5.3 7.8C5.8 7.3 6.4 7 7 7S8.2 7.3 8.7 7.8L10.1 6.4C9.3 5.6 8.2 5.1 7 5.1ZM7 8.8A1.2 1.2 0 107 11.2 1.2 1.2 0 107 8.8Z"/></svg>
              <svg width="22" height="10" viewBox="0 0 22 10" fill="currentColor"><rect x="0" y="1" width="18" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1"/><rect x="1.5" y="2.5" width="13" height="5" rx="1"/><rect x="19" y="3" width="2" height="4" rx="0.5" opacity="0.4"/></svg>
            </div>
          </div>

          <ComplianceCourses
            people={data.people}
            monthlyStats={data.monthlyStats}
            stats={data.stats}
          />
        </div>
      </div>
    </div>
  );
}
