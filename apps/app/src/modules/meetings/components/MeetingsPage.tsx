'use client';

import { useState } from 'react';
import { Video, Clock, Users, CheckSquare, Calendar, ExternalLink } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  DrawerPanel,
  LoadingSkeleton,
  AvatarGroup,
  ErrorState,
  EmptyState,
} from '@/components';
import { useMeetings, useMeetingMetrics } from '@/modules/meetings/hooks';
import type { Meeting, MeetingType } from '@/modules/meetings/types';
import { ACCENT } from '@/design/colors';


const TYPE_LABELS: Record<MeetingType, string> = {
  'sales-call': 'Sales Call',
  standup: 'Standup',
  'account-review': 'Account Review',
  planning: 'Planning',
  training: 'Training',
};

const TYPE_VARIANTS: Record<MeetingType, 'info' | 'default' | 'warning' | 'muted' | 'success'> = {
  'sales-call': 'info',
  standup: 'default',
  'account-review': 'warning',
  planning: 'muted',
  training: 'success',
};

const TYPE_FILTERS: { value: MeetingType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sales-call', label: 'Sales Call' },
  { value: 'standup', label: 'Standup' },
  { value: 'account-review', label: 'Account Review' },
  { value: 'planning', label: 'Planning' },
  { value: 'training', label: 'Training' },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function MeetingsPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [typeFilter, setTypeFilter] = useState<MeetingType | 'all'>('all');

  const filters = typeFilter === 'all' ? undefined : { type: typeFilter };
  const { data: meetings, isLoading, error: meetingsError, refetch: refetchMeetings } = useMeetings(filters);
  const { data: metrics, error: metricsError, refetch: refetchMetrics } = useMeetingMetrics();

  if (meetingsError || metricsError) {
    return (
      <ErrorState
        title="Failed to load meetings"
        message={(meetingsError || metricsError)?.message}
        onRetry={() => { refetchMeetings(); refetchMetrics(); }}
      />
    );
  }

  if (!isLoading && !meetings?.length) {
    return (
      <EmptyState
        icon={Video}
        title="No meetings"
        description="No meetings have been scheduled yet. Create a meeting to get started."
        accentColor={ACCENT}
      />
    );
  }

  const upcoming = meetings?.filter((m) => m.status === 'scheduled') ?? [];
  const recent = meetings?.filter((m) => m.status === 'completed') ?? [];

  const openActionCount = (m: Meeting) => m.actionItems.filter((a) => !a.completed).length;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Video} title="Meetings" accentColor={ACCENT} />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Meetings This Week" value={metrics?.thisWeek ?? '-'} accentColor={ACCENT} />
        <MetricCard label="Upcoming Today" value={metrics?.upcomingToday ?? '-'} accentColor={ACCENT} />
        <MetricCard label="Action Items Open" value={metrics?.actionItemsOpen ?? '-'} accentColor={ACCENT} />
        <MetricCard label="Completed This Month" value={metrics?.completedThisMonth ?? '-'} accentColor={ACCENT} />
      </div>

      {/* Type Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              typeFilter === f.value
                ? 'text-white'
                : 'bg-[var(--bg-elevated)] text-[var(--text-text-muted)] hover:text-[var(--text-text-default)]'
            }`}
            style={typeFilter === f.value ? { backgroundColor: ACCENT } : undefined}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : (
        <>
          {/* Upcoming Section */}
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-text-muted)]">
                Upcoming
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {upcoming.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => setSelectedMeeting(meeting)}
                    className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 text-left transition-colors hover:bg-[var(--bg-card-hover)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-[var(--text-text-bright)]">{meeting.title}</h3>
                      <StatusBadge label={TYPE_LABELS[meeting.type]} variant={TYPE_VARIANTS[meeting.type]} size="sm" />
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm text-[var(--text-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(meeting.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(meeting.startTime)} – {formatTime(meeting.endTime)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <AvatarGroup users={meeting.attendees.map((name) => ({ name }))} max={4} />
                      {meeting.accountId && (
                        <span className="text-xs font-medium" style={{ color: ACCENT }}>
                          Account linked
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Recent Section */}
          {recent.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-text-muted)]">
                Recent
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {recent.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => setSelectedMeeting(meeting)}
                    className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 text-left transition-colors hover:bg-[var(--bg-card-hover)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-[var(--text-text-bright)]">{meeting.title}</h3>
                      <StatusBadge label={TYPE_LABELS[meeting.type]} variant={TYPE_VARIANTS[meeting.type]} size="sm" />
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm text-[var(--text-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(meeting.date)}
                      </span>
                    </div>
                    {meeting.notes && (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--text-text-muted)]">{meeting.notes}</p>
                    )}
                    {meeting.actionItems.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <CheckSquare className="h-3.5 w-3.5 text-[var(--text-text-muted)]" />
                        <span className="text-xs text-[var(--text-text-muted)]">
                          {openActionCount(meeting)} open / {meeting.actionItems.length} total
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Detail Drawer */}
      <DrawerPanel
        open={!!selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        title={selectedMeeting?.title ?? ''}
        width="lg"
      >
        {selectedMeeting && (
          <div className="space-y-6">
            {/* Type & Status */}
            <div className="flex items-center gap-2">
              <StatusBadge label={TYPE_LABELS[selectedMeeting.type]} variant={TYPE_VARIANTS[selectedMeeting.type]} />
              <StatusBadge
                label={selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1)}
                variant={selectedMeeting.status === 'scheduled' ? 'info' : selectedMeeting.status === 'completed' ? 'success' : 'danger'}
                dot
              />
            </div>

            {/* Date & Time */}
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-text-muted)]">Date & Time</h4>
              <p className="text-sm text-[var(--text-text-default)]">
                {formatDate(selectedMeeting.date)} &middot; {formatTime(selectedMeeting.startTime)} – {formatTime(selectedMeeting.endTime)}
              </p>
            </div>

            {/* Attendees */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-text-muted)]">Attendees</h4>
              <div className="space-y-1.5">
                {selectedMeeting.attendees.map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-[var(--text-text-muted)]" />
                    <span className="text-sm text-[var(--text-text-default)]">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedMeeting.notes && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-text-muted)]">Notes</h4>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-text-default)]">
                  {selectedMeeting.notes}
                </p>
              </div>
            )}

            {/* Action Items */}
            {selectedMeeting.actionItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-text-muted)]">Action Items</h4>
                <div className="space-y-2">
                  {selectedMeeting.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        readOnly
                        className="mt-0.5 h-4 w-4 rounded border-[var(--border-default)] accent-[#5BB8E6]"
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${item.completed ? 'text-[var(--text-text-muted)] line-through' : 'text-[var(--text-text-default)]'}`}>
                          {item.text}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-[var(--text-text-muted)]">
                          <span>{item.assignee}</span>
                          <span>Due {formatDate(item.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recording Link Placeholder */}
            {selectedMeeting.recordingUrl ? (
              <a
                href={selectedMeeting.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium"
                style={{ color: ACCENT }}
              >
                <ExternalLink className="h-4 w-4" />
                View Recording
              </a>
            ) : selectedMeeting.status === 'completed' ? (
              <p className="text-xs italic text-[var(--text-text-muted)]">No recording available</p>
            ) : null}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
