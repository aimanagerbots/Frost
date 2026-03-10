'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { Event } from '../../types/seo-events';
import { MapPin, Calendar, Users, DollarSign, TrendingUp, CheckCircle2, Circle, Package, Store, Tag } from 'lucide-react';

interface EventDrawerProps {
  event: Event | null;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  'vendor-day': 'Vendor Day',
  'trade-show': 'Trade Show',
  'pop-up': 'Pop-Up',
  'webinar': 'Webinar',
  'industry-event': 'Industry Event',
  'internal': 'Internal',
};

const STATUS_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'muted'> = {
  planned: 'info',
  confirmed: 'success',
  'day-of': 'warning',
  completed: 'muted',
  'follow-up-done': 'success',
  cancelled: 'danger',
};

export function EventDrawer({ event, onClose }: EventDrawerProps) {
  if (!event) return null;

  return (
    <DrawerPanel open={!!event} onClose={onClose} title={event.name} width="lg">
      <div className="space-y-5">
        {/* Status & Type */}
        <div className="flex flex-wrap items-center gap-2">
          {(event.status === 'confirmed' || event.status === 'cancelled')
            ? <StatusBadge status={event.status as 'confirmed' | 'cancelled'} />
            : <StatusBadge variant={STATUS_VARIANTS[event.status] ?? 'muted'} label={event.status} dot />
          }
          <span className="rounded-full bg-elevated px-2.5 py-0.5 text-xs text-text-bright">{TYPE_LABELS[event.type] ?? event.type}</span>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 text-text-muted" />
            <span className="text-sm text-text-bright">
              {event.date}
              {event.endDate && ` — ${event.endDate}`}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-text-muted" />
            <span className="text-sm text-text-bright">{event.location}</span>
          </div>
          {event.attendees != null && (
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-bright">{event.attendees} attendees</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Description</h4>
          <p className="text-sm leading-relaxed text-default">{event.description}</p>
        </div>

        {/* Collateral Checklist */}
        {event.collateral && event.collateral.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Collateral Checklist</h4>
            <div className="space-y-1.5">
              {event.collateral.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.packed ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Circle className="h-4 w-4 text-text-muted" />
                  )}
                  <span className={`text-sm ${item.packed ? 'text-text-bright' : 'text-text-muted'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendor Day Details */}
        {event.type === 'vendor-day' && (
          <div className="rounded-lg border border-default bg-elevated p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Vendor Day Details</h4>
            {event.accountName && (
              <div className="flex items-center gap-2">
                <Store className="h-3.5 w-3.5 text-text-muted" />
                <div>
                  <p className="text-sm font-semibold text-text-bright">{event.accountName}</p>
                  <span className="text-[11px] text-text-muted">Account</span>
                </div>
              </div>
            )}
            {event.expectedAttendance != null && (
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-text-muted" />
                <div>
                  <p className="text-sm font-semibold text-text-bright">{event.expectedAttendance}</p>
                  <span className="text-[11px] text-text-muted">Expected Attendance</span>
                </div>
              </div>
            )}
            {event.productsToFeature && event.productsToFeature.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-text-muted" />
                  <span className="text-[11px] text-text-muted">Products to Feature</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {event.productsToFeature.map((product, idx) => (
                    <span key={idx} className="rounded-full bg-base px-2 py-0.5 text-xs text-text-bright">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Team Members */}
        {event.teamMembers && event.teamMembers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Team Members</h4>
            <div className="flex flex-wrap gap-1.5">
              {event.teamMembers.map((member, idx) => (
                <span key={idx} className="flex items-center gap-1 rounded-full bg-elevated px-2.5 py-1 text-xs text-text-bright">
                  <Tag className="h-3 w-3 text-text-muted" />
                  {member}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Budget */}
        <div className="rounded-lg border border-default bg-elevated p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Budget</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 text-text-muted" />
              <div>
                <p className="text-sm font-semibold text-text-bright">${event.budget.toLocaleString()}</p>
                <span className="text-[11px] text-text-muted">Budgeted</span>
              </div>
            </div>
            {event.actualSpend != null && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-text-muted" />
                <div>
                  <p className="text-sm font-semibold text-text-bright">${event.actualSpend.toLocaleString()}</p>
                  <span className="text-[11px] text-text-muted">Actual Spend</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ROI */}
        {event.roiMeasured && (
          <div className="rounded-lg border border-default bg-elevated p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">ROI Measurement</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-sm font-semibold text-text-bright">${event.roiMeasured.preEventRevenue.toLocaleString()}</p>
                <span className="text-[11px] text-text-muted">Pre-Event Revenue</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-bright">${event.roiMeasured.postEventRevenue.toLocaleString()}</p>
                <span className="text-[11px] text-text-muted">Post-Event Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-success" />
                <div>
                  <p className="text-sm font-semibold text-success">+{event.roiMeasured.lift}%</p>
                  <span className="text-[11px] text-text-muted">Revenue Lift</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
