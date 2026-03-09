'use client';

import { useState } from 'react';
import { Send, Paperclip, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportTicketFormProps {
  className?: string;
}

const CATEGORIES = [
  'General',
  'Order Issue',
  'Delivery Issue',
  'Payment Issue',
  'Product Question',
  'Account Help',
  'Technical Issue',
] as const;

const PRIORITIES = ['Low', 'Medium', 'High'] as const;

export function SupportTicketForm({ className }: SupportTicketFormProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [priority, setPriority] = useState<string>('Medium');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubject('');
      setCategory(CATEGORIES[0]);
      setPriority('Medium');
      setDescription('');
      setFileName(null);
    }, 1000);
  }

  function handleReset() {
    setIsSubmitted(false);
  }

  if (isSubmitted) {
    return (
      <div className={cn('space-y-4', className)}>
        <h2 className="font-display text-sm font-semibold text-text-bright">
          Submit a Ticket
        </h2>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border-default bg-card p-8">
          <CheckCircle className="h-10 w-10 text-green-500" />
          <p className="text-sm font-medium text-text-bright">
            Ticket submitted successfully!
          </p>
          <p className="text-xs text-text-muted">
            Your sales rep will respond within 1 business day.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 rounded-lg bg-accent-primary/15 px-4 py-2 text-xs font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="font-display text-sm font-semibold text-text-bright">
        Submit a Ticket
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-border-default bg-card p-5"
      >
        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            className={cn(
              'w-full rounded-lg border border-border-default bg-elevated px-3 py-2',
              'text-sm text-text-default placeholder:text-text-muted',
              'outline-none transition-colors focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30'
            )}
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-border-default bg-elevated px-3 py-2',
              'text-sm text-text-default',
              'outline-none transition-colors focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30'
            )}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">
            Priority
          </label>
          <div className="flex gap-3">
            {PRIORITIES.map((p) => (
              <label
                key={p}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                  className="accent-accent-primary"
                />
                <span
                  className={cn(
                    'text-sm',
                    priority === p ? 'text-text-default' : 'text-text-muted'
                  )}
                >
                  {p}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue in detail..."
            rows={4}
            className={cn(
              'w-full resize-none rounded-lg border border-border-default bg-elevated px-3 py-2',
              'text-sm text-text-default placeholder:text-text-muted',
              'outline-none transition-colors focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30'
            )}
          />
        </div>

        {/* Attachment */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">
            Attachment
          </label>
          <label
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border-default px-3 py-2',
              'text-sm text-text-muted transition-colors hover:border-accent-primary/50 hover:text-text-default'
            )}
          >
            <Paperclip className="h-4 w-4" />
            <span>{fileName ?? 'Choose a file...'}</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !subject.trim() || !description.trim()}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5',
            'text-sm font-medium transition-colors',
            isSubmitting || !subject.trim() || !description.trim()
              ? 'bg-elevated text-text-muted cursor-not-allowed'
              : 'bg-accent-primary text-white hover:bg-accent-primary/90'
          )}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Ticket
            </>
          )}
        </button>
      </form>
    </div>
  );
}
