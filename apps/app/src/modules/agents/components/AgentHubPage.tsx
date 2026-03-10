'use client';

import { useState } from 'react';
import {
  Bot,
  Mail,
  ShoppingCart,
  AlertTriangle,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Send,
  MessageSquare,
} from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  DrawerPanel,
  TimelineView,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { useAgents } from '../hooks/useAgents';
import { useAgentActions } from '../hooks/useAgentActions';
import { useAgentConversation } from '../hooks/useAgentConversation';
import type { AgentAction } from '../types';
import { ACCENT as AGENTS_ACCENT } from '@/design/colors';


const ACTION_TYPE_ICONS: Record<AgentAction['type'], typeof Mail> = {
  'email-draft': Mail,
  'reorder-proposal': ShoppingCart,
  alert: AlertTriangle,
  'task-creation': ClipboardList,
  'data-analysis': BarChart3,
  'compliance-check': ShieldCheck,
};

const ACTION_TYPE_COLORS: Record<AgentAction['type'], string> = {
  'email-draft': '#5BB8E6',
  'reorder-proposal': '#5BB8E6',
  alert: '#EF4444',
  'task-creation': '#5BB8E6',
  'data-analysis': '#5BB8E6',
  'compliance-check': '#5BB8E6',
};

const STATUS_VARIANT: Record<AgentAction['status'], 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  'pending-approval': 'warning',
  rejected: 'danger',
};

function formatActionType(type: AgentAction['type']): string {
  return type
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function AgentHubPage() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const { data: agents, isLoading: agentsLoading, error: agentsError, refetch: refetchAgents } = useAgents();
  const { data: allActions, isLoading: actionsLoading, error: actionsError, refetch: refetchActions } = useAgentActions();
  const { data: conversation } = useAgentConversation(selectedAgentId ?? undefined);

  const isLoading = agentsLoading || actionsLoading;

  const error = agentsError || actionsError;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load agent data"
        message={error.message}
        onRetry={() => { refetchAgents(); refetchActions(); }}
      />
    );
  }

  if (!agents?.length) {
    return (
      <div className="space-y-6 p-6">
        <SectionHeader
          icon={Bot}
          title="Agent Hub"
          subtitle="AI agents working across your operation"
          accentColor={AGENTS_ACCENT}
        />
        <EmptyState
          icon={Bot}
          title="No agents configured"
          description="No AI agents have been set up yet. Agents will appear here once configured."
          accentColor={AGENTS_ACCENT}
        />
      </div>
    );
  }

  const activeAgents = agents?.filter((a) => a.status === 'active').length ?? 0;
  const actionsToday = agents?.reduce((sum, a) => sum + a.actionsToday, 0) ?? 0;
  const pendingApprovals =
    allActions?.filter((a) => a.status === 'pending-approval').length ?? 0;
  const avgApprovalRate =
    agents && agents.length > 0
      ? Math.round(agents.reduce((sum, a) => sum + a.approvalRate, 0) / agents.length)
      : 0;

  const selectedAgent = agents?.find((a) => a.id === selectedAgentId) ?? null;

  const recentActions = (allActions ?? []).slice(0, 15);

  const timelineItems = recentActions.map((action) => ({
    id: action.id,
    timestamp: action.timestamp,
    icon: ACTION_TYPE_ICONS[action.type],
    iconColor: ACTION_TYPE_COLORS[action.type],
    title: action.description,
    description: action.result,
    user: action.agentName,
    channel: formatActionType(action.type),
  }));

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={Bot}
        title="Agent Hub"
        subtitle="AI agents working across your operation"
        accentColor={AGENTS_ACCENT}
        stats={[
          { label: 'Active', value: activeAgents },
          { label: 'Actions Today', value: actionsToday },
        ]}
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Active Agents"
          value={activeAgents}
          accentColor={AGENTS_ACCENT}
          trend={{ value: 0, direction: 'flat' }}
        />
        <MetricCard
          label="Actions Today"
          value={actionsToday}
          accentColor={AGENTS_ACCENT}
          trend={{ value: 12, direction: 'up' }}
        />
        <MetricCard
          label="Pending Approvals"
          value={pendingApprovals}
          accentColor="#5BB8E6"
          trend={{ value: pendingApprovals > 5 ? 8 : -3, direction: pendingApprovals > 5 ? 'up' : 'down' }}
        />
        <MetricCard
          label="Avg Approval Rate"
          value={`${avgApprovalRate}%`}
          accentColor="#5BB8E6"
          trend={{ value: 2, direction: 'up' }}
        />
      </div>

      {/* Agent Directory */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-bright">Agent Directory</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents?.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`group rounded-xl border bg-card p-4 text-left transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5 ${
                selectedAgentId === agent.id
                  ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                  : 'border-default'
              }`}
              style={{ '--accent': AGENTS_ACCENT } as React.CSSProperties}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-elevated text-xl">
                  {agent.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-text-bright">
                      {agent.name}
                    </h3>
                    {agent.status === 'active' && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                      </span>
                    )}
                  </div>
                  <StatusBadge
                    label={agent.specialty.charAt(0).toUpperCase() + agent.specialty.slice(1)}
                    size="sm"
                    variant="info"
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-text-muted line-clamp-2">
                {agent.description}
              </p>
              <div className="mt-3 flex items-center gap-4 border-t border-default pt-3">
                <div className="text-xs text-text-muted">
                  <span className="font-medium text-text-default">{agent.actionsToday}</span>{' '}
                  actions today
                </div>
                <div className="text-xs text-text-muted">
                  <span className="font-medium text-text-default">{agent.approvalRate}%</span>{' '}
                  approval
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Chat Drawer */}
      <DrawerPanel
        open={!!selectedAgent}
        onClose={() => setSelectedAgentId(null)}
        title={selectedAgent?.name ?? 'Agent Chat'}
        width="lg"
      >
        {selectedAgent && (
          <div className="flex h-full flex-col">
            {/* Agent Header */}
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-elevated p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-xl">
                {selectedAgent.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-bright">
                    {selectedAgent.name}
                  </span>
                  <StatusBadge
                    status={selectedAgent.status === 'active' ? 'active' : 'inactive'}
                    size="sm"
                    pulse={selectedAgent.status === 'active'}
                  />
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  {selectedAgent.capabilities.length} capabilities
                </p>
              </div>
            </div>

            {/* Capabilities */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                Capabilities
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-full bg-elevated px-2 py-1 text-xs text-text-default"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                Conversation
              </h4>
              {conversation?.messages && conversation.messages.length > 0 ? (
                conversation.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-[#5BB8E6]/20 text-text-bright'
                          : 'bg-elevated text-text-default'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      {msg.references && msg.references.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 border-t border-default pt-2">
                          {msg.references.map((ref) => (
                            <span
                              key={ref}
                              className="rounded bg-card px-1.5 py-0.5 text-[10px] text-text-muted"
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="mb-2 h-8 w-8 text-text-muted" />
                  <p className="text-sm text-text-muted">Start a conversation with this agent</p>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="mt-auto flex items-center gap-2 rounded-lg border border-default bg-elevated p-2">
              <input
                type="text"
                placeholder={`Ask ${selectedAgent.name.replace('Frost ', '')}...`}
                className="flex-1 bg-transparent px-2 text-sm text-text-default placeholder:text-text-muted focus:outline-none"
                disabled
              />
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-card hover:text-text-default"
                disabled
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </DrawerPanel>

      {/* Recent Actions Feed */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-bright">Recent Actions</h2>
        <div className="rounded-xl bg-card p-4">
          {recentActions.length > 0 ? (
            <div className="space-y-3">
              {recentActions.map((action) => {
                const Icon = ACTION_TYPE_ICONS[action.type];
                return (
                  <div
                    key={action.id}
                    className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent-hover"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card"
                      style={{ borderColor: `${ACTION_TYPE_COLORS[action.type]}40` }}
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: ACTION_TYPE_COLORS[action.type] }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-text-default">{action.description}</p>
                        <span className="shrink-0 text-xs text-text-muted">
                          {new Date(action.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusBadge
                          label={action.agentName.replace('Frost ', '')}
                          variant="info"
                          size="sm"
                        />
                        <StatusBadge
                          label={formatActionType(action.type)}
                          variant="default"
                          size="sm"
                        />
                        {action.status === 'rejected'
                          ? <StatusBadge status="rejected" size="sm" />
                          : <StatusBadge
                              label={action.status.replace('-', ' ')}
                              variant={STATUS_VARIANT[action.status]}
                              size="sm"
                            />
                        }
                      </div>
                      {action.result && (
                        <p className="mt-1 text-xs text-text-muted">{action.result}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <TimelineView items={timelineItems} />
          )}
        </div>
      </div>
    </div>
  );
}
