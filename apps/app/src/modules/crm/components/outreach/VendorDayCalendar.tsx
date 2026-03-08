'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { VendorDay } from '../../types';

const STATUS_COLORS: Record<VendorDay['status'], string> = {
  completed: '#5BB8E6',
  scheduled: '#5BB8E6',
  cancelled: '#EF4444',
};

interface VendorDayCalendarProps {
  vendorDays: VendorDay[];
  onSelect: (vendorDay: VendorDay) => void;
}

export function VendorDayCalendar({ vendorDays, onSelect }: VendorDayCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = Array(firstDay).fill(null);

    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  }, [year, month]);

  const vendorDaysByDate = useMemo(() => {
    const map: Record<string, VendorDay[]> = {};
    vendorDays.forEach((vd) => {
      const vdDate = new Date(vd.date);
      if (vdDate.getFullYear() === year && vdDate.getMonth() === month) {
        const day = vdDate.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(vd);
      }
    });
    return map;
  }, [vendorDays, year, month]);

  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="rounded-xl border border-default bg-card p-4">
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-accent-hover hover:text-text-default"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-sm font-semibold text-text-bright">{monthName}</h3>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-accent-hover hover:text-text-default"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-1 text-center text-xs font-medium text-text-muted">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.flat().map((day, i) => {
          const dayVDs = day ? vendorDaysByDate[day] || [] : [];
          const hasVD = dayVDs.length > 0;

          return (
            <div
              key={i}
              className={`relative flex min-h-[48px] flex-col items-center rounded-lg p-1 text-xs transition-colors ${
                day ? 'text-text-default' : 'text-transparent'
              } ${hasVD ? 'cursor-pointer hover:bg-accent-hover' : ''}`}
              onClick={() => {
                if (dayVDs.length > 0) onSelect(dayVDs[0]);
              }}
            >
              <span className={`${hasVD ? 'font-bold text-text-bright' : ''}`}>{day || ''}</span>
              {dayVDs.length > 0 && (
                <div className="mt-1 flex gap-0.5">
                  {dayVDs.map((vd) => (
                    <div
                      key={vd.id}
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[vd.status] }}
                      title={`${vd.accountName} — ${vd.status}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 border-t border-default pt-3">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs capitalize text-text-muted">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
