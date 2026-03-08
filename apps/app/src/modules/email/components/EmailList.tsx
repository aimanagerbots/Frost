'use client';

import { Star, Paperclip, Users } from 'lucide-react';
import type { Email } from '@/modules/email/types';

const CATEGORY_COLORS: Record<string, string> = {
  'order-inquiry': '#5BB8E6',
  payment: '#5BB8E6',
  complaint: '#FB7185',
  general: '#5BB8E6',
  marketing: '#5BB8E6',
  internal: '#5BB8E6',
  vendor: '#5BB8E6',
};

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  searchQuery: string;
  onSelect: (email: Email) => void;
  onSearchChange: (query: string) => void;
}

export function EmailList({ emails, selectedId, searchQuery, onSelect, onSearchChange }: EmailListProps) {
  const filtered = searchQuery
    ? emails.filter(
        (e) =>
          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.preview.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : emails;

  return (
    <div className="flex w-[350px] flex-col border-r border-default bg-base">
      {/* Search */}
      <div className="border-b border-default p-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search emails..."
          className="w-full rounded-lg border border-default bg-elevated px-3 py-1.5 text-xs text-text-default placeholder:text-text-muted/50 outline-none focus:border-[#5BB8E6]/40"
        />
      </div>

      {/* Email rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((email) => {
          const initials = email.from.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
          const isSelected = email.id === selectedId;
          const catColor = CATEGORY_COLORS[email.aiCategory] ?? '#5BB8E6';

          return (
            <button
              key={email.id}
              onClick={() => onSelect(email)}
              className={`flex w-full gap-3 border-b border-default px-3 py-2.5 text-left transition-colors ${
                isSelected ? 'bg-elevated' : 'hover:bg-accent-hover/50'
              }`}
            >
              {/* Unread indicator */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <div
                  className={`h-2 w-2 rounded-full ${email.read ? 'bg-transparent' : 'bg-[#5BB8E6]'}`}
                />
              </div>

              {/* Avatar */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5"
                style={{
                  backgroundColor: email.crmLinked ? '#5BB8E620' : '#5BB8E620',
                  color: email.crmLinked ? '#5BB8E6' : '#5BB8E6',
                }}
              >
                {initials}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className={`text-xs truncate ${email.read ? 'text-text-muted' : 'font-semibold text-text-bright'}`}>
                    {email.from.name}
                  </span>
                  <span className="ml-auto shrink-0 text-[10px] text-text-muted/60">
                    {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className={`truncate text-xs ${email.read ? 'text-text-muted' : 'text-text-default font-medium'}`}>
                  {email.subject}
                </p>
                <p className="truncate text-[10px] text-text-muted/60 mt-0.5">{email.preview}</p>

                {/* Badges */}
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                    style={{ backgroundColor: `${catColor}15`, color: catColor }}
                  >
                    {email.aiCategory.replace('-', ' ')}
                  </span>
                  {email.crmLinked && (
                    <Users size={10} className="text-[#5BB8E6]" />
                  )}
                  {email.starred && (
                    <Star size={10} className="text-[#5BB8E6] fill-[#5BB8E6]" />
                  )}
                  {email.hasAttachment && (
                    <Paperclip size={10} className="text-text-muted" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-4 text-center text-xs text-text-muted">No emails found</div>
        )}
      </div>
    </div>
  );
}
