'use client';

import { Building2, Clock, TestTube, TrendingUp, Mail, Phone } from 'lucide-react';
import type { LabPartner } from '@/modules/inventory/types';

interface LabPartnerCardsProps {
  partners: LabPartner[];
}

export function LabPartnerCards({ partners }: LabPartnerCardsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-bright">Lab Partners</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((lab) => (
          <div key={lab.id} className="rounded-xl border border-default bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9333EA]/20">
                <Building2 className="h-4 w-4 text-[#9333EA]" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-bright">{lab.name}</p>
                <p className="text-[10px] text-text-muted">{lab.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-text-muted" />
                <div>
                  <p className="text-xs font-medium text-text-default">{lab.avgTurnaround}d</p>
                  <p className="text-[9px] text-text-muted">Avg turn</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <TestTube className="h-3 w-3 text-text-muted" />
                <div>
                  <p className="text-xs font-medium text-text-default">{lab.testsThisMonth}</p>
                  <p className="text-[9px] text-text-muted">This mo.</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-text-muted" />
                <div>
                  <p className="text-xs font-medium text-text-default">{lab.passRate}%</p>
                  <p className="text-[9px] text-text-muted">Pass rate</p>
                </div>
              </div>
            </div>

            <div className="border-t border-default pt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <Mail className="h-2.5 w-2.5" />
                {lab.contactEmail}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <Phone className="h-2.5 w-2.5" />
                {lab.contactPhone}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
