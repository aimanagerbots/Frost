'use client';

import { useEffect, useState, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalMessages } from '@/modules/portal/shared/hooks';
import { usePortalAuth } from '@/modules/portal/shared/hooks';
import { getRepById } from '@/modules/portal/shared/mock-data';
import {
  MessageRepHeader,
  MessageThread,
  MessageInput,
} from '@/modules/portal/messages/components';

export default function MessagesPage() {
  const { currentAccount } = usePortalAuth();
  const { thread, initializeForAccount, sendMessage, markAllRead } =
    usePortalMessages();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentAccount) {
      initializeForAccount(currentAccount.id);
    }
  }, [currentAccount, initializeForAccount]);

  useEffect(() => {
    if (thread && thread.unreadCount > 0) {
      markAllRead();
    }
    // Only run when thread is first loaded, not on every unreadCount change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread?.id]);

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content);
      setIsTyping(true);

      // The hook auto-replies after ~2s, so show typing for ~2.5s
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 2500);

      return () => clearTimeout(timeout);
    },
    [sendMessage]
  );

  const rep = thread ? getRepById(thread.repId) : undefined;

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={MessageSquare}
        title="Messages"
        subtitle="Chat with your Frost sales representative"
      />

      <div className="flex min-h-[600px] flex-col overflow-hidden rounded-xl border border-border-default bg-card">
        {/* Rep header */}
        {rep && (
          <MessageRepHeader repName={rep.name} repTitle={rep.title} />
        )}

        {/* Thread */}
        {thread && thread.messages.length > 0 ? (
          <MessageThread
            messages={thread.messages}
            className="flex-1"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-text-muted">
            No messages yet. Start the conversation below.
          </div>
        )}

        {/* Input */}
        <MessageInput onSend={handleSend} isTyping={isTyping} />
      </div>
    </div>
  );
}
