'use client';

import { X } from 'lucide-react';
import { useTeamChatStore } from '@/modules/chat/store';
import { useTeamMembers, useTeamChannels } from '@/modules/chat/hooks/useTeamChat';
import { getChannelContext, getTeamMemberById } from '@/mocks/team-chat';
import { MemberAvatar } from './MemberAvatar';

const STATUS_DOT: Record<string, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-400',
  danger: 'bg-red-500',
};

export function TeamChatContextPanel() {
  const activeView = useTeamChatStore((s) => s.activeView);
  const toggleContextPanel = useTeamChatStore((s) => s.toggleContextPanel);
  const { data: channels } = useTeamChannels();
  const { data: members } = useTeamMembers();

  if (activeView.type === 'channel') {
    const channel = channels?.find((c) => c.id === activeView.id);
    const context = getChannelContext(activeView.id);
    const channelMembers = channel?.memberIds
      .map((id) => members?.find((m) => m.id === id))
      .filter(Boolean) ?? [];

    return (
      <div className="flex w-[280px] shrink-0 flex-col border-l border-default bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-default px-4 py-3">
          <h4 className="text-sm font-semibold text-text-default">
            {channel?.displayName ?? 'Channel'}
          </h4>
          <button
            onClick={toggleContextPanel}
            className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:text-text-default transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Description */}
          {channel?.description && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted/60">
                About
              </span>
              <p className="mt-1 text-xs text-text-muted leading-relaxed">
                {channel.description}
              </p>
            </div>
          )}

          {/* Module context widget */}
          {context && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted/60">
                {context.label}
              </span>
              <div className="mt-2 space-y-2">
                {context.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-2 rounded-lg bg-base p-2.5"
                  >
                    {item.status && (
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[item.status]}`}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-text-default truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-text-muted">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted/60">
              Members ({channelMembers.length})
            </span>
            <div className="mt-2 space-y-1">
              {channelMembers.map((m) =>
                m ? (
                  <div key={m.id} className="flex items-center gap-2 py-1">
                    <MemberAvatar name={m.name} status={m.status} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-text-default truncate">{m.name}</div>
                      <div className="text-[10px] text-text-muted">{m.role}</div>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DM view — show user profile
  const dmId = activeView.id;
  const memberId = dmId.replace('dm-', 'tm-');
  const member = getTeamMemberById(memberId);

  if (!member) return null;

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-l border-default bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-default px-4 py-3">
        <h4 className="text-sm font-semibold text-text-default">Profile</h4>
        <button
          onClick={toggleContextPanel}
          className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:text-text-default transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col items-center p-6 space-y-4">
        <MemberAvatar name={member.name} status={member.status} size="md" />
        <div className="text-center">
          <div className="text-sm font-semibold text-text-default">{member.name}</div>
          <div className="text-xs text-text-muted mt-0.5">{member.role}</div>
          <div className="text-xs text-text-muted/60 mt-0.5">{member.department}</div>
        </div>

        <div className="w-full space-y-3 pt-2">
          <div className="flex items-center justify-between rounded-lg bg-base p-3">
            <span className="text-xs text-text-muted">Status</span>
            <span className="text-xs font-medium text-text-default capitalize">
              {member.status}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-base p-3">
            <span className="text-xs text-text-muted">Language</span>
            <span className="text-xs font-medium text-text-default">
              {member.language === 'en' ? 'English' : 'Spanish'}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-base p-3">
            <span className="text-xs text-text-muted">Department</span>
            <span className="text-xs font-medium text-text-default">
              {member.department}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
