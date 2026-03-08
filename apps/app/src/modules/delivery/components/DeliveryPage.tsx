'use client';

import { useState } from 'react';
import { Truck, LayoutDashboard, Route, Users } from 'lucide-react';
import { SectionHeader, ModuleTabs } from '@/components';
import { DeliveryDashboard } from './DeliveryDashboard';
import { DeliveryRoutes } from './DeliveryRoutes';
import { DriverBoard } from './DriverBoard';
import { ACCENT } from '@/design/colors';


type DeliveryTab = 'dashboard' | 'routes' | 'drivers';

const TABS: { id: DeliveryTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'routes', label: 'Routes', icon: Route },
  { id: 'drivers', label: 'Driver Board', icon: Users },
];

export function DeliveryPage() {
  const [activeTab, setActiveTab] = useState<DeliveryTab>('dashboard');

  return (
    <div className="space-y-6">
      <SectionHeader icon={Truck} title="Delivery" accentColor={ACCENT} />

      {/* Tab Bar */}
      <ModuleTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as DeliveryTab)}
        accentColor={ACCENT}
      />

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DeliveryDashboard />}
      {activeTab === 'routes' && <DeliveryRoutes />}
      {activeTab === 'drivers' && <DriverBoard />}
    </div>
  );
}
