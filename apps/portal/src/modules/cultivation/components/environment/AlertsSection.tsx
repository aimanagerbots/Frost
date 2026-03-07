'use client';

import { useState } from 'react';
import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import { useRoomAlerts } from '../../hooks/useRoomAlerts';
import { LoadingSkeleton } from '@/components';
import type { AlertSeverity, AlertSource, RoomAlert } from '../../types';

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; bg: string; border: string; icon: typeof AlertTriangle }> = {
  critical: { color: '#EF4444', bg: 'bg-danger/10', border: 'border-danger/30', icon: AlertCircle },
  warning: { color: '#F59E0B', bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle },
  info: { color: '#3B82F6', bg: 'bg-info/10', border: 'border-info/30', icon: Info },
};

const SOURCE_LABELS: Record<AlertSource, string> = {
  trollmaster: 'Trollmaster',
  growlink: 'GrowLink',
  anderson: 'H.E. Anderson',
  system: 'System',
};

const SOURCE_COLORS: Record<AlertSource, string> = {
  trollmaster: '#22C55E',
  growlink: '#3B82F6',
  anderson: '#F97316',
  system: '#94A3B8',
};

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface AlertsSectionProps {
  roomId?: string;
}

export function AlertsSection({ roomId }: AlertsSectionProps) {
  const { data: alerts, isLoading } = useRoomAlerts(roomId);
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  if (isLoading) return <LoadingSkeleton variant="list" />;

  const activeAlerts = (alerts ?? []).filter(
    (a: RoomAlert) => !a.acknowledged && !acknowledged.has(a.id)
  );

  if (activeAlerts.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 rounded-full bg-[#94A3B8]" />
          <h3 className="text-sm font-semibold text-text-bright">Alerts</h3>
        </div>
        <div className="rounded-xl border border-default bg-card p-6 text-center">
          <Check className="mx-auto h-6 w-6 text-success mb-2" />
          <p className="text-sm text-text-muted">No active alerts</p>
        </div>
      </div>
    );
  }

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => new Set([...prev, id]));
  };

  // Sort: critical first, then warning, then info
  const severityOrder: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
  const sorted = [...activeAlerts].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-[#94A3B8]" />
        <h3 className="text-sm font-semibold text-text-bright">Alerts</h3>
        <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">
          {sorted.length}
        </span>
      </div>

      <div className="space-y-2">
        {sorted.map((alert) => {
          const cfg = SEVERITY_CONFIG[alert.severity];
          const SeverityIcon = cfg.icon;

          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-xl border p-3 ${cfg.bg} ${cfg.border}`}
            >
              <SeverityIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: cfg.color }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                    style={{
                      backgroundColor: `${SOURCE_COLORS[alert.source]}15`,
                      color: SOURCE_COLORS[alert.source],
                    }}
                  >
                    {SOURCE_LABELS[alert.source]}
                  </span>
                  <span className="text-[10px] text-text-muted">{formatTimeAgo(alert.timestamp)}</span>
                </div>
                <p className="text-sm text-text-default">{alert.message}</p>
                {alert.currentValue && (
                  <p className="mt-1 text-[11px] text-text-muted">
                    Current: {alert.currentValue} | Threshold: {alert.threshold}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleAcknowledge(alert.id)}
                className="shrink-0 rounded-lg border border-default bg-base px-2 py-1 text-[10px] font-medium text-text-muted hover:text-text-default hover:border-default/80 transition-colors"
              >
                Acknowledge
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
