'use client';

import Link from 'next/link';
import { ShoppingCart, Truck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface QuickAction {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href: string;
}

const ACTIONS: QuickAction[] = [
  {
    title: 'Shop',
    subtitle: 'Browse & order',
    icon: ShoppingCart,
    href: '/shop',
  },
  {
    title: 'Deliveries',
    subtitle: 'Track deliveries',
    icon: Truck,
    href: '/deliveries',
  },
  {
    title: 'AI Assistant',
    subtitle: 'Get help ordering',
    icon: Sparkles,
    href: '/ai-assistant',
  },
];

export function DashboardQuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            'group rounded-xl border border-border-default bg-card p-5',
            'transition-colors hover:bg-elevated'
          )}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10">
            <action.icon className="h-5 w-5 text-accent-primary" />
          </div>
          <p className="font-display text-sm font-medium text-text-default">
            {action.title}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">{action.subtitle}</p>
        </Link>
      ))}
    </div>
  );
}
