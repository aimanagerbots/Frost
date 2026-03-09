'use client';

import { useState, useMemo } from 'react';
import { Truck, List, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalAuth } from '@/modules/portal/shared/hooks/use-portal-auth';
import { usePortalDeliveries } from '@/modules/portal/shared/hooks/use-portal-deliveries';
import {
  DeliveriesStats,
  DeliveriesUpcoming,
  DeliveriesTracker,
  DeliveriesHistory,
  DeliveryDetail,
  DeliveriesCalendar,
  DeliveriesPreferences,
  DeliveriesReschedule,
} from '@/modules/portal/deliveries/components';

type ViewMode = 'list' | 'calendar';

export default function DeliveriesPage() {
  const { currentAccount } = usePortalAuth();
  const { data: deliveries = [], isLoading } = usePortalDeliveries(
    currentAccount?.id ?? ''
  );

  const [view, setView] = useState<ViewMode>('list');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedDelivery = useMemo(
    () => deliveries.find((d) => d.id === selectedDeliveryId) ?? null,
    [deliveries, selectedDeliveryId]
  );

  const firstInTransit = useMemo(
    () => deliveries.find((d) => d.status === 'in-transit') ?? null,
    [deliveries]
  );

  const filteredByDate = useMemo(() => {
    if (!selectedDate) return deliveries;
    return deliveries.filter(
      (d) => d.scheduledDate.slice(0, 10) === selectedDate
    );
  }, [deliveries, selectedDate]);

  const scheduledForReschedule = useMemo(
    () =>
      deliveries.filter(
        (d) => d.status === 'scheduled' || d.status === 'rescheduled'
      ),
    [deliveries]
  );

  function handleReschedule(
    _deliveryId: string,
    _newDate: string,
    _newWindow: string
  ) {
    // Mock handler — in production, this would call an API
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          icon={Truck}
          title="Deliveries"
          subtitle="Track scheduled and in-transit deliveries"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border-default bg-card"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Truck}
        title="Deliveries"
        subtitle="Track scheduled and in-transit deliveries"
        actions={
          <div className="flex items-center rounded-lg border border-border-default bg-card p-0.5">
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                view === 'list'
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-text-muted hover:text-text-default'
              )}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                view === 'calendar'
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-text-muted hover:text-text-default'
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Calendar
            </button>
          </div>
        }
      />

      {/* Stats */}
      <DeliveriesStats deliveries={deliveries} />

      {/* View content */}
      {view === 'list' ? (
        <div className="space-y-6">
          {/* Upcoming deliveries */}
          <DeliveriesUpcoming
            deliveries={deliveries}
            onViewDetail={setSelectedDeliveryId}
          />

          {/* Live tracker for first in-transit delivery */}
          {firstInTransit && <DeliveriesTracker delivery={firstInTransit} />}

          {/* Reschedule options for scheduled deliveries */}
          {scheduledForReschedule.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-text-bright">
                Reschedule
              </h2>
              {scheduledForReschedule.map((d) => (
                <DeliveriesReschedule
                  key={d.id}
                  delivery={d}
                  onReschedule={handleReschedule}
                />
              ))}
            </div>
          )}

          {/* Delivery history */}
          <DeliveriesHistory deliveries={deliveries} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          {/* Filtered deliveries list */}
          <div className="space-y-3">
            {selectedDate && (
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-bright">
                  Deliveries on{' '}
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString(
                    'en-US',
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-text-muted hover:text-text-default transition-colors"
                >
                  Clear filter
                </button>
              </div>
            )}

            {filteredByDate.length === 0 ? (
              <div className="rounded-xl border border-border-default bg-card p-8 text-center text-sm text-text-muted">
                {selectedDate
                  ? 'No deliveries on this date'
                  : 'No deliveries found'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredByDate.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDeliveryId(d.id)}
                    className={cn(
                      'w-full rounded-xl border border-border-default bg-card p-4',
                      'flex items-center justify-between text-left transition-colors',
                      'hover:border-accent-primary/30 hover:bg-elevated'
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-text-bright">
                        {d.orderNumber}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {d.scheduledWindow.start} &ndash;{' '}
                        {d.scheduledWindow.end} &middot; {d.driver.name}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        d.status === 'scheduled' && 'bg-blue-500',
                        d.status === 'in-transit' && 'bg-amber-500',
                        d.status === 'delivered' && 'bg-green-500',
                        d.status === 'rescheduled' && 'bg-purple-500'
                      )}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calendar sidebar */}
          <DeliveriesCalendar
            deliveries={deliveries}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>
      )}

      {/* Preferences */}
      <DeliveriesPreferences />

      {/* Detail drawer */}
      <DeliveryDetail
        delivery={selectedDelivery}
        isOpen={selectedDeliveryId !== null}
        onClose={() => setSelectedDeliveryId(null)}
      />
    </div>
  );
}
