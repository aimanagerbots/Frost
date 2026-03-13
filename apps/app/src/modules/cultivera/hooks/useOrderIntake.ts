import { useQuery } from '@tanstack/react-query';
import { BOT_STATUS, IMPORTED_ORDERS } from '@/mocks/cultivera';
import type { BotStatus, OrderImport } from '../types';

interface OrderIntakeData {
  botStatus: BotStatus;
  orders: OrderImport[];
}

export function useOrderIntake() {
  return useQuery<OrderIntakeData>({
    queryKey: ['cultivera', 'order-intake'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return { botStatus: BOT_STATUS, orders: IMPORTED_ORDERS };
    },
  });
}
