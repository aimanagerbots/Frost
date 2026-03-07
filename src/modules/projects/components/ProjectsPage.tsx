'use client';

import { useState, useMemo } from 'react';
import { FolderKanban, CheckCircle2, Circle, AlertCircle, Calendar, User } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  DrawerPanel,
  LoadingSkeleton,
  AvatarGroup,
} from '@/components';
import { useProjects, useProjectMetrics } from '@/modules/projects/hooks';
import type { Project, ProjectStatus } from '@/modules/projects/types';

const ACCENT = '#7C3AED';

const STATUS_VARIANT: Record<ProjectStatus, 'info' | 'success' | 'warning' | 'muted'> = {
  planning: 'info',
  active: 'success',
  'on-hold': 'warning',
  completed: 'muted',
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  'on-hold': 'On Hold',
  completed: 'Completed',
};

const FILTER_OPTIONS: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Planning', value: 'planning' },
  { label: 'Active', value: 'active' },
  { label: 'On Hold', value: 'on-hold' },
  { label: 'Completed', value: 'completed' },
];

function getProgressColor(project: Project): string {
  if (project.status === 'completed') return '#22C55E';
  const now = new Date();
  const start = new Date(project.startDate).getTime();
  const end = new Date(project.targetDate).getTime();
  const elapsed = (now.getTime() - start) / (end - start);
  const expectedProgress = Math.min(Math.max(elapsed * 100, 0), 100);

  if (project.progress >= expectedProgress - 10) return '#22C55E';
  if (project.progress >= expectedProgress - 25) return '#F59E0B';
  return '#EF4444';
}

function isMilestoneOverdue(dueDate: string, completed: boolean): boolean {
  if (completed) return false;
  return new Date(dueDate) < new Date();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filters = useMemo(
    () => (statusFilter === 'all' ? undefined : { status: statusFilter }),
    [statusFilter]
  );

  const { data: projects, isLoading: projectsLoading } = useProjects(filters);
  const { data: metrics, isLoading: metricsLoading } = useProjectMetrics();

  if (projectsLoading || metricsLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  const completedMilestones = (p: Project) => p.milestones.filter((m) => m.completed).length;

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={FolderKanban}
        title="Projects"
        subtitle="Track cross-functional initiatives and milestones"
        accentColor={ACCENT}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Active Projects"
          value={metrics?.active ?? 0}
          accentColor={ACCENT}
        />
        <MetricCard
          label="On Track"
          value={metrics?.onTrack ?? 0}
          accentColor="#22C55E"
        />
        <MetricCard
          label="Behind Schedule"
          value={metrics?.behind ?? 0}
          accentColor="#EF4444"
        />
        <MetricCard
          label="Completed This Quarter"
          value={metrics?.completedThisQuarter ?? 0}
          accentColor="#64748B"
        />
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === opt.value
                ? 'bg-[var(--bg-elevated)] text-[var(--text-bright)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-default)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects?.map((project) => {
          const progressColor = getProgressColor(project);
          const done = completedMilestones(project);
          const total = project.milestones.length;

          return (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 text-left transition-all duration-200 hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-[var(--text-bright)] leading-snug">
                  {project.name}
                </h3>
                <StatusBadge
                  variant={STATUS_VARIANT[project.status]}
                  label={STATUS_LABEL[project.status]}
                  size="sm"
                />
              </div>

              {/* Description */}
              <p className="mt-2 line-clamp-2 text-xs text-[var(--text-muted)] leading-relaxed">
                {project.description}
              </p>

              {/* Lead */}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <User className="h-3.5 w-3.5" />
                <span>{project.lead}</span>
              </div>

              {/* Team Avatars */}
              <div className="mt-3">
                <AvatarGroup
                  users={project.members.map((name) => ({ name }))}
                  max={4}
                />
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Progress</span>
                  <span className="font-medium text-[var(--text-default)]">
                    {project.progress}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progress}%`,
                      backgroundColor: progressColor,
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>
                  {done} of {total} milestones
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(project.targetDate)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {projects?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban className="h-12 w-12 text-[var(--text-muted)]" />
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            No projects match the current filter.
          </p>
        </div>
      )}

      {/* Drawer Panel */}
      <DrawerPanel
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name ?? 'Project Details'}
        width="lg"
      >
        {selectedProject && (
          <div className="space-y-6">
            {/* Status & Lead */}
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge
                variant={STATUS_VARIANT[selectedProject.status]}
                label={STATUS_LABEL[selectedProject.status]}
                dot
              />
              <span className="text-sm text-[var(--text-muted)]">
                Lead: <span className="text-[var(--text-default)]">{selectedProject.lead}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {selectedProject.description}
            </p>

            {/* Dates */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-[var(--text-muted)]">Start: </span>
                <span className="text-[var(--text-default)]">
                  {formatDate(selectedProject.startDate)}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Target: </span>
                <span className="text-[var(--text-default)]">
                  {formatDate(selectedProject.targetDate)}
                </span>
              </div>
            </div>

            {/* Progress Bar (larger) */}
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--text-default)]">Progress</span>
                <span className="font-semibold text-[var(--text-bright)]">
                  {selectedProject.progress}%
                </span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${selectedProject.progress}%`,
                    backgroundColor: getProgressColor(selectedProject),
                  }}
                />
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[var(--text-bright)]">
                Milestones ({completedMilestones(selectedProject)} / {selectedProject.milestones.length})
              </h3>
              <div className="space-y-3">
                {selectedProject.milestones.map((milestone) => {
                  const overdue = isMilestoneOverdue(milestone.dueDate, milestone.completed);

                  return (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3"
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#22C55E]" />
                      ) : overdue ? (
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#EF4444]" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-sm font-medium ${
                              milestone.completed
                                ? 'text-[var(--text-muted)] line-through'
                                : overdue
                                  ? 'text-[#EF4444]'
                                  : 'text-[var(--text-default)]'
                            }`}
                          >
                            {milestone.title}
                          </span>
                          <span
                            className={`shrink-0 text-xs ${
                              overdue
                                ? 'font-medium text-[#EF4444]'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {formatDate(milestone.dueDate)}
                          </span>
                        </div>
                        {milestone.description && (
                          <p className="mt-1 text-xs text-[var(--text-muted)]">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[var(--text-bright)]">
                Team ({selectedProject.members.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.members.map((member) => (
                  <span
                    key={member}
                    className="rounded-full bg-[var(--bg-elevated)] px-3 py-1 text-sm text-[var(--text-default)]"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
