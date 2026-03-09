'use client';

import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalMessage } from '@/modules/portal/shared/types';

interface MessageBubbleProps {
  message: PortalMessage;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isDispensary = message.senderRole === 'dispensary';
  const isUnreadRep = !isDispensary && !message.read;

  return (
    <div
      className={cn(
        'flex w-full',
        isDispensary ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn('relative max-w-[75%]', isDispensary ? 'ml-12' : 'mr-12')}
      >
        {/* Sender name for rep messages */}
        {!isDispensary && (
          <p className="mb-1 text-xs font-medium text-text-muted">
            {message.senderName}
          </p>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isDispensary
              ? 'rounded-br-md bg-accent-primary/20 text-text-bright'
              : 'rounded-bl-md bg-elevated text-text-default'
          )}
        >
          {message.content}

          {/* Attachment chip */}
          {message.attachmentUrl && message.attachmentName && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-border-default bg-base/50 px-3 py-1.5 text-xs text-accent-primary">
              <Paperclip className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{message.attachmentName}</span>
            </div>
          )}
        </div>

        {/* Timestamp + unread dot */}
        <div
          className={cn(
            'mt-1 flex items-center gap-1.5 text-xs text-text-muted',
            isDispensary ? 'justify-end' : 'justify-start'
          )}
        >
          {isUnreadRep && (
            <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          )}
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}
