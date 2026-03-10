'use client';

import { User, TrendingUp, TrendingDown } from 'lucide-react';
import type { RepPipelineStats } from '../types';

interface RepPerformanceCardsProps {
  stats: RepPipelineStats[];
}

export function RepPerformanceCards({ stats }: RepPerformanceCardsProps) {
  return (
    <div className="rounded-xl bg-card p-4 md:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
        Rep Pipeline Performance
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((rep) => (
          <div
            key={rep.repId}
            className="rounded-lg border border-default bg-elevated/50 p-4"
          >
            {/* Rep header */}
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card">
                <User className="h-4 w-4 text-text-muted" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-bright">{rep.repName}</div>
                <div className="text-xs text-text-muted">{rep.totalAccounts} accounts</div>
              </div>
            </div>

            {/* Pipeline breakdown */}
            <div className="mb-3 flex gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-text-muted">Active</span>
                <span className="font-medium text-text-default">{rep.activeCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-text-muted">Inactive</span>
                <span className="font-medium text-text-default">{rep.inactiveCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-text-muted">Recovery</span>
                <span className="font-medium text-text-default">{rep.recoveryCount}</span>
              </div>
            </div>

            {/* Movement stats */}
            <div className="mb-3 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-medium text-emerald-400">{rep.advancesThisMonth}</span>
                <span className="text-text-muted">advances</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                <span className="font-medium text-red-400">{rep.declinesThisMonth}</span>
                <span className="text-text-muted">declines</span>
              </div>
            </div>

            {/* Top prospect & at-risk */}
            <div className="space-y-1.5 border-t border-default pt-3">
              {rep.topProspect && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Top prospect:</span>
                  <span className="font-medium text-blue-400">{rep.topProspect.name}</span>
                </div>
              )}
              {rep.topAtRisk && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">At risk:</span>
                  <span className="font-medium text-red-400">{rep.topAtRisk.name}</span>
                </div>
              )}
              {!rep.topProspect && !rep.topAtRisk && (
                <div className="text-xs text-text-muted">No prospects or at-risk accounts</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
