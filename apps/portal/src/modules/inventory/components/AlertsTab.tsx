'use client';

import { AlertTriangle, Clock, FlaskConical, Package } from 'lucide-react';

interface Alert {
  id: string;
  type: 'low-stock' | 'expiring-coa' | 'aging' | 'reconciliation';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
}

const ALERTS: Alert[] = [
  { id: 'alert-1', type: 'low-stock', severity: 'critical', title: 'Vape Cartridge (0.5g) below reorder point', description: '800 units remaining, reorder point is 1,000. CCELL Direct lead time: 2 weeks.', timestamp: '2026-03-07T06:00:00Z' },
  { id: 'alert-2', type: 'low-stock', severity: 'warning', title: 'Child-Resistant Tubes approaching reorder point', description: '1,200 units remaining, reorder point is 1,000. Burn rate: ~200/day.', timestamp: '2026-03-07T06:00:00Z' },
  { id: 'alert-3', type: 'expiring-coa', severity: 'warning', title: 'Blue Dream batch FF-BD-0298 COA expires in 14 days', description: 'COA test date: Feb 21, 2026. Expiry: Mar 21, 2026. 24 units remaining.', timestamp: '2026-03-07T06:00:00Z' },
  { id: 'alert-4', type: 'expiring-coa', severity: 'info', title: 'Jack Herer batch FF-JH-0305 COA expires in 28 days', description: 'COA test date: Mar 5, 2026. Expiry: Apr 4, 2026. 48 units remaining.', timestamp: '2026-03-07T06:00:00Z' },
  { id: 'alert-5', type: 'aging', severity: 'warning', title: 'Wedding Cake prerolls batch FF-WC-0212 aging 23 days', description: 'Packaged Feb 12. Average shelf time is 14 days. 12 units unsold.', timestamp: '2026-03-07T06:00:00Z' },
  { id: 'alert-6', type: 'reconciliation', severity: 'info', title: 'METRC reconciliation due March 10', description: 'Monthly traceability report due in 3 days. 4 pending transfers need confirmation.', timestamp: '2026-03-07T06:00:00Z' },
];

const SEVERITY_STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  critical: { bg: 'bg-[#FB7185]/5', border: 'border-[#FB7185]/20', icon: '#FB7185' },
  warning: { bg: 'bg-[#FBBF24]/5', border: 'border-[#FBBF24]/20', icon: '#FBBF24' },
  info: { bg: 'bg-[#38BDF8]/5', border: 'border-[#38BDF8]/20', icon: '#38BDF8' },
};

const TYPE_ICONS: Record<string, typeof AlertTriangle> = {
  'low-stock': Package,
  'expiring-coa': FlaskConical,
  aging: Clock,
  reconciliation: AlertTriangle,
};

export function AlertsTab() {
  return (
    <div className="space-y-3">
      {ALERTS.map((alert) => {
        const style = SEVERITY_STYLES[alert.severity];
        const Icon = TYPE_ICONS[alert.type] ?? AlertTriangle;
        return (
          <div
            key={alert.id}
            className={`rounded-xl border p-4 ${style.bg} ${style.border}`}
          >
            <div className="flex items-start gap-3">
              <Icon size={18} style={{ color: style.icon }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-bright">{alert.title}</p>
                <p className="mt-1 text-xs text-text-muted">{alert.description}</p>
              </div>
              <span className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                style={{ backgroundColor: `${style.icon}15`, color: style.icon }}
              >
                {alert.severity}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
