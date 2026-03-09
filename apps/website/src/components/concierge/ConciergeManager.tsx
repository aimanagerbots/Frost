'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  type ChatMessage,
  type ConversationState,
  getInitialMessages,
  createInitialState,
  getNextMessages,
  getQuickReplies,
} from '@/lib/concierge-flow';
import { OrderConcierge } from './OrderConcierge';

interface ConciergeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  productName: string;
  productPrice: number;
}

function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ConciergeManager({
  isOpen,
  onClose,
  storeName,
  productName,
  productPrice,
}: ConciergeManagerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>(
    () => createInitialState(storeName, productName, productPrice),
  );
  const [isTyping, setIsTyping] = useState(false);
  const hasInitialized = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up timeouts on unmount
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Track previous open state for transition detection
  const prevOpenRef = useRef(false);

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = isOpen;

    // Drawer just opened — initialize conversation
    if (isOpen && !wasOpen && !hasInitialized.current) {
      hasInitialized.current = true;
      const initial = getInitialMessages(storeName);

      const t0 = setTimeout(() => setIsTyping(true), 0);
      const t1 = setTimeout(() => setMessages([initial[0]]), 600);
      const t2 = setTimeout(() => {
        setMessages([initial[0], initial[1]]);
        setIsTyping(false);
      }, 1400);

      timeoutsRef.current.push(t0, t1, t2);
    }

    // Drawer just closed — reset
    if (!isOpen && wasOpen) {
      hasInitialized.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      const t = setTimeout(() => {
        setMessages([]);
        setConversationState(createInitialState(storeName, productName, productPrice));
        setIsTyping(false);
      }, 0);
      timeoutsRef.current.push(t);
    }
  }, [isOpen, storeName, productName, productPrice]);

  const handleSend = useCallback(
    (userInput: string) => {
      if (isTyping || conversationState.step === 'done') return;

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userInput,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Get assistant response after delay
      const { messages: responseMessages, newState } = getNextMessages(
        conversationState,
        userInput,
      );

      // Stagger assistant messages
      let cumulativeDelay = 0;
      responseMessages.forEach((msg, i) => {
        const delay = i === 0 ? randomDelay(800, 1500) : randomDelay(500, 900);
        cumulativeDelay += delay;

        const t = setTimeout(() => {
          setMessages((prev) => [...prev, msg]);
          // Stop typing after last message
          if (i === responseMessages.length - 1) {
            setIsTyping(false);
          }
        }, cumulativeDelay);

        timeoutsRef.current.push(t);
      });

      // If check-stock, auto-advance to prep-order after a beat
      if (newState.step === 'check-stock') {
        const autoAdvanceDelay = cumulativeDelay + randomDelay(1000, 1500);
        const { messages: nextMsgs, newState: nextState } = getNextMessages(
          newState,
          '',
        );

        let extraDelay = autoAdvanceDelay;
        nextMsgs.forEach((msg, i) => {
          extraDelay += i === 0 ? 600 : 400;
          const t = setTimeout(() => {
            setMessages((prev) => [...prev, msg]);
            if (i === nextMsgs.length - 1) {
              setConversationState(nextState);
            }
          }, extraDelay);
          timeoutsRef.current.push(t);
        });
      } else {
        setConversationState(newState);
      }
    },
    [isTyping, conversationState],
  );

  const handleBounceToSms = useCallback(() => {
    if (!conversationState.phoneNumber) return;

    const smsMessage: ChatMessage = {
      id: `sys-${Date.now()}`,
      role: 'system',
      content: `Conversation moved to SMS at ${conversationState.phoneNumber}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, smsMessage]);
    setConversationState((prev) => ({ ...prev, step: 'done' }));

    const t = setTimeout(() => {
      onClose();
    }, 2000);
    timeoutsRef.current.push(t);
  }, [conversationState.phoneNumber, onClose]);

  const quickReplies = getQuickReplies(conversationState.step);
  const isDone = conversationState.step === 'done';

  return (
    <OrderConcierge
      isOpen={isOpen}
      onClose={onClose}
      messages={messages}
      conversationState={conversationState}
      isTyping={isTyping}
      isDone={isDone}
      quickReplies={quickReplies}
      onSend={handleSend}
      onBounceToSms={handleBounceToSms}
    />
  );
}
