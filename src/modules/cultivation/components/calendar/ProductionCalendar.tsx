'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  LayoutGrid,
  Check,
  Sprout,
  Flower2,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSkeleton, ErrorState } from '@/components';
import { useCultivationTasks } from '../../hooks';
import { useGrowRooms } from '../../hooks';
import { useCultivationMetrics } from '../../hooks';
import { useCultivationStore } from '../../store';
import type { CultivationTask, TaskCategory } from '../../types';

// ─── Constants ──────────────────────────────────────────────────

const ACCENT = '#22C55E';

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  feeding: '#22C55E',
  ipm: '#3B82F6',
  defoliation: '#F59E0B',
  training: '#8B5CF6',
  transplant: '#06B6D4',
  flush: '#EF4444',
  'harvest-prep': '#EC4899',
  environmental: '#64748B',
  cleaning: '#94A3B8',
  inspection: '#475569',
};

const DAY_NAMES_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_NAMES_ES = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const DAY_SHORT_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_SHORT_ES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

type CalendarViewMode = 'week' | 'room';

// ─── Helpers ────────────────────────────────────────────────────

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} - ${fmt(end)}`;
}

function isToday(dayIndex: number, weekStart: Date): boolean {
  const now = new Date();
  const target = new Date(weekStart);
  target.setDate(target.getDate() + dayIndex);
  return (
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate()
  );
}

// ─── Component ──────────────────────────────────────────────────

export function ProductionCalendar() {
  const { language } = useCultivationStore();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useCultivationTasks();
  const { data: rooms, isLoading: roomsLoading } = useGrowRooms();
  const { data: metrics, isLoading: metricsLoading } = useCultivationMetrics();

  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{ roomId: string; day: number } | null>(null);

  const dayNames = language === 'es' ? DAY_NAMES_ES : DAY_NAMES_EN;
  const dayShort = language === 'es' ? DAY_SHORT_ES : DAY_SHORT_EN;

  const weekStart = useMemo(() => {
    const base = getWeekStart(new Date());
    base.setDate(base.getDate() + weekOffset * 7);
    return base;
  }, [weekOffset]);

  // Group tasks by day of week (1=Mon ... 7=Sun -> 0-indexed 0-6)
  const tasksByDay = useMemo(() => {
    if (!tasks) return Array.from({ length: 7 }, () => [] as CultivationTask[]);
    const grouped: CultivationTask[][] = Array.from({ length: 7 }, () => []);
    tasks.forEach((t) => {
      const idx = (t.dayOfWeek - 1 + 7) % 7; // dayOfWeek 1=Mon
      grouped[idx].push(t);
    });
    return grouped;
  }, [tasks]);

  // Room lookup
  const roomMap = useMemo(() => {
    if (!rooms) return new Map<string, { name: string; strain: string }>();
    return new Map(rooms.map((r) => [r.id, { name: r.name, strain: r.strainName }]));
  }, [rooms]);

  // Completion stats
  const completionStats = useMemo(() => {
    if (!tasks) return { completed: 0, total: 0, pct: 0 };
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completedAt).length;
    return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  // Pipeline calculations
  const pipeline = useMemo(() => {
    if (!metrics || !rooms) return null;
    const plantsInVeg = metrics.plantsInVeg;
    const plantsInFlower = metrics.plantsInFlower;
    const total = plantsInVeg + plantsInFlower;
    const estimatedYieldG = plantsInFlower * 82;
    const estimatedYieldLbs = (estimatedYieldG / 453.6).toFixed(1);
    const avgFlowerWeeks = 8;
    // Rough: find avg day in flower stage across rooms
    const flowerRooms = rooms.filter((r) => r.stage === 'flower');
    const avgDayInFlower = flowerRooms.length
      ? Math.round(flowerRooms.reduce((s, r) => s + r.dayInStage, 0) / flowerRooms.length)
      : 0;
    const weeksRemaining = Math.max(1, Math.round((avgFlowerWeeks * 7 - avgDayInFlower) / 7));
    const dryPlants = rooms.filter((r) => r.stage === 'dry').reduce((s, r) => s + r.plantCount, 0);
    return { plantsInVeg, plantsInFlower, dryPlants, total, estimatedYieldLbs, weeksRemaining };
  }, [metrics, rooms]);

  if (tasksLoading || roomsLoading || metricsLoading) {
    return <LoadingSkeleton variant="table" />;
  }
  if (tasksError) {
    return <ErrorState title="Failed to load tasks" message={String(tasksError)} />;
  }

  return (
    <div className="space-y-4">
      {/* ── Pipeline Impact Bar ─────────────────────────────── */}
      {pipeline && pipeline.total > 0 && (
        <div className="rounded-xl border border-default bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sprout className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-sm font-medium text-default">Pipeline Impact</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden mb-2">
            {pipeline.plantsInVeg > 0 && (
              <div
                className="transition-all"
                style={{
                  width: `${(pipeline.plantsInVeg / (pipeline.total + pipeline.dryPlants)) * 100}%`,
                  backgroundColor: '#22C55E',
                }}
              />
            )}
            {pipeline.plantsInFlower > 0 && (
              <div
                className="transition-all"
                style={{
                  width: `${(pipeline.plantsInFlower / (pipeline.total + pipeline.dryPlants)) * 100}%`,
                  backgroundColor: '#8B5CF6',
                }}
              />
            )}
            {pipeline.dryPlants > 0 && (
              <div
                className="transition-all"
                style={{
                  width: `${(pipeline.dryPlants / (pipeline.total + pipeline.dryPlants)) * 100}%`,
                  backgroundColor: '#94A3B8',
                }}
              />
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
              Veg: {pipeline.plantsInVeg}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
              Flower: {pipeline.plantsInFlower}
            </span>
            {pipeline.dryPlants > 0 && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#94A3B8' }} />
                Dry: {pipeline.dryPlants}
              </span>
            )}
            <span className="ml-auto text-muted-foreground">
              <Flower2 className="inline h-3 w-3 mr-1" />
              Plants in flower will yield ~{pipeline.estimatedYieldLbs} lbs in ~{pipeline.weeksRemaining} weeks.
              Pipeline: {pipeline.plantsInVeg} veg, {pipeline.plantsInFlower} flower.
            </span>
          </div>
        </div>
      )}

      {/* ── Controls Row ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="rounded-lg border border-default bg-card p-1.5 text-muted-foreground hover:text-default transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="rounded-lg border border-default bg-card px-3 py-1.5 text-sm font-medium text-default hover:bg-card/80 transition-colors"
          >
            {weekOffset === 0
              ? language === 'es' ? 'Esta Semana' : 'This Week'
              : formatDateRange(weekStart)}
          </button>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="rounded-lg border border-default bg-card p-1.5 text-muted-foreground hover:text-default transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {weekOffset === 0 && (
            <span className="text-xs text-muted-foreground ml-1">{formatDateRange(weekStart)}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Completion rate */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {language === 'es' ? 'Esta semana' : 'This week'}:{' '}
              <span className="text-default font-medium">
                {completionStats.completed}/{completionStats.total}
              </span>{' '}
              ({completionStats.pct}%)
            </span>
            <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${completionStats.pct}%`, backgroundColor: ACCENT }}
              />
            </div>
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg border border-default overflow-hidden">
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                viewMode === 'week'
                  ? 'bg-card text-default'
                  : 'text-muted-foreground hover:text-default'
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              {language === 'es' ? 'Semana' : 'Week'}
            </button>
            <button
              onClick={() => setViewMode('room')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                viewMode === 'room'
                  ? 'bg-card text-default'
                  : 'text-muted-foreground hover:text-default'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              {language === 'es' ? 'Sala' : 'Room'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Week View ───────────────────────────────────────── */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((name, i) => {
            const today = weekOffset === 0 && isToday(i, weekStart);
            const dayTasks = tasksByDay[i];
            return (
              <div key={i} className="flex flex-col">
                <div
                  className={cn(
                    'rounded-t-lg px-2 py-1.5 text-center text-xs font-semibold border border-b-0 border-default',
                    today ? 'text-white' : 'bg-card text-muted-foreground'
                  )}
                  style={today ? { backgroundColor: ACCENT } : undefined}
                >
                  {dayShort[i]}
                </div>
                <div className="flex-1 rounded-b-lg border border-default bg-card/50 p-1.5 space-y-1.5 min-h-[180px]">
                  {dayTasks.length === 0 && (
                    <p className="text-[10px] text-muted-foreground text-center mt-6">
                      {language === 'es' ? 'Sin tareas' : 'No tasks'}
                    </p>
                  )}
                  {dayTasks.map((task) => {
                    const room = roomMap.get(task.roomId);
                    const done = !!task.completedAt;
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          'rounded-lg border border-default p-2 text-[11px] space-y-1 transition-opacity',
                          done ? 'opacity-60' : 'opacity-100'
                        )}
                      >
                        {room && (
                          <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold bg-surface text-muted-foreground">
                            {room.name}
                          </span>
                        )}
                        <p className={cn('font-medium text-default leading-tight', done && 'line-through')}>
                          {task.title}
                        </p>
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white"
                            style={{ backgroundColor: CATEGORY_COLORS[task.category] }}
                          >
                            {task.category}
                          </span>
                          {done ? (
                            <Check className="h-3.5 w-3.5 text-green-400 shrink-0" />
                          ) : task.assignee ? (
                            <span className="text-[9px] text-muted-foreground truncate max-w-[60px]">
                              {task.assignee}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Room View ───────────────────────────────────────── */}
      {viewMode === 'room' && rooms && (
        <div className="rounded-xl border border-default bg-card overflow-hidden">
          <div className="grid grid-cols-[160px_repeat(7,1fr)]">
            {/* Header row */}
            <div className="px-3 py-2 border-b border-r border-default bg-surface text-xs font-semibold text-muted-foreground">
              {language === 'es' ? 'Sala' : 'Room'}
            </div>
            {dayShort.map((d, i) => {
              const today = weekOffset === 0 && isToday(i, weekStart);
              return (
                <div
                  key={i}
                  className={cn(
                    'px-2 py-2 text-center text-xs font-semibold border-b border-default',
                    today ? 'text-white' : 'bg-surface text-muted-foreground'
                  )}
                  style={today ? { backgroundColor: ACCENT } : undefined}
                >
                  {d}
                </div>
              );
            })}

            {/* Room rows */}
            {rooms
              .filter((r) => r.status === 'active')
              .map((room) => (
                <React.Fragment key={room.id}>
                  <div className="px-3 py-2 border-b border-r border-default flex flex-col justify-center">
                    <span className="text-xs font-medium text-default truncate">{room.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{room.strainName}</span>
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const cellTasks = tasksByDay[dayIdx].filter((t) => t.roomId === room.id);
                    const count = cellTasks.length;
                    const completedCount = cellTasks.filter((t) => t.completedAt).length;
                    // Dominant category color
                    const catCounts = new Map<TaskCategory, number>();
                    cellTasks.forEach((t) => catCounts.set(t.category, (catCounts.get(t.category) || 0) + 1));
                    let dominant: TaskCategory = 'feeding';
                    let maxC = 0;
                    catCounts.forEach((c, cat) => { if (c > maxC) { maxC = c; dominant = cat; } });
                    const isSelected = selectedCell?.roomId === room.id && selectedCell?.day === dayIdx;

                    return (
                      <button
                        key={dayIdx}
                        onClick={() => count > 0 && setSelectedCell(isSelected ? null : { roomId: room.id, day: dayIdx })}
                        className={cn(
                          'border-b border-default px-1 py-2 text-center transition-colors',
                          count > 0 ? 'hover:bg-surface cursor-pointer' : 'cursor-default',
                          isSelected && 'bg-surface',
                        )}
                        style={isSelected ? { outline: `1px solid ${ACCENT}`, outlineOffset: '-1px' } : undefined}
                      >
                        {count > 0 && (
                          <div className="flex flex-col items-center gap-0.5">
                            <span
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                              style={{ backgroundColor: CATEGORY_COLORS[dominant] }}
                            >
                              {count}
                            </span>
                            {completedCount > 0 && (
                              <span className="text-[9px] text-green-400">{completedCount}/{count}</span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
          </div>

          {/* Selected cell detail */}
          {selectedCell && (
            <div className="border-t border-default p-3 bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                <span className="text-xs font-semibold text-default">
                  {roomMap.get(selectedCell.roomId)?.name} &mdash; {dayNames[selectedCell.day]}
                </span>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {tasksByDay[selectedCell.day]
                  .filter((t) => t.roomId === selectedCell.roomId)
                  .map((task) => {
                    const done = !!task.completedAt;
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          'rounded-lg border border-default p-2 text-[11px] flex items-start gap-2',
                          done && 'opacity-60'
                        )}
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" />
                        ) : (
                          <span className="h-3.5 w-3.5 rounded border border-default mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className={cn('font-medium text-default', done && 'line-through')}>{task.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="rounded px-1 py-0.5 text-[9px] font-bold text-white"
                              style={{ backgroundColor: CATEGORY_COLORS[task.category] }}
                            >
                              {task.category}
                            </span>
                            {task.assignee && (
                              <span className="text-muted-foreground text-[9px]">{task.assignee}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
