'use client';

import { useState } from 'react';
import { DrawerPanel, StatusBadge } from '@/components';
import type { WorkOrder } from '../types';

const ACCENT = '#10B981';

const STATUS_MAP: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  queued: 'default',
  'in-progress': 'info',
  completed: 'success',
  blocked: 'danger',
};

const PRIORITY_MAP: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

interface WorkOrderDrawerProps {
  workOrder: WorkOrder | null;
  open: boolean;
  onClose: () => void;
}

export function WorkOrderDrawer({ workOrder, open, onClose }: WorkOrderDrawerProps) {
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  if (!workOrder) return null;

  const status = localStatus ?? workOrder.status;

  const handleAction = (newStatus: string) => {
    setLocalStatus(newStatus);
  };

  return (
    <DrawerPanel open={open} onClose={() => { onClose(); setLocalStatus(null); }} title={workOrder.title} width="lg">
      <div className="space-y-6">
        {/* Header badges */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant={STATUS_MAP[status] ?? 'default'} label={status} size="sm" dot pulse={status === 'in-progress'} />
          <StatusBadge variant={PRIORITY_MAP[workOrder.priority] ?? 'muted'} label={workOrder.priority} size="sm" />
          <span className="inline-flex items-center rounded-full bg-elevated px-2.5 py-0.5 text-xs text-text-muted">
            {workOrder.type}
          </span>
          <span className="inline-flex items-center rounded-full bg-elevated px-2.5 py-0.5 text-xs text-text-muted">
            {workOrder.batchNumber}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-text-default">{workOrder.description}</p>

        {/* Readiness Progress */}
        <div className="rounded-lg border border-default bg-base p-3">
          <div className="text-xs text-text-muted mb-2">Readiness State Transition</div>
          <div className="flex items-center gap-3">
            <span className="rounded-md px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}>
              {workOrder.readinessStateFrom}
            </span>
            <svg width="24" height="12" viewBox="0 0 24 12" className="text-text-muted">
              <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <polyline points="15,2 21,6 15,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="rounded-md px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}>
              {workOrder.readinessStateTo}
            </span>
          </div>
        </div>

        {/* Materials Table */}
        <div>
          <h3 className="text-xs font-medium text-text-muted mb-2">Input Materials</h3>
          <div className="rounded-lg border border-default overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default bg-base">
                  <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Material</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Type</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">Qty</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-text-muted">Available</th>
                </tr>
              </thead>
              <tbody>
                {workOrder.inputMaterials.map((m, i) => (
                  <tr key={i} className="border-b border-default/50">
                    <td className="px-3 py-2 text-text-default">{m.name}</td>
                    <td className="px-3 py-2">
                      <StatusBadge
                        variant={m.type === 'cannabis' ? 'success' : m.type === 'labor' ? 'info' : 'default'}
                        label={m.type}
                        size="sm"
                      />
                    </td>
                    <td className="px-3 py-2 text-right text-text-default">{m.quantity} {m.unit}</td>
                    <td className="px-3 py-2 text-center">
                      {m.available ? (
                        <span className="text-success">&#10003;</span>
                      ) : (
                        <span className="text-danger">&#10007;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Output */}
        <div className="rounded-lg border border-default bg-base p-3">
          <div className="text-xs text-text-muted mb-1">Output</div>
          <div className="text-sm text-text-bright">{workOrder.outputProduct}</div>
          <div className="text-xs text-text-muted">{workOrder.outputQuantity} {workOrder.outputUnit}</div>
        </div>

        {/* Assignment */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-text-muted mb-1">Assigned To</div>
            <div className="text-sm text-text-bright">{workOrder.assignee}</div>
            <div className="text-xs text-text-muted">{workOrder.assigneeRole}</div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Time</div>
            <div className="text-sm text-text-bright">Est: {workOrder.estimatedMinutes} min</div>
            {workOrder.actualMinutes && (
              <div className="text-xs text-text-muted">Actual: {workOrder.actualMinutes} min</div>
            )}
          </div>
        </div>

        {/* Linked Orders */}
        {workOrder.linkedOrderIds.length > 0 && (
          <div>
            <div className="text-xs text-text-muted mb-1">Linked Orders</div>
            <div className="flex flex-wrap gap-1">
              {workOrder.linkedOrderIds.map((id) => (
                <span key={id} className="rounded-md bg-elevated px-2 py-0.5 text-xs text-text-default">{id}</span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {workOrder.notes && (
          <div className="rounded-lg border border-default bg-base p-3">
            <div className="text-xs text-text-muted mb-1">Notes</div>
            <div className="text-sm text-text-default">{workOrder.notes}</div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <div className="text-xs text-text-muted mb-2">Timeline</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted">Created</span>
              <span className="text-text-default">{new Date(workOrder.createdAt).toLocaleString()}</span>
            </div>
            {workOrder.startedAt && (
              <div className="flex justify-between">
                <span className="text-text-muted">Started</span>
                <span className="text-text-default">{new Date(workOrder.startedAt).toLocaleString()}</span>
              </div>
            )}
            {workOrder.completedAt && (
              <div className="flex justify-between">
                <span className="text-text-muted">Completed</span>
                <span className="text-text-default">{new Date(workOrder.completedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        {status === 'queued' && (
          <button
            onClick={() => handleAction('in-progress')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-bright transition-colors"
            style={{ backgroundColor: ACCENT }}
          >
            Start
          </button>
        )}
        {status === 'in-progress' && (
          <>
            <button
              onClick={() => handleAction('completed')}
              className="rounded-lg bg-success/20 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success/30"
            >
              Complete
            </button>
            <button
              onClick={() => handleAction('blocked')}
              className="rounded-lg bg-danger/20 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/30"
            >
              Block
            </button>
          </>
        )}
      </div>
    </DrawerPanel>
  );
}
