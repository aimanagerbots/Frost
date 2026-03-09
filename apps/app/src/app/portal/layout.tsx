'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePortalAuth, usePortalNotifications, usePortalStoreOrders } from '@/modules/portal/shared/hooks';
import { PortalShell } from '@/modules/portal/shared/components/PortalShell';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, currentAccount } = usePortalAuth();
  const { initializeForAccount: initNotifications } = usePortalNotifications();
  const { initializeForAccount: initStoreOrders } = usePortalStoreOrders();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/portal/login') {
      router.replace('/portal/login');
    }
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    if (currentAccount) {
      initNotifications(currentAccount.id);
      initStoreOrders(currentAccount.id);
    }
  }, [currentAccount, initNotifications, initStoreOrders]);

  if (!isAuthenticated && pathname !== '/portal/login') {
    return null;
  }

  if (pathname === '/portal/login') {
    return (
      <div className="light">
        {children}
      </div>
    );
  }

  return (
    <div className="light">
      <PortalShell>{children}</PortalShell>
    </div>
  );
}
