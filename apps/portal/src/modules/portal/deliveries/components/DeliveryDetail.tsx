'use client';

import { useEffect, useCallback } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Package,
  FileCheck,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalDelivery } from '@/modules/portal/shared/types';
import { PortalStatusBadge } from '@/modules/portal/shared/components/PortalStatusBadge';

interface DeliveryDetailProps {
  delivery: PortalDelivery | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function DeliveryDetail({
  delivery,
  isOpen,
  onClose,
}: DeliveryDetailProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !delivery) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Delivery detail for ${delivery.orderNumber}`}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col',
          'border-l border-border-default bg-base shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-bright">
              {delivery.orderNumber}
            </h2>
            <div className="mt-0.5">
              <PortalStatusBadge status={delivery.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Schedule info */}
          <div className="rounded-xl border border-border-default bg-card p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Schedule
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-default">
                <Calendar className="h-4 w-4 text-text-muted" />
                {formatDate(delivery.scheduledDate)}
              </div>
              <div className="flex items-center gap-2 text-text-default">
                <Clock className="h-4 w-4 text-text-muted" />
                {delivery.scheduledWindow.start} &ndash;{' '}
                {delivery.scheduledWindow.end}
              </div>
              {delivery.eta && (
                <div className="flex items-center gap-2 text-accent-primary">
                  <Clock className="h-4 w-4" />
                  ETA: {delivery.eta}
                </div>
              )}
            </div>
          </div>

          {/* Driver info */}
          <div className="rounded-xl border border-border-default bg-card p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Driver
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-default">
                <User className="h-4 w-4 text-text-muted" />
                {delivery.driver.name}
              </div>
              <div className="flex items-center gap-2 text-text-default">
                <Phone className="h-4 w-4 text-text-muted" />
                {delivery.driver.phone}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-xl border border-border-default bg-card p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Items ({delivery.items.length})
            </h3>
            <div className="space-y-2">
              {delivery.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 text-text-muted" />
                    <span className="text-text-default">
                      {item.productName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-text-muted">
                    <span>&times;{item.quantity}</span>
                    <span className="text-text-default">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature */}
          {delivery.status === 'delivered' && (
            <div className="rounded-xl border border-border-default bg-card p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Delivery Confirmation
              </h3>
              <div className="space-y-2 text-sm">
                {delivery.deliveredAt && (
                  <div className="flex items-center gap-2 text-text-default">
                    <Clock className="h-4 w-4 text-text-muted" />
                    Delivered {formatDateTime(delivery.deliveredAt)}
                  </div>
                )}
                {delivery.signature ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <FileCheck className="h-4 w-4" />
                    Signed by: {delivery.signature}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-text-muted">
                    <FileCheck className="h-4 w-4" />
                    No signature on file
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tracking location */}
          {delivery.trackingLocation && (
            <div className="rounded-xl border border-border-default bg-card p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Tracking
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-default">
                  <MapPin className="h-4 w-4 text-text-muted" />
                  {delivery.trackingLocation.lat.toFixed(4)},{' '}
                  {delivery.trackingLocation.lng.toFixed(4)}
                </div>
                <p className="text-xs text-text-muted">
                  Last updated:{' '}
                  {formatDateTime(delivery.trackingLocation.lastUpdated)}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {delivery.notes && (
            <div className="rounded-xl border border-border-default bg-card p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Notes
              </h3>
              <div className="flex items-start gap-2 text-sm text-text-default">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                {delivery.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
