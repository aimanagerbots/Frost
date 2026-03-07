'use client';

import { cn } from '@/lib/utils';
import {
  MetricCard,
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import {
  useCultivationMetrics,
  useGrowRooms,
  useRoomAlerts,
  useCultivationTasks,
  useHarvestRecords,
} from '../../hooks';
import { useCultivationStore } from '../../store';
import type { GrowStage, EnvironmentStatus, RoomAlert, GrowRoom, CultivationTask } from '../../types';
import {
  Sprout,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  CalendarDays,
  Scissors,
  ClipboardList,
} from 'lucide-react';

const ACCENT = '#22C55E';

const STAGE_COLORS: Record<GrowStage, string> = {
  clone: '#06B6D4',
  veg: '#22C55E',
  flower: '#8B5CF6',
  harvest: '#F59E0B',
  dry: '#94A3B8',
  cure: '#D97706',
};

const ENV_DOT_COLORS: Record<EnvironmentStatus, string> = {
  optimal: '#22C55E',
  warning: '#F59E0B',
  critical: '#EF4444',
};

const LABELS: Record<string, Record<string, string>> = {
  en: {
    alerts: 'Active Alerts',
    rooms: 'Room Overview',
    tasks: 'Upcoming Tasks',
    harvests: 'Recent Harvests',
    noAlerts: 'No active alerts',
    noAlertsDesc: 'All grow rooms are operating within normal parameters.',
    noTasks: 'No upcoming tasks',
    noTasksDesc: 'No tasks scheduled for the next 3 days.',
    noHarvests: 'No harvest records yet',
    noHarvestsDesc: 'Completed harvests will appear here.',
  },
  es: {
    alerts: 'Alertas Activas',
    rooms: 'Vista de Salas',
    tasks: 'Tareas Proximas',
    harvests: 'Cosechas Recientes',
    noAlerts: 'Sin alertas activas',
    noAlertsDesc: 'Todas las salas operan dentro de parametros normales.',
    noTasks: 'Sin tareas proximas',
    noTasksDesc: 'Sin tareas programadas para los proximos 3 dias.',
    noHarvests: 'Sin registros de cosecha',
    noHarvestsDesc: 'Las cosechas completadas apareceran aqui.',
  },
};

function getDayName(dayOfWeek: number, lang: string): string {
  const days: Record<string, string[]> = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    es: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
  };
  return (days[lang] ?? days.en)[dayOfWeek] ?? '';
}

function getUpcomingDays(): number[] {
  const today = new Date().getDay();
  return [today, (today + 1) % 7, (today + 2) % 7];
}

function severityVariant(severity: string) {
  return severity === 'critical' ? ('danger' as const) : ('warning' as const);
}

export function CultivationDashboard() {
  const language = useCultivationStore((s) => s.language);
  const navigateToRoom = useCultivationStore((s) => s.navigateToRoom);
  const t = LABELS[language] ?? LABELS.en;

  const metrics = useCultivationMetrics();
  const rooms = useGrowRooms();
  const alerts = useRoomAlerts();
  const tasks = useCultivationTasks();
  const harvests = useHarvestRecords();

  const isLoading = metrics.isLoading || rooms.isLoading;
  const hasError = metrics.isError || rooms.isError;

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;
  if (hasError) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="Could not fetch cultivation data. Please try again."
        onRetry={() => { metrics.refetch(); rooms.refetch(); }}
      />
    );
  }

  const m = metrics.data!;
  const roomList = rooms.data ?? [];
  const alertList = (alerts.data ?? []).filter(
    (a: RoomAlert) => !a.acknowledged && a.severity !== 'info'
  );
  const completedHarvests = (harvests.data ?? [])
    .filter((h) => h.status === 'complete')
    .slice(0, 3);
  const upcomingDays = getUpcomingDays();
  const upcomingTasks = (tasks.data ?? [])
    .filter((task: CultivationTask) => !task.completedAt && upcomingDays.includes(task.dayOfWeek))
    .slice(0, 12);

  // Build room name lookup for alerts
  const roomMap = new Map<string, GrowRoom>(roomList.map((r) => [r.id, r]));
  function roomNameForAlert(alert: RoomAlert): string {
    const roomId = alert.id.split('-').slice(0, 2).join('-');
    return roomMap.get(roomId)?.name ?? 'Unknown';
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="Active Rooms" value={m.activeRooms} accentColor={ACCENT} />
        <MetricCard label="Total Plants" value={m.totalPlants} accentColor={ACCENT} />
        <MetricCard label="Next Harvest" value={`${m.daysToNextHarvest}d`} accentColor="#F59E0B" />
        <MetricCard
          label="Environment Alerts"
          value={m.environmentAlerts}
          accentColor={m.environmentAlerts > 0 ? '#EF4444' : ACCENT}
        />
        <MetricCard label="Genetics in Library" value={m.geneticsCount} accentColor="#8B5CF6" />
        <MetricCard label="Tasks Today" value={m.tasksToday} accentColor="#3B82F6" />
      </div>

      {/* Alerts Section */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          {t.alerts}
        </h3>
        {alertList.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title={t.noAlerts}
            description={t.noAlertsDesc}
            accentColor={ACCENT}
          />
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {alertList.slice(0, 6).map((alert: RoomAlert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3',
                  alert.severity === 'critical'
                    ? 'border-danger/40 bg-danger/5'
                    : 'border-warning/40 bg-warning/5'
                )}
              >
                <AlertTriangle
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    alert.severity === 'critical' ? 'text-danger' : 'text-warning'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-bright">
                      {roomNameForAlert(alert)}
                    </span>
                    <StatusBadge
                      label={alert.severity}
                      variant={severityVariant(alert.severity)}
                      size="sm"
                      dot
                      pulse={alert.severity === 'critical'}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-text-muted">{alert.message}</p>
                  <span className="mt-1 block text-[10px] text-text-muted/60">
                    {new Date(alert.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Room Overview Grid */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          {t.rooms}
        </h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {roomList.map((room: GrowRoom) => {
            const pct = Math.round((room.dayInStage / room.totalDaysExpected) * 100);
            const env = room.environment;
            return (
              <button
                key={room.id}
                onClick={() => navigateToRoom(room.id)}
                className="group rounded-xl border border-default bg-card p-4 text-left transition-all hover:bg-card-hover hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-bright">{room.name}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{
                      backgroundColor: `${STAGE_COLORS[room.stage]}20`,
                      color: STAGE_COLORS[room.stage],
                    }}
                  >
                    {room.stage}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-muted">{room.strainName}</p>

                {/* Day progress */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted">
                  <span>Day {room.dayInStage}/{room.totalDaysExpected}</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: STAGE_COLORS[room.stage],
                    }}
                  />
                </div>

                {/* Mini environment row */}
                <div className="mt-3 flex items-center gap-3 text-[10px] text-text-muted">
                  {([
                    { icon: Thermometer, val: `${Math.round(env.temperature)}°F`, key: 'temp' },
                    { icon: Droplets, val: `${Math.round(env.humidity)}%`, key: 'rh' },
                    { icon: Wind, val: `${Math.round(env.co2)}`, key: 'co2' },
                    { icon: Gauge, val: `${env.vpd}`, key: 'vpd' },
                  ] as const).map(({ icon: Icon, val, key }) => (
                    <span key={key} className="flex items-center gap-1">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: ENV_DOT_COLORS[env.status] }}
                      />
                      <Icon className="h-3 w-3" />
                      {val}
                    </span>
                  ))}
                </div>

                {/* Plant count */}
                <div className="mt-2 flex items-center gap-1 text-[10px] text-text-muted">
                  <Sprout className="h-3 w-3" />
                  {room.plantCount} plants
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Upcoming Tasks */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          {t.tasks}
        </h3>
        {upcomingTasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={t.noTasks}
            description={t.noTasksDesc}
            accentColor={ACCENT}
          />
        ) : (
          <div className="space-y-4">
            {upcomingDays.map((dow) => {
              const dayTasks = upcomingTasks.filter(
                (task: CultivationTask) => task.dayOfWeek === dow
              );
              if (dayTasks.length === 0) return null;
              return (
                <div key={dow}>
                  <h4 className="mb-2 text-xs font-medium text-text-muted">
                    {getDayName(dow, language)}
                  </h4>
                  <div className="space-y-1.5">
                    {dayTasks.map((task: CultivationTask) => {
                      const room = roomMap.get(task.roomId);
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 rounded-lg border border-default bg-card px-3 py-2"
                        >
                          <CalendarDays className="h-4 w-4 shrink-0 text-text-muted" />
                          <span className="flex-1 text-sm text-text-bright">{task.title}</span>
                          {room && (
                            <span className="hidden text-xs text-text-muted sm:inline">
                              {room.name}
                            </span>
                          )}
                          <StatusBadge label={task.category} variant="info" size="sm" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Harvests */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          {t.harvests}
        </h3>
        {completedHarvests.length === 0 ? (
          <EmptyState
            icon={Scissors}
            title={t.noHarvests}
            description={t.noHarvestsDesc}
            accentColor={ACCENT}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {completedHarvests.map((h) => (
              <div key={h.id} className="rounded-xl border border-default bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-bright">{h.strainName}</span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(h.harvestDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-text-muted">Yield/plant</span>
                    <p className="font-semibold text-text-bright">{h.yieldPerPlant}g</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Dry weight</span>
                    <p className="font-semibold text-text-bright">{h.dryWeight}g</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
