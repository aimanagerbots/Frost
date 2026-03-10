'use client';

import type { PaymentComplianceCounts } from '@/mocks/crm-kpi-charts';

interface PaymentComplianceTrafficLightProps {
  data: PaymentComplianceCounts;
}

const LIGHTS = [
  { key: 'green' as const, label: 'Good / Excellent', color: '#22C55E', bgRing: 'rgba(34, 197, 94, 0.15)' },
  { key: 'amber' as const, label: 'Fair', color: '#FBBF24', bgRing: 'rgba(251, 191, 36, 0.15)' },
  { key: 'red' as const, label: 'Poor', color: '#EF4444', bgRing: 'rgba(239, 68, 68, 0.15)' },
];

export function PaymentComplianceTrafficLight({ data }: PaymentComplianceTrafficLightProps) {
  const total = data.green + data.amber + data.red;

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-bright">Payment Compliance</h3>
        <p className="mt-0.5 text-xs text-text-muted">{total} accounts by reliability</p>
      </div>

      <div className="flex items-center justify-center gap-8 py-4">
        {LIGHTS.map(({ key, label, color, bgRing }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: bgRing, boxShadow: `0 0 20px ${color}30` }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
              >
                <span className="text-xl font-bold text-white">{data[key]}</span>
              </div>
            </div>
            <span className="text-[10px] text-text-muted text-center">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
