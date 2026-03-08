'use client';

import { ArrowLeft, MoreVertical, Link2, Users, Settings, X } from 'lucide-react';
import { PeopleList } from './PeopleList';
import { TrainingStats } from './TrainingStats';
import type { TeamPerson, MonthlyStat } from '../hooks/useTeamDashboard';

interface ComplianceCoursesProps {
  people: TeamPerson[];
  monthlyStats: MonthlyStat[];
  stats: {
    participation: number;
    avgTime: string;
    avgScore: string;
  };
}

export function ComplianceCourses({ people, monthlyStats, stats }: ComplianceCoursesProps) {
  return (
    <div className="flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1 mb-5">
        <button className="text-text-muted hover:text-text-bright transition-colors p-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-semibold text-text-bright">Compliance Courses</h2>
        <button className="text-text-muted hover:text-text-bright transition-colors p-1">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Assign participant */}
      <div className="rounded-2xl border border-default bg-card p-5 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-xs font-medium text-text-muted">Assign new participant</h4>
          <span className="h-4 w-4 rounded-full border border-border-hover flex items-center justify-center text-[8px] text-text-muted">?</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-elevated px-3 py-1.5 flex-1">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5BB8E6] text-[9px] font-bold text-white">
              AB
            </div>
            <span className="text-xs text-text-bright">Adam Brown</span>
            <button className="ml-auto text-text-muted hover:text-text-bright transition-colors">
              <X className="h-3 w-3" />
            </button>
          </div>
          <button className="shrink-0 rounded-full border border-text-bright px-4 py-1.5 text-xs font-semibold text-text-bright hover:bg-accent-hover transition-colors">
            Invite
          </button>
        </div>
      </div>

      {/* People list */}
      <div className="rounded-2xl border border-default bg-card p-5 mb-3">
        <PeopleList people={people} />

        {/* Action row */}
        <div className="mt-4 pt-3 border-t border-default flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-bright transition-colors">
            <Link2 className="h-3.5 w-3.5" />
            Copy link
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-bright transition-colors">
            <Users className="h-3.5 w-3.5" />
            All participants
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-bright transition-colors">
            <Settings className="h-3.5 w-3.5" />
            Settings
          </button>
        </div>
      </div>

      {/* Training Stats */}
      <TrainingStats monthlyStats={monthlyStats} stats={stats} />
    </div>
  );
}
