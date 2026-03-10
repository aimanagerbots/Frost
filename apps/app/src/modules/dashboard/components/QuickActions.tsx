'use client';

import Link from 'next/link';
import { ClipboardList, MessageSquare, ListChecks, Package } from 'lucide-react';

const actions = [
  { label: 'New Order', description: 'Create a new sales order', icon: ClipboardList, route: '/orders' },
  { label: 'Log Interaction', description: 'Record a customer touchpoint', icon: MessageSquare, route: '/crm' },
  { label: 'View Work Queue', description: 'See all pending tasks', icon: ListChecks, route: '/tasks' },
  { label: 'Check Inventory', description: 'Browse current stock', icon: Package, route: '/inventory' },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm font-semibold text-text-bright">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.route}
              className="group rounded-xl bg-card p-5 transition-colors hover:bg-elevated"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10">
                <Icon className="h-5 w-5 text-accent-primary" />
              </div>
              <p className="font-display text-sm font-medium text-text-default">{action.label}</p>
              <p className="mt-0.5 text-xs text-text-muted">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
