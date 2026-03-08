'use client';

import { TimelineView } from '@/components';
import type { ActivityItem } from '@/modules/crm/types';
import {
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Bot,
  HeartPulse,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TYPE_ICONS: Record<ActivityItem['type'], LucideIcon> = {
  order: ShoppingCart,
  payment: CreditCard,
  interaction: MessageSquare,
  agent: Bot,
  'health-change': HeartPulse,
};

const TYPE_COLORS: Record<ActivityItem['type'], string> = {
  order: '#5BB8E6',
  payment: '#00E5A0',
  interaction: '#5BB8E6',
  agent: '#5BB8E6',
  'health-change': '#FB7185',
};

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const timelineItems = activities.map((act) => ({
    id: act.id,
    timestamp: act.timestamp,
    icon: TYPE_ICONS[act.type],
    iconColor: TYPE_COLORS[act.type],
    title: act.title,
    description: act.description,
    user: act.user,
    channel: act.channel,
  }));

  return (
    <div className="rounded-xl border border-default bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-text-bright">Recent Activity</h3>
      <TimelineView items={timelineItems} />
    </div>
  );
}
