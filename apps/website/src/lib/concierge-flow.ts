export type ConversationStep =
  | 'greeting'
  | 'ask-phone'
  | 'confirm-product'
  | 'check-stock'
  | 'prep-order'
  | 'confirm-order'
  | 'done';

export interface ConversationState {
  readonly step: ConversationStep;
  readonly storeName: string;
  readonly productName: string;
  readonly productPrice: number;
  readonly phoneNumber: string;
  readonly pickupTime: string;
}

export interface ChatMessage {
  readonly id: string;
  readonly role: 'assistant' | 'user' | 'system';
  readonly content: string;
  readonly timestamp: Date;
  readonly component?: 'order-summary' | 'email-preview';
}

function createMessage(
  role: ChatMessage['role'],
  content: string,
  component?: ChatMessage['component'],
): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: new Date(),
    component,
  };
}

export function getInitialMessages(
  storeName: string,
): ChatMessage[] {
  return [
    createMessage(
      'assistant',
      `Hey there! 👋 I'm your Frost concierge. Let's get your order ready at ${storeName}.`,
    ),
    createMessage(
      'assistant',
      'First — drop your phone number so I can text you updates or if we get disconnected.',
    ),
  ];
}

export function createInitialState(
  storeName: string,
  productName: string,
  productPrice: number,
): ConversationState {
  return {
    step: 'ask-phone',
    storeName,
    productName,
    productPrice,
    phoneNumber: '',
    pickupTime: '',
  };
}

function isValidPhone(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  return digits.length >= 10;
}

function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return input;
}

function generatePickupTime(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHour}:${displayMinutes} ${period}`;
}

export function getNextMessages(
  state: ConversationState,
  userInput: string,
): { messages: ChatMessage[]; newState: ConversationState } {
  switch (state.step) {
    case 'ask-phone': {
      if (!isValidPhone(userInput)) {
        return {
          messages: [
            createMessage(
              'assistant',
              "Hmm, that doesn't look like a valid number. Try again — 10 digits is all I need.",
            ),
          ],
          newState: state,
        };
      }
      const formatted = formatPhone(userInput);
      return {
        messages: [
          createMessage(
            'assistant',
            `Got it — ${formatted}. So you're looking to grab **${state.productName}** — that right?`,
          ),
        ],
        newState: {
          ...state,
          step: 'confirm-product',
          phoneNumber: formatted,
        },
      };
    }

    case 'confirm-product': {
      const lower = userInput.toLowerCase();
      if (lower.includes('no') || lower.includes('different')) {
        return {
          messages: [
            createMessage(
              'assistant',
              "No worries! For now, head back to the menu and tap the order button on whatever catches your eye. I'll be here when you're ready.",
            ),
          ],
          newState: { ...state, step: 'done' },
        };
      }
      return {
        messages: [
          createMessage(
            'assistant',
            `One sec, checking with ${state.storeName}...`,
          ),
          createMessage(
            'assistant',
            `✓ They've got it! **${state.productName}** is on the shelf.`,
          ),
        ],
        newState: { ...state, step: 'check-stock' },
      };
    }

    case 'check-stock': {
      const pickupTime = generatePickupTime();
      return {
        messages: [
          createMessage(
            'assistant',
            `Awesome, I'll let them know to set one aside. Should be ready for pickup around **${pickupTime}** — about 15 minutes. Sound good?`,
          ),
        ],
        newState: { ...state, step: 'prep-order', pickupTime },
      };
    }

    case 'prep-order': {
      const lower = userInput.toLowerCase();
      if (lower.includes('how long')) {
        return {
          messages: [
            createMessage(
              'assistant',
              `Usually about 10-15 minutes. They're pretty quick at ${state.storeName}. Ready to lock it in?`,
            ),
          ],
          newState: state,
        };
      }
      return {
        messages: [
          createMessage(
            'assistant',
            "Order locked in! Here's your summary:",
          ),
          createMessage('assistant', '', 'order-summary'),
          createMessage(
            'assistant',
            "You're all set! 🎉 I just sent a confirmation to your phone and email. Head over whenever you're ready — they'll have it waiting.",
          ),
        ],
        newState: { ...state, step: 'confirm-order' },
      };
    }

    case 'confirm-order': {
      return {
        messages: [
          createMessage(
            'assistant',
            `See you next time! If anything changes, just text back or hit up ${state.storeName} directly.`,
          ),
        ],
        newState: { ...state, step: 'done' },
      };
    }

    case 'done': {
      return {
        messages: [
          createMessage(
            'system',
            'This conversation has ended. Start a new order to chat again.',
          ),
        ],
        newState: state,
      };
    }

    default:
      return { messages: [], newState: state };
  }
}

export function getQuickReplies(step: ConversationStep): string[] {
  switch (step) {
    case 'confirm-product':
      return ["Yes, that's right", 'No, different product'];
    case 'check-stock':
      return ['Sounds good!'];
    case 'prep-order':
      return ['Sounds good!', 'Can I get 2?', 'How long exactly?'];
    case 'confirm-order':
      return ['Thanks!', 'Got it 👍'];
    default:
      return [];
  }
}
