'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MessageSquare, ShoppingCart, Store } from 'lucide-react';
import { SearchOverlay } from './SearchOverlay';
import type { SearchGroup, SearchItem } from './SearchOverlay';
import { navGroups } from './AppShell/nav-data';
import { accounts } from '@/mocks/crm';
import { useCommandPaletteStore } from './AppShell/store';

function useCommandPaletteItems(): SearchGroup[] {
  return useMemo(() => {
    const modules: SearchGroup = {
      label: 'Modules',
      items: navGroups.flatMap((group) =>
        group.items.map((item) => ({
          id: `module-${item.href}`,
          title: item.label,
          subtitle: group.title,
          icon: item.icon,
          route: item.href,
        })),
      ),
    };

    const accountItems: SearchGroup = {
      label: 'Accounts',
      items: accounts.map((acct) => ({
        id: `account-${acct.id}`,
        title: acct.name,
        subtitle: `${acct.region} · ${acct.status}`,
        icon: Store,
        route: `/crm?tab=accounts&sub=accounts&account=${acct.id}`,
      })),
    };

    const actions: SearchGroup = {
      label: 'Actions',
      items: [
        { id: 'action-new-task', title: 'New Task', icon: Plus, route: '/tasks' },
        { id: 'action-log-interaction', title: 'Log Interaction', icon: MessageSquare, route: '/crm?tab=outreach&sub=interactions' },
        { id: 'action-create-order', title: 'Create Order', icon: ShoppingCart, route: '/orders' },
      ],
    };

    return [modules, accountItems, actions];
  }, []);
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useCommandPaletteStore();
  const groups = useCommandPaletteItems();

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setCommandPaletteOpen(false);
      router.push(item.route);
    },
    [router, setCommandPaletteOpen],
  );

  return (
    <SearchOverlay
      open={commandPaletteOpen}
      onClose={() => setCommandPaletteOpen(false)}
      onSelect={handleSelect}
      groups={groups}
    />
  );
}
