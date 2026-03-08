'use client';

import { useState } from 'react';
import { Truck, LayoutDashboard, Route, Users } from 'lucide-react';
import { SectionHeader } from '@/components';
import { DeliveryDashboard } from './DeliveryDashboard';
import { DeliveryRoutes } from './DeliveryRoutes';
import { DriverBoard } from './DriverBoard';

const ACCENT = '#0EA5E9';

type DeliveryTab = 'dashboard' | 'routes' | 'drivers';

const TABS: { key: DeliveryTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'routes', label: 'Routes', icon: Route },
  { key: 'drivers', label: 'Driver Board', icon: Users },
];

export function DeliveryPage() {
  const [activeTab, setActiveTab] = useState<DeliveryTab>('dashboard');

  return (
    <div className="space-y-6">
      <SectionHeader icon={Truck} title="Delivery" accentColor={ACCENT} />

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-xl border border-default bg-base p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === key
                ? 'bg-elevated text-text-bright'
                : 'text-text-muted hover:text-text-default'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DeliveryDashboard />}
      {activeTab === 'routes' && <DeliveryRoutes />}
      {activeTab === 'drivers' && <DriverBoard />}
    </div>
  );
}
