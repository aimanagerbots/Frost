'use client';

import { useState, useMemo } from 'react';
import { DrawerPanel } from '@/components';
import { useAccounts } from '../../hooks/useAccounts';
import type { Interaction } from '../../types';
import { X } from 'lucide-react';

const CRM_ACCENT = '#F59E0B';
const CHANNELS: Interaction['channel'][] = ['email', 'phone', 'sms', 'meeting', 'note'];

interface InteractionComposerProps {
  open: boolean;
  onClose: () => void;
  onSave: (interaction: Partial<Interaction>) => void;
}

export function InteractionComposer({ open, onClose, onSave }: InteractionComposerProps) {
  const { data: accounts } = useAccounts();
  const [channel, setChannel] = useState<Interaction['channel']>('email');
  const [accountId, setAccountId] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [contactName, setContactName] = useState('');
  const [subject, setSubject] = useState('');
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [showTooltip, setShowTooltip] = useState(false);

  const filteredAccounts = useMemo(() => {
    if (!accounts || !accountSearch) return [];
    const q = accountSearch.toLowerCase();
    return accounts.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 8);
  }, [accounts, accountSearch]);

  const selectedAccount = accounts?.find((a) => a.id === accountId);

  function handleSave() {
    onSave({
      channel,
      direction: 'outbound',
      subject,
      summary,
      sentiment,
      accountId,
      contactId: null,
      timestamp: new Date().toISOString(),
      userId: 'rep-jake',
      agentId: null,
      content: summary,
    });
    // Reset
    setChannel('email');
    setAccountId('');
    setAccountSearch('');
    setContactName('');
    setSubject('');
    setSummary('');
    setSentiment('neutral');
    onClose();
  }

  return (
    <DrawerPanel open={open} onClose={onClose} title="Log Interaction" width="md">
      <div className="space-y-5">
        {/* Channel */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Channel</label>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
                  channel === ch
                    ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
                    : 'bg-elevated text-muted hover:text-default'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Account search */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Account</label>
          {selectedAccount ? (
            <div className="flex items-center justify-between rounded-lg border border-default bg-elevated px-3 py-2">
              <span className="text-sm text-default">{selectedAccount.name}</span>
              <button onClick={() => { setAccountId(''); setAccountSearch(''); }} className="text-muted hover:text-default">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                placeholder="Search accounts..."
                className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-default placeholder:text-muted focus:border-hover focus:outline-none"
              />
              {filteredAccounts.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-lg border border-default bg-card shadow-lg">
                  {filteredAccounts.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { setAccountId(a.id); setAccountSearch(''); }}
                      className="w-full px-3 py-2 text-left text-sm text-default hover:bg-elevated"
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact */}
        {selectedAccount && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Contact</label>
            <select
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-default focus:border-hover focus:outline-none"
            >
              <option value="">Select contact...</option>
              {selectedAccount.contacts.map((c) => (
                <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>
        )}

        {/* Subject (email only) */}
        {channel === 'email' && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line..."
              className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-default placeholder:text-muted focus:border-hover focus:outline-none"
            />
          </div>
        )}

        {/* Summary */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Describe the interaction..."
            rows={4}
            className="w-full resize-none rounded-lg border border-default bg-base px-3 py-2 text-sm text-default placeholder:text-muted focus:border-hover focus:outline-none"
          />
        </div>

        {/* Sentiment */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Sentiment</label>
          <div className="flex gap-2">
            {(['positive', 'neutral', 'negative'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSentiment(s)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
                  sentiment === s
                    ? s === 'positive' ? 'bg-success/20 text-success ring-1 ring-success/40'
                    : s === 'negative' ? 'bg-danger/20 text-danger ring-1 ring-danger/40'
                    : 'bg-info/20 text-info ring-1 ring-info/40'
                    : 'bg-elevated text-muted hover:text-default'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!accountId || !summary}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-40"
            style={{ backgroundColor: CRM_ACCENT }}
          >
            Save Interaction
          </button>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="rounded-lg border border-default bg-elevated px-4 py-2 text-sm text-muted"
            >
              AI Draft
            </button>
            {showTooltip && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-base px-2 py-1 text-xs text-muted shadow-lg whitespace-nowrap">
                Coming soon
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-sm text-muted hover:text-default">Cancel</button>
        </div>
      </div>
    </DrawerPanel>
  );
}
