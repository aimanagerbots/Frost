'use client';

interface ComplianceProgressProps {
  rate: number;
  certified: number;
  needsTraining: number;
}

export function ComplianceProgress({ rate, certified, needsTraining }: ComplianceProgressProps) {
  return (
    <div className="rounded-2xl border border-default bg-card p-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 rounded-full bg-elevated overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${rate}%`,
              backgroundColor: '#10B981',
            }}
          />
        </div>
        <span className="text-sm font-semibold text-text-bright tabular-nums">{rate}%</span>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#10B981]" />
          <span className="text-[11px] text-text-muted">Compliance Certified</span>
          <span className="text-[11px] font-medium text-text-bright ml-1">{certified}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-elevated" />
          <span className="text-[11px] text-text-muted">Needs Training</span>
          <span className="text-[11px] font-medium text-text-bright ml-1">{needsTraining}</span>
        </div>
      </div>
    </div>
  );
}
