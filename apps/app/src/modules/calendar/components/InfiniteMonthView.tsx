'use client';

import { useEffect, useRef, useCallback, useState, useImperativeHandle, forwardRef, useMemo, Fragment } from 'react';
import { cn } from '@/lib/utils';
import { EventCard } from './EventCard';
import type { CalendarEvent } from '../types';

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_EVENTS = 3;
const PREPEND_COUNT = 3;
const APPEND_COUNT = 3;

export interface InfiniteMonthViewHandle {
  scrollToMonth: (year: number, month: number) => void;
}

interface MonthKey {
  year: number;
  month: number; // 0-indexed
}

interface DayCell {
  date: Date;
  day: number;
  year: number;
  month: number;
  isToday: boolean;
  events: CalendarEvent[];
}

interface InfiniteMonthViewProps {
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onVisibleMonthChange?: (year: number, month: number) => void;
}

function monthId(year: number, month: number) {
  return `cal-month-${year}-${month}`;
}

function offsetMonth(year: number, month: number, delta: number): MonthKey {
  let m = month + delta;
  let y = year;
  while (m < 0) { m += 12; y--; }
  while (m > 11) { m -= 12; y++; }
  return { year: y, month: m };
}

// Alternating color based on absolute month — stable even when prepending
function isAltMonth(year: number, month: number) {
  return (year * 12 + month) % 2 === 1;
}

export const InfiniteMonthView = forwardRef<InfiniteMonthViewHandle, InfiniteMonthViewProps>(
  function InfiniteMonthView({ events, onSelectDate, onSelectEvent, onVisibleMonthChange }, ref) {
    const now = new Date();
    const [months, setMonths] = useState<MonthKey[]>(() => {
      const initial: MonthKey[] = [];
      for (let i = -2; i <= 4; i++) {
        initial.push(offsetMonth(now.getFullYear(), now.getMonth(), i));
      }
      return initial;
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const bottomSentinelRef = useRef<HTMLDivElement>(null);
    const isPrependingRef = useRef(false);
    const savedScrollHeightRef = useRef(0);
    const savedScrollTopRef = useRef(0);

    // Build a flat, unified grid of all days across all months — no gaps between months
    const { rows } = useMemo(() => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const eventsByDate = new Map<string, CalendarEvent[]>();
      for (const ev of events) {
        const existing = eventsByDate.get(ev.date) ?? [];
        existing.push(ev);
        eventsByDate.set(ev.date, existing);
      }

      // Leading null cells to align first month's day 1 under the correct weekday column
      const firstMonth = months[0];
      const firstDayOfWeek = new Date(firstMonth.year, firstMonth.month, 1).getDay();
      const flat: (DayCell | null)[] = Array.from({ length: firstDayOfWeek }, () => null);

      // All months flow continuously — no gap between end of one month and start of next
      for (const { year, month } of months) {
        const totalDays = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= totalDays; d++) {
          const date = new Date(year, month, d);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          flat.push({
            date,
            day: d,
            year,
            month,
            isToday: dateStr === todayStr,
            events: eventsByDate.get(dateStr) ?? [],
          });
        }
      }

      // Chunk into rows of 7
      const rows: (DayCell | null)[][] = [];
      for (let i = 0; i < flat.length; i += 7) {
        rows.push(flat.slice(i, i + 7));
      }
      return { rows };
    }, [months, events]);

    // Expose scrollToMonth
    useImperativeHandle(ref, () => ({
      scrollToMonth(year: number, month: number) {
        setMonths((prev) => {
          const exists = prev.some((m) => m.year === year && m.month === month);
          if (exists) return prev;
          const first = prev[0];
          const last = prev[prev.length - 1];
          const firstOffset = (year - first.year) * 12 + (month - first.month);
          if (firstOffset < 0) {
            const prepend: MonthKey[] = [];
            for (let i = Math.abs(firstOffset); i >= 1; i--) {
              prepend.push(offsetMonth(first.year, first.month, -i));
            }
            return [...prepend, ...prev];
          }
          const lastOffset = (year - last.year) * 12 + (month - last.month);
          if (lastOffset > 0) {
            const append: MonthKey[] = [];
            for (let i = 1; i <= lastOffset; i++) {
              append.push(offsetMonth(last.year, last.month, i));
            }
            return [...prev, ...append];
          }
          return prev;
        });

        requestAnimationFrame(() => {
          const el = document.getElementById(monthId(year, month));
          if (el && scrollContainerRef.current) {
            const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
            const elTop = el.getBoundingClientRect().top;
            scrollContainerRef.current.scrollTop += elTop - containerTop - 37;
          }
        });
      },
    }));

    // After prepend, restore scroll position so content doesn't jump
    useEffect(() => {
      if (isPrependingRef.current && scrollContainerRef.current) {
        const newScrollHeight = scrollContainerRef.current.scrollHeight;
        const diff = newScrollHeight - savedScrollHeightRef.current;
        scrollContainerRef.current.scrollTop = savedScrollTopRef.current + diff;
        isPrependingRef.current = false;
      }
    }, [months]);

    const prependMonths = useCallback(() => {
      if (!scrollContainerRef.current) return;
      savedScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
      savedScrollTopRef.current = scrollContainerRef.current.scrollTop;
      isPrependingRef.current = true;
      setMonths((prev) => {
        const first = prev[0];
        const newMonths: MonthKey[] = [];
        for (let i = PREPEND_COUNT; i >= 1; i--) {
          newMonths.push(offsetMonth(first.year, first.month, -i));
        }
        return [...newMonths, ...prev];
      });
    }, []);

    const appendMonths = useCallback(() => {
      setMonths((prev) => {
        const last = prev[prev.length - 1];
        const newMonths: MonthKey[] = [];
        for (let i = 1; i <= APPEND_COUNT; i++) {
          newMonths.push(offsetMonth(last.year, last.month, i));
        }
        return [...prev, ...newMonths];
      });
    }, []);

    // Infinite scroll sentinels
    useEffect(() => {
      const topSentinel = topSentinelRef.current;
      const bottomSentinel = bottomSentinelRef.current;
      const container = scrollContainerRef.current;
      if (!topSentinel || !bottomSentinel || !container) return;

      const topObserver = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) prependMonths(); },
        { root: container, threshold: 0.1 }
      );
      const bottomObserver = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) appendMonths(); },
        { root: container, threshold: 0.1 }
      );

      topObserver.observe(topSentinel);
      bottomObserver.observe(bottomSentinel);
      return () => { topObserver.disconnect(); bottomObserver.disconnect(); };
    }, [prependMonths, appendMonths]);

    // Scroll listener to track visible month
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container || !onVisibleMonthChange) return;

      const STICKY_HEADER_HEIGHT = 37;

      const handleScroll = () => {
        const containerRect = container.getBoundingClientRect();
        const sentinels = container.querySelectorAll<HTMLElement>('[data-year][data-month]');
        let bestYear = 0;
        let bestMonth = 0;
        for (const el of sentinels) {
          const top = el.getBoundingClientRect().top - containerRect.top;
          if (top <= STICKY_HEADER_HEIGHT + 2) {
            bestYear = parseInt(el.dataset.year ?? '0', 10);
            bestMonth = parseInt(el.dataset.month ?? '0', 10);
          }
        }
        if (bestYear) onVisibleMonthChange(bestYear, bestMonth);
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }, [months, onVisibleMonthChange]);

    // Scroll to today on mount
    useEffect(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(monthId(now.getFullYear(), now.getMonth()));
        if (el && scrollContainerRef.current) {
          const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
          const elTop = el.getBoundingClientRect().top;
          scrollContainerRef.current.scrollTop += elTop - containerTop - 37;
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={scrollContainerRef}
        className="rounded-xl bg-card overflow-y-auto border border-default [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb:hover]:bg-white/25"
        style={{ height: 'calc(100vh - 260px)', minHeight: '480px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
      >
        {/* Sticky day-of-week header */}
        <div className="sticky top-0 z-20 grid grid-cols-7 border-b border-default bg-card">
          {DAY_HEADERS.map((day) => (
            <div key={day} className="px-2 py-2 text-center text-xs font-medium text-text-muted uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        <div ref={topSentinelRef} className="h-1" aria-hidden />

        {/* Unified continuous grid — months flow into each other with no gaps */}
        {rows.map((row, ri) => {
          // Place a month sentinel before any row that contains a month's day 1
          const monthStart = row.find((c): c is DayCell => !!c && c.day === 1);
          return (
            <Fragment key={ri}>
              {monthStart && (
                <div
                  id={monthId(monthStart.year, monthStart.month)}
                  aria-hidden
                  data-year={String(monthStart.year)}
                  data-month={String(monthStart.month)}
                  className="h-0 w-full"
                />
              )}
              <div className="grid grid-cols-7 border-b border-default last:border-b-0">
                {row.map((cell, ci) => {
                  if (!cell) {
                    return <div key={ci} className="min-h-[100px] border-r border-default last:border-r-0" />;
                  }
                  const alt = isAltMonth(cell.year, cell.month);
                  const overflow = cell.events.length - MAX_VISIBLE_EVENTS;
                  return (
                    <button
                      key={ci}
                      onClick={() => onSelectDate(cell.date)}
                      className={cn(
                        'relative flex min-h-[100px] flex-col border-r border-default p-1.5 text-left transition-colors hover:bg-accent-hover last:border-r-0',
                        alt && 'bg-base/40'
                      )}
                    >
                      <span
                        className={cn(
                          'mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs',
                          cell.isToday ? 'bg-[#5BB8E6] font-bold text-white' : 'text-text-default'
                        )}
                      >
                        {cell.day}
                      </span>
                      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                        {cell.events.slice(0, MAX_VISIBLE_EVENTS).map((ev) => (
                          <EventCard key={ev.id} event={ev} compact onClick={(e) => onSelectEvent(e)} />
                        ))}
                        {overflow > 0 && (
                          <span className="mt-0.5 text-[10px] font-medium text-text-muted px-1">
                            +{overflow} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Fragment>
          );
        })}

        <div ref={bottomSentinelRef} className="h-1" aria-hidden />
      </div>
    );
  }
);
