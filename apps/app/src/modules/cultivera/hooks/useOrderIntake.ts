import { useDemoQuery } from '@/lib/use-demo-query';
import { BOT_STATUS, IMPORTED_ORDERS } from '@/mocks/cultivera';
import type { BotStatus, OrderImport } from '../types';

interface OrderIntakeData {
  botStatus: BotStatus;
  orders: OrderImport[];
}

export function useOrderIntake() {
  return useDemoQuery<OrderIntakeData>({
    queryKey: ['cultivera', 'order-intake'],
    demoQueryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return { botStatus: BOT_STATUS, orders: IMPORTED_ORDERS };
    },
    emptyValue: {
      botStatus: {
        state: 'idle',
        lastRun: '',
        nextRun: '',
        runsToday: 0,
        ordersImportedToday: 0,
        ordersImportedThisWeek: 0,
        pendingReview: 0,
      },
      orders: [],
    },
  });
}
