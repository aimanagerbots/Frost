'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalShell } from '@/modules/portal/shared/components';
import { usePortalAuth, usePortalNotifications, usePortalStoreOrders } from '@/modules/portal/shared/hooks';

function PortalLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, currentAccount } = usePortalAuth();
  const { initializeForAccount: initNotifications } = usePortalNotifications();
  const { initializeForAccount: initStoreOrders } = usePortalStoreOrders();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (currentAccount) {
      initNotifications(currentAccount.id);
      if (currentAccount.storeOrdersEnabled) {
        initStoreOrders(currentAccount.id);
      }
    }
  }, [currentAccount, initNotifications, initStoreOrders]);

  if (!isAuthenticated) {
    return null;
  }

  return <PortalShell>{children}</PortalShell>;
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </QueryClientProvider>
  );
}
