'use client';

import { useState } from 'react';
import { Sparkles, ListTodo, FileText, MessageSquare } from 'lucide-react';
import type { Email } from '@/modules/email/types';
import { CRMContextPanel } from './CRMContextPanel';

const ACCENT = '#3B82F6';

interface EmailDetailProps {
  email: Email | null;
}

export function EmailDetail({ email }: EmailDetailProps) {
  const [showDraft, setShowDraft] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  if (!email) {
    return (
      <div className="flex flex-1 items-center justify-center text-text-muted text-sm">
        Select an email to read
      </div>
    );
  }

  const fromInitials = email.from.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-default p-4">
        <h2 className="text-base font-semibold text-text-bright">{email.subject}</h2>
        <div className="mt-2 flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor: email.crmLinked ? '#F59E0B20' : `${ACCENT}20`,
              color: email.crmLinked ? '#F59E0B' : ACCENT,
            }}
          >
            {fromInitials}
          </div>
          <div>
            <p className="text-sm font-medium text-text-default">{email.from.name}</p>
            <p className="text-xs text-text-muted">{email.from.email}</p>
          </div>
          <span className="ml-auto text-xs text-text-muted">
            {new Date(email.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* CRM Context */}
      {email.crmLinked && (
        <div className="px-4 pt-3">
          <CRMContextPanel email={email} />
        </div>
      )}

      {/* Body */}
      <div className="flex-1 px-4 py-3">
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-default">
          {email.body}
        </div>
      </div>

      {/* AI Summary */}
      {showSummary && (
        <div className="mx-4 mb-3 rounded-lg border border-[#06B6D4]/20 bg-[#06B6D4]/5 p-3">
          <p className="text-xs font-medium text-[#06B6D4] mb-1">AI Summary</p>
          <p className="text-xs text-text-default">
            {email.crmLinked
              ? `${email.from.name} from ${email.crmAccountName} is reaching out about ${email.aiCategory === 'order-inquiry' ? 'an order modification' : email.aiCategory === 'payment' ? 'a payment update' : email.aiCategory === 'complaint' ? 're-engaging after a lapse' : 'general business'}. Account health is ${(email.crmHealthScore ?? 0) >= 80 ? 'strong' : (email.crmHealthScore ?? 0) >= 50 ? 'moderate' : 'at risk'}.`
              : `${email.from.name} sent a ${email.aiCategory} email. No CRM account linked.`}
          </p>
        </div>
      )}

      {/* AI Draft Reply */}
      {showDraft && email.aiDraftReply && (
        <div className="mx-4 mb-3 rounded-lg border border-[#06B6D4]/20 bg-[#06B6D4]/5 p-3">
          <p className="text-xs font-medium text-[#06B6D4] mb-2">AI Draft Reply</p>
          <div className="whitespace-pre-wrap text-sm text-text-default bg-base rounded-lg p-3 border border-default">
            {email.aiDraftReply}
          </div>
          <div className="mt-2 flex gap-2">
            <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-black" style={{ backgroundColor: ACCENT }}>
              Use This Draft
            </button>
            <button className="rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:bg-elevated transition-colors">
              Edit
            </button>
          </div>
        </div>
      )}

      {/* AI Actions Bar */}
      <div className="border-t border-default px-4 py-3 flex flex-wrap gap-2">
        {email.aiDraftReply && (
          <button
            onClick={() => { setShowDraft(!showDraft); setShowSummary(false); }}
            className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:bg-elevated transition-colors"
          >
            <Sparkles size={12} />
            AI Draft Reply
          </button>
        )}
        <button className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:bg-elevated transition-colors">
          <ListTodo size={12} />
          Create Task
        </button>
        {email.crmLinked && (
          <button className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:bg-elevated transition-colors">
            <FileText size={12} />
            Log as Interaction
          </button>
        )}
        <button
          onClick={() => { setShowSummary(!showSummary); setShowDraft(false); }}
          className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:bg-elevated transition-colors"
        >
          <MessageSquare size={12} />
          Summarize
        </button>
      </div>
    </div>
  );
}
