'use client';

import Link from 'next/link';
import { ClipboardList, MessageSquare, ListChecks, Package } from 'lucide-react';

const actions = [
  { label: 'New Order', description: 'Create a new sales order', icon: ClipboardList, route: '/orders', color: '#F59E0B' },
  { label: 'Log Interaction', description: 'Record a customer touchpoint', icon: MessageSquare, route: '/crm', color: '#F59E0B' },
  { label: 'View Work Queue', description: 'See all pending tasks', icon: ListChecks, route: '/tasks', color: '#8B5CF6' },
  { label: 'Check Inventory', description: 'Browse current stock', icon: Package, route: '/inventory', color: '#8B5CF6' },
];

export function QuickActions() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-bright">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.route}
              className="group flex items-center gap-3 rounded-xl border border-default bg-card p-4 transition-all duration-200 hover:bg-card-hover hover:-translate-y-0.5"
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <Icon className="h-5 w-5" style={{ color: action.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-bright">{action.label}</p>
                <p className="text-[10px] text-text-muted truncate">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
