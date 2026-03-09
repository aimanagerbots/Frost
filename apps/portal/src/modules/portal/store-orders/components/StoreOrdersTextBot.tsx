'use client';

import { MessageSquare, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoreOrdersTextBotProps {
  className?: string;
}

interface MockMessage {
  sender: 'bot' | 'customer';
  text: string;
  time: string;
}

const MOCK_CONVERSATION: MockMessage[] = [
  {
    sender: 'bot',
    text: 'Welcome to Green Frontier! Your order #SO-GF-042 is ready for pickup. Please present your ID at the counter.',
    time: '2:15 PM',
  },
  {
    sender: 'customer',
    text: 'On my way, be there in 10',
    time: '2:17 PM',
  },
  {
    sender: 'bot',
    text: 'See you soon! Present your order confirmation at the counter. We\'ll have it waiting.',
    time: '2:17 PM',
  },
  {
    sender: 'customer',
    text: 'Thanks!',
    time: '2:18 PM',
  },
];

export function StoreOrdersTextBot({ className }: StoreOrdersTextBotProps) {
  return (
    <div className={cn('rounded-xl border border-border-default bg-card', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border-default">
        <MessageSquare className="h-4 w-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-text-bright">Text Bot Preview</h3>
      </div>

      {/* Phone Mock */}
      <div className="p-5 flex justify-center">
        <div className="w-full max-w-xs">
          {/* Phone frame */}
          <div className="rounded-2xl border border-border-default bg-elevated overflow-hidden">
            {/* Phone status bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-base border-b border-border-default">
              <div className="flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-xs text-text-muted font-medium">Frost SMS</span>
              </div>
              <span className="text-xs text-text-muted">Now</span>
            </div>

            {/* Messages */}
            <div className="p-3 space-y-2.5 min-h-[240px]">
              {MOCK_CONVERSATION.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex',
                    msg.sender === 'customer' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-3.5 py-2',
                      msg.sender === 'bot'
                        ? 'bg-base text-text-default rounded-bl-sm'
                        : 'bg-accent-primary/20 text-accent-primary rounded-br-sm'
                    )}
                  >
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                    <p
                      className={cn(
                        'text-[10px] mt-1',
                        msg.sender === 'bot' ? 'text-text-muted' : 'text-accent-primary/60'
                      )}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
