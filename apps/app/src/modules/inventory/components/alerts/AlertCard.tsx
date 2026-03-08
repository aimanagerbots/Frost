'use client';

import { AlertTriangle, Clock, FlaskConical, Package, XCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import type { InventoryAlert } from '@/modules/inventory/types';

interface AlertCardProps {
  alert: InventoryAlert;
}

const SEVERITY_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  critical: { bg: 'bg-[#FB7185]/5', border: 'border-[#FB7185]/20', color: '#FB7185' },
  warning: { bg: 'bg-[#FBBF24]/5', border: 'border-[#FBBF24]/20', color: '#FBBF24' },
  info: { bg: 'bg-[#38BDF8]/5', border: 'border-[#38BDF8]/20', color: '#38BDF8' },
};

const TYPE_ICONS: Record<string, typeof AlertTriangle> = {
  'low-stock': Package,
  'expiring-coa': FlaskConical,
  aging: Clock,
  reconciliation: AlertTriangle,
  'failed-coa': XCircle,
  'out-of-stock': ShoppingCart,
};

export function AlertCard({ alert }: AlertCardProps) {
  const style = SEVERITY_STYLES[alert.severity];
  const Icon = TYPE_ICONS[alert.type] ?? AlertTriangle;

  return (
    <div className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
      <div className="flex items-start gap-3">
        <Icon size={18} style={{ color: style.color }} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-text-bright">{alert.title}</p>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
              style={{ backgroundColor: `${style.color}15`, color: style.color }}
            >
              {alert.severity}
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">{alert.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[10px] text-text-muted italic">{alert.recommendedAction}</p>
            <button
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-colors hover:bg-accent-hover"
              style={{ color: style.color, borderWidth: 1, borderColor: `${style.color}30` }}
            >
              {alert.actionLabel}
              <ArrowRight className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
