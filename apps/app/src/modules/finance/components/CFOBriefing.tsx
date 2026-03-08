'use client';

import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { CFOBriefingItem, BriefingSeverity } from '@/modules/finance/types';

const severityConfig: Record<BriefingSeverity, { icon: typeof AlertTriangle; border: string; bg: string; badge: string; badgeText: string }> = {
  critical: { icon: AlertTriangle, border: 'border-l-red-500', bg: 'bg-red-500/5', badge: 'bg-red-500/20 text-red-400', badgeText: 'Critical' },
  warning: { icon: AlertCircle, border: 'border-l-amber-500', bg: 'bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-400', badgeText: 'Warning' },
  info: { icon: Info, border: 'border-l-blue-500', bg: 'bg-blue-500/5', badge: 'bg-blue-500/20 text-blue-400', badgeText: 'Info' },
  positive: { icon: CheckCircle, border: 'border-l-green-500', bg: 'bg-green-500/5', badge: 'bg-green-500/20 text-green-400', badgeText: 'Positive' },
};

interface CFOBriefingProps {
  items: CFOBriefingItem[];
}

export function CFOBriefing({ items }: CFOBriefingProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-card border border-default rounded-xl overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-card-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#059669]" />
          <h3 className="text-sm font-semibold text-default">AI CFO Briefing</h3>
          <span className="text-xs text-muted">({items.length} items)</span>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-muted" /> : <ChevronUp className="w-4 h-4 text-muted" />}
      </button>

      {!collapsed && (
        <div className="px-5 pb-4 space-y-3">
          {items.map((item) => {
            const config = severityConfig[item.severity];
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className={`border-l-4 ${config.border} ${config.bg} rounded-r-lg p-3 ${
                  item.severity === 'critical' ? 'animate-pulse-subtle' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0 text-inherit opacity-70" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${config.badge}`}>
                        {config.badgeText}
                      </span>
                      {item.metric && (
                        <span className="text-xs font-mono text-muted">{item.metric}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-default">{item.title}</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{item.description}</p>
                    {item.recommendation && (
                      <p className="text-xs text-[#059669] mt-1.5 font-medium">
                        Recommendation: {item.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
