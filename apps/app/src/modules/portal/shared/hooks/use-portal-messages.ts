import { create } from 'zustand';
import type { PortalMessageThread, PortalMessage } from '../types';
import { getMessageThreadForAccount } from '../mock-data';

interface PortalMessageState {
  thread: PortalMessageThread | null;
  unreadCount: number;
  initializeForAccount: (accountId: string) => void;
  sendMessage: (content: string) => void;
  markAllRead: () => void;
}

function createMessage(
  threadId: string,
  accountId: string,
  content: string,
  role: PortalMessage['senderRole']
): PortalMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    threadId,
    senderId: accountId,
    senderName: role === 'dispensary' ? 'You' : 'Frost Rep',
    senderRole: role,
    content,
    timestamp: new Date().toISOString(),
    read: role === 'dispensary',
  };
}

export const usePortalMessages = create<PortalMessageState>((set, get) => ({
  thread: null,
  unreadCount: 0,

  initializeForAccount: (accountId: string) => {
    const thread = getMessageThreadForAccount(accountId);
    set({
      thread,
      unreadCount: thread?.unreadCount ?? 0,
    });
  },

  sendMessage: (content: string) => {
    const { thread } = get();
    if (!thread) return;

    const newMessage = createMessage(
      thread.id,
      thread.accountId,
      content,
      'dispensary'
    );

    const updatedThread: PortalMessageThread = {
      ...thread,
      messages: [...thread.messages, newMessage],
      lastMessageAt: newMessage.timestamp,
    };

    set({ thread: updatedThread });

    // Auto-reply from rep after 2 seconds
    setTimeout(() => {
      const currentThread = get().thread;
      if (!currentThread) return;

      const autoReply = createMessage(
        currentThread.id,
        currentThread.repId,
        getAutoReplyContent(content),
        'rep'
      );

      const threadWithReply: PortalMessageThread = {
        ...currentThread,
        messages: [...currentThread.messages, autoReply],
        lastMessageAt: autoReply.timestamp,
        unreadCount: currentThread.unreadCount + 1,
      };

      set({
        thread: threadWithReply,
        unreadCount: get().unreadCount + 1,
      });
    }, 2000);
  },

  markAllRead: () => {
    const { thread } = get();
    if (!thread) return;

    const updatedMessages = thread.messages.map((msg) => ({
      ...msg,
      read: true,
    }));

    const updatedThread: PortalMessageThread = {
      ...thread,
      messages: updatedMessages,
      unreadCount: 0,
    };

    set({ thread: updatedThread, unreadCount: 0 });
  },
}));

function getAutoReplyContent(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('order') || lower.includes('delivery')) {
    return "Thanks for reaching out! Let me check on that for you. I'll have an update within the hour.";
  }
  if (lower.includes('price') || lower.includes('discount')) {
    return "Great question about pricing! I can definitely look into volume options for you. What quantities are you thinking?";
  }
  if (lower.includes('product') || lower.includes('strain') || lower.includes('new')) {
    return "We've got some exciting new drops coming in! I'll send over the updated catalog shortly.";
  }
  return "Got your message! I'll get back to you shortly. Is there anything urgent I should prioritize?";
}
