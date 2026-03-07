'use client';

import { useState } from 'react';
import { MapPin, Clock, DollarSign, CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import { DrawerPanel, StatusBadge } from '@/components';
import type { DeliveryRun, DeliveryStop, DeliveryStopStatus, DeliveryRunStatus } from '../types';

const ACCENT = '#0EA5E9';

const stopStatusVariant = (s: DeliveryStopStatus) => {
  const map: Record<DeliveryStopStatus, 'muted' | 'info' | 'success' | 'danger'> = {
    pending: 'muted',
    arrived: 'info',
    delivered: 'success',
    failed: 'danger',
  };
  return map[s];
};

const runStatusVariant = (s: DeliveryRunStatus) => {
  const map: Record<DeliveryRunStatus, 'default' | 'info' | 'success' | 'warning' | 'muted'> = {
    loading: 'warning',
    'in-transit': 'info',
    delivering: 'info',
    returning: 'muted',
    completed: 'success',
  };
  return map[s];
};

const stopIcon = (s: DeliveryStopStatus) => {
  switch (s) {
    case 'delivered':
      return <CheckCircle2 className="h-4 w-4 text-green-400" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-400" />;
    case 'arrived':
      return <MapPin className="h-4 w-4" style={{ color: ACCENT }} />;
    default:
      return <Circle className="h-4 w-4 text-text-muted" />;
  }
};

interface RouteDrawerProps {
  run: DeliveryRun | null;
  open: boolean;
  onClose: () => void;
}

export function RouteDrawer({ run, open, onClose }: RouteDrawerProps) {
  const [localStops, setLocalStops] = useState<Map<string, DeliveryStopStatus>>(new Map());

  // Reset local state when run changes
  const runId = run?.id;
  const [lastRunId, setLastRunId] = useState<string | null>(null);
  if (runId && runId !== lastRunId) {
    setLastRunId(runId);
    setLocalStops(new Map());
  }

  const getStopStatus = (stop: DeliveryStop): DeliveryStopStatus =>
    localStops.get(stop.id) ?? stop.status;

  const updateStopStatus = (stopId: string, status: DeliveryStopStatus) => {
    setLocalStops((prev) => new Map(prev).set(stopId, status));
  };

  if (!run) return null;

  return (
    <DrawerPanel open={open} onClose={onClose} title={run.routeName} width="lg">
      <div className="space-y-6">
        {/* Route header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Driver</p>
              <p className="text-text-default font-medium">{run.driverName}</p>
            </div>
            <StatusBadge label={run.status.replace(/-/g, ' ')} variant={runStatusVariant(run.status)} />
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {run.completedStops} / {run.totalStops} stops
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Est: {run.estimatedDuration}
              {run.actualDuration && ` (Actual: ${run.actualDuration})`}
            </span>
            <span>Vehicle: {run.vehicleId}</span>
          </div>
        </div>

        {/* Stops timeline */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-text-muted mb-3">Delivery Stops</h4>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-elevated" />

            <div className="space-y-4">
              {run.stops.map((stop, i) => {
                const status = getStopStatus(stop);
                return (
                  <div key={stop.id} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1">{stopIcon(status)}</div>

                    <div className="rounded-lg border border-default bg-card p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-muted">Stop {i + 1}</span>
                            <StatusBadge label={status} variant={stopStatusVariant(status)} size="sm" />
                          </div>
                          <h5 className="text-sm font-semibold text-text-default mt-1">{stop.accountName}</h5>
                          <p className="text-xs text-text-muted">{stop.address}, {stop.city}</p>
                        </div>
                        <div className="text-right text-xs text-text-muted">
                          <p>Est: {stop.estimatedArrival}</p>
                          {stop.actualArrival && <p>Actual: {stop.actualArrival}</p>}
                        </div>
                      </div>

                      {/* Payment info */}
                      {stop.paymentCollected && (
                        <div className="flex items-center gap-2 text-xs rounded-lg bg-elevated px-2.5 py-1.5">
                          <DollarSign className="h-3 w-3 text-green-400" />
                          <span className="text-text-default">
                            ${stop.paymentCollected.amount.toLocaleString()} via {stop.paymentCollected.method}
                          </span>
                          {stop.paymentCollected.checkNumber && (
                            <span className="text-text-muted">({stop.paymentCollected.checkNumber})</span>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {stop.notes && (
                        <p className="text-xs text-text-muted italic">{stop.notes}</p>
                      )}

                      {/* Actions */}
                      {status === 'pending' && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => updateStopStatus(stop.id, 'arrived')}
                            className="rounded-md px-3 py-1 text-xs font-medium border border-default hover:bg-elevated transition-colors text-text-default"
                          >
                            Mark Arrived
                          </button>
                        </div>
                      )}
                      {status === 'arrived' && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => updateStopStatus(stop.id, 'delivered')}
                            className="rounded-md px-3 py-1 text-xs font-medium text-white transition-colors"
                            style={{ backgroundColor: ACCENT }}
                          >
                            Mark Delivered
                          </button>
                          <button
                            onClick={() => updateStopStatus(stop.id, 'failed')}
                            className="rounded-md px-3 py-1 text-xs font-medium border border-default hover:bg-elevated transition-colors text-danger"
                          >
                            Failed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DrawerPanel>
  );
}
