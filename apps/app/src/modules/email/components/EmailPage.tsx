'use client';

import { useState } from 'react';
import { Mail, Inbox, Star, Send, FileEdit, Archive, Pen } from 'lucide-react';
import { SectionHeader, MetricCard, LoadingSkeleton } from '@/components';
import { useEmails, useEmailMetrics } from '@/modules/email/hooks';
import { EmailList } from './EmailList';
import { EmailDetail } from './EmailDetail';
import type { Email, EmailFolder } from '@/modules/email/types';
import { ACCENT } from '@/design/colors';


const FOLDERS: { key: EmailFolder; label: string; icon: typeof Inbox }[] = [
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'starred', label: 'Starred', icon: Star },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'drafts', label: 'Drafts', icon: FileEdit },
  { key: 'archived', label: 'Archived', icon: Archive },
];

export function EmailPage() {
  const [activeFolder, setActiveFolder] = useState<EmailFolder>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allEmails, isLoading: emailsLoading } = useEmails();
  const { data: metrics, isLoading: metricsLoading } = useEmailMetrics();

  if (emailsLoading || metricsLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  const folderEmails =
    activeFolder === 'starred'
      ? (allEmails ?? []).filter((e) => e.starred)
      : (allEmails ?? []).filter((e) => e.folder === activeFolder);

  const folderCounts: Record<string, number> = {
    inbox: (allEmails ?? []).filter((e) => e.folder === 'inbox').length,
    starred: (allEmails ?? []).filter((e) => e.starred).length,
    sent: (allEmails ?? []).filter((e) => e.folder === 'sent').length,
    drafts: (allEmails ?? []).filter((e) => e.folder === 'drafts').length,
    archived: (allEmails ?? []).filter((e) => e.folder === 'archived').length,
  };

  const unreadCount = (allEmails ?? []).filter((e) => e.folder === 'inbox' && !e.read).length;

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Mail}
        title="Email"
        subtitle="AI-powered inbox with CRM integration"
        accentColor={ACCENT}
        stats={[
          { label: 'Unread', value: metrics?.unread ?? 0 },
          { label: 'Today', value: metrics?.todayReceived ?? 0 },
          { label: 'Needs Response', value: metrics?.needsResponse ?? 0 },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Unread" value={metrics?.unread ?? 0} accentColor="#FB7185" />
        <MetricCard label="Received Today" value={metrics?.todayReceived ?? 0} accentColor={ACCENT} />
        <MetricCard label="Needs Response" value={metrics?.needsResponse ?? 0} accentColor="#5BB8E6" />
        <MetricCard label="Avg Response Time" value={metrics?.avgResponseTime ?? '—'} accentColor="#5BB8E6" />
      </div>

      <div className="flex h-[calc(100vh-20rem)] min-h-[400px] rounded-xl bg-card overflow-hidden">
        {/* Folder sidebar */}
        <div className="flex w-[200px] flex-col border-r border-default bg-base p-2">
          <button
            className="mb-3 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-black transition-colors"
            style={{ backgroundColor: ACCENT }}
          >
            <Pen size={14} />
            Compose
          </button>

          {FOLDERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveFolder(key); setSelectedEmail(null); }}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                activeFolder === key
                  ? 'bg-elevated text-text-bright font-medium'
                  : 'text-text-muted hover:bg-accent-hover/50 hover:text-text-default'
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
              {key === 'inbox' && unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-[#FB7185]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#FB7185]">
                  {unreadCount}
                </span>
              )}
              {key !== 'inbox' && folderCounts[key] > 0 && (
                <span className="ml-auto text-[10px] text-text-muted/60">{folderCounts[key]}</span>
              )}
            </button>
          ))}

          <div className="mt-4 border-t border-default pt-3">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">Labels</p>
            {['Order Inquiries', 'Payments', 'Internal', 'Vendors', 'Marketing'].map((label) => (
              <button
                key={label}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-text-muted hover:bg-accent-hover/50 hover:text-text-default transition-colors"
              >
                <div className="h-2 w-2 rounded-full" style={{
                  backgroundColor:
                    label === 'Order Inquiries' ? '#5BB8E6'
                    : label === 'Payments' ? '#5BB8E6'
                    : label === 'Internal' ? '#5BB8E6'
                    : label === 'Vendors' ? '#5BB8E6'
                    : '#5BB8E6',
                }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Email list */}
        <EmailList
          emails={folderEmails}
          selectedId={selectedEmail?.id ?? null}
          searchQuery={searchQuery}
          onSelect={setSelectedEmail}
          onSearchChange={setSearchQuery}
        />

        {/* Email detail */}
        <EmailDetail email={selectedEmail} />
      </div>
    </div>
  );
}
