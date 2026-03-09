'use client';

import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliveriesPreferencesProps {
  className?: string;
}

const DAYS = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
] as const;

const WINDOWS = [
  { value: 'morning', label: 'Morning (8 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM - 9 PM)' },
] as const;

export function DeliveriesPreferences({
  className,
}: DeliveriesPreferencesProps) {
  const [selectedDays, setSelectedDays] = useState<Set<string>>(
    new Set(['tue', 'thu'])
  );
  const [preferredWindow, setPreferredWindow] = useState('morning');
  const [instructions, setInstructions] = useState(
    'Ring doorbell, deliver to back entrance.'
  );
  const [saved, setSaved] = useState(false);

  function handleToggleDay(day: string) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-border-default bg-card p-5 space-y-5',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary/10">
          <Settings className="h-4 w-4 text-accent-primary" />
        </div>
        <h2 className="text-sm font-semibold text-text-bright">
          Delivery Preferences
        </h2>
      </div>

      {/* Preferred days */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-text-muted">
          Preferred Days
        </label>
        <div className="flex items-center gap-2">
          {DAYS.map(({ key, label }) => {
            const isSelected = selectedDays.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleToggleDay(key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  isSelected
                    ? 'bg-accent-primary/20 text-accent-primary ring-1 ring-accent-primary/30'
                    : 'bg-elevated text-text-muted hover:text-text-default'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred window */}
      <div className="space-y-2">
        <label
          htmlFor="delivery-window"
          className="text-xs font-medium text-text-muted"
        >
          Preferred Window
        </label>
        <select
          id="delivery-window"
          value={preferredWindow}
          onChange={(e) => {
            setPreferredWindow(e.target.value);
            setSaved(false);
          }}
          className={cn(
            'w-full rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default',
            'focus:outline-none focus:ring-1 focus:ring-accent-primary/50'
          )}
        >
          {WINDOWS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Special instructions */}
      <div className="space-y-2">
        <label
          htmlFor="delivery-instructions"
          className="text-xs font-medium text-text-muted"
        >
          Special Instructions
        </label>
        <textarea
          id="delivery-instructions"
          value={instructions}
          onChange={(e) => {
            setInstructions(e.target.value);
            setSaved(false);
          }}
          rows={3}
          className={cn(
            'w-full resize-none rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default',
            'placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-primary/50'
          )}
          placeholder="e.g. Ring bell, leave at back door..."
        />
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          saved
            ? 'bg-green-500/20 text-green-400'
            : 'bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25'
        )}
      >
        <Save className="h-4 w-4" />
        {saved ? 'Saved!' : 'Save Preferences'}
      </button>
    </div>
  );
}
