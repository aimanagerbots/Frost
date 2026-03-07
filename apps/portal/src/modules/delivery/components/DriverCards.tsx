'use client';

import { User, Phone, Truck } from 'lucide-react';
import { StatusBadge, LoadingSkeleton } from '@/components';
import type { DeliveryDriver, DriverStatus } from '../types';

const statusVariant = (s: DriverStatus) => {
  const map: Record<DriverStatus, 'success' | 'info' | 'muted'> = {
    available: 'success',
    'on-route': 'info',
    'off-duty': 'muted',
  };
  return map[s];
};

interface DriverCardsProps {
  drivers: DeliveryDriver[];
  loading: boolean;
}

export function DriverCards({ drivers, loading }: DriverCardsProps) {
  if (loading) return <LoadingSkeleton variant="card" count={3} />;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-muted">Drivers</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {drivers.map((driver) => (
          <div key={driver.id} className="rounded-xl border border-default bg-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--bg-elevated)' }}
                >
                  <User className="h-5 w-5 text-text-muted" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-default">{driver.name}</h4>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {driver.phone}
                  </p>
                </div>
              </div>
              <StatusBadge
                label={driver.status.replace(/-/g, ' ')}
                variant={statusVariant(driver.status)}
                size="sm"
                pulse={driver.status === 'on-route'}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-text-muted text-xs">Today</span>
                <p className="text-text-default font-medium">{driver.deliveriesToday} deliveries</p>
              </div>
              <div>
                <span className="text-text-muted text-xs">On-Time</span>
                <p className="text-text-default font-medium">{driver.onTimeRate}%</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-default flex items-center gap-1.5 text-xs text-text-muted">
              <Truck className="h-3 w-3" />
              {driver.vehicleName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
