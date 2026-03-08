'use client';

import { Users, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import type { Email } from '@/modules/email/types';

interface CRMContextPanelProps {
  email: Email;
}

export function CRMContextPanel({ email }: CRMContextPanelProps) {
  if (!email.crmLinked) return null;

  const healthColor =
    (email.crmHealthScore ?? 0) >= 80
      ? '#00E5A0'
      : (email.crmHealthScore ?? 0) >= 50
        ? '#5BB8E6'
        : '#FB7185';

  return (
    <div className="rounded-lg border border-default bg-base p-3 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Users size={14} className="text-[#5BB8E6]" />
        <span className="text-xs font-medium text-text-bright">
          {email.crmAccountName}
        </span>
        <a
          href={`/crm?account=${email.crmAccountId}`}
          className="ml-auto text-[10px] text-[#5BB8E6] hover:underline"
        >
          View in CRM
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-text-muted" />
          <span className="text-[10px] text-text-muted">Health</span>
          <span
            className="ml-auto text-xs font-semibold"
            style={{ color: healthColor }}
          >
            {email.crmHealthScore}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShoppingCart size={12} className="text-text-muted" />
          <span className="text-[10px] text-text-muted">Pipeline</span>
          <span className="ml-auto text-[10px] text-text-default truncate max-w-[80px]">
            {email.crmPipelineStatus}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign size={12} className="text-text-muted" />
          <span className="text-[10px] text-text-muted">30d Rev</span>
          <span className="ml-auto text-xs text-text-default">
            ${((email.crmRevenue30d ?? 0) / 1000).toFixed(1)}K
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-text-muted">Last Order</span>
          <span className="ml-auto text-[10px] text-text-default">
            {email.crmLastOrderDate ?? 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
}
