'use client';

import { useState, useMemo } from 'react';
import { CreditCard } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalAuth, usePortalInvoices } from '@/modules/portal/shared/hooks';
import { getPaymentMethodsForAccount } from '@/modules/portal/shared/mock-data';
import type { PortalInvoice } from '@/modules/portal/shared/types';
import {
  PaymentsOverdueAlert,
  PaymentsSummary,
  PaymentsInvoiceList,
  PaymentsPayNow,
  PaymentsHistory,
  PaymentsForm,
} from '@/modules/portal/payments/components';

export default function PaymentsPage() {
  const { currentAccount } = usePortalAuth();
  const accountId = currentAccount?.id ?? '';
  const { data: rawInvoices, isLoading } = usePortalInvoices(accountId);

  // Local state to track payments made during this session
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Derive invoices with local payment state applied (immutable)
  const invoices: PortalInvoice[] = useMemo(() => {
    if (!rawInvoices) return [];
    return rawInvoices.map((inv) =>
      paidIds.has(inv.id)
        ? {
            ...inv,
            status: 'paid' as const,
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'ach' as const,
            complianceStatus: 'compliant' as const,
          }
        : inv
    );
  }, [rawInvoices, paidIds]);

  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  // Most urgent overdue invoice (highest days elapsed)
  const urgentInvoice = overdueInvoices.length > 0
    ? overdueInvoices.reduce((most, inv) =>
        inv.daysElapsed > most.daysElapsed ? inv : most
      )
    : null;

  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId) ?? null;
  const paymentMethods = accountId ? getPaymentMethodsForAccount(accountId) : [];

  const handlePay = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
  };

  const handleSubmitPayment = (invoiceId: string, _methodId: string) => {
    setPaidIds((prev) => new Set([...prev, invoiceId]));
    setSelectedInvoiceId(null);
  };

  if (!currentAccount) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          icon={CreditCard}
          title="Payments"
          subtitle="Manage invoices and payment methods"
        />
        <div className="rounded-xl border border-border-default bg-card p-8 text-center text-text-muted">
          Please log in to view payments.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          icon={CreditCard}
          title="Payments"
          subtitle="Manage invoices and payment methods"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border-default bg-card"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={CreditCard}
        title="Payments"
        subtitle="Manage invoices and payment methods"
      />

      {/* Overdue alert */}
      {overdueInvoices.length > 0 && (
        <PaymentsOverdueAlert
          overdueCount={overdueInvoices.length}
          totalOverdue={totalOverdue}
        />
      )}

      {/* Summary cards */}
      <PaymentsSummary invoices={invoices} />

      {/* Outstanding invoices + urgent pay-now side by side on desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentsInvoiceList invoices={invoices} onPay={handlePay} />
        </div>
        {urgentInvoice && (
          <div className="lg:col-span-1">
            <PaymentsPayNow invoice={urgentInvoice} onPay={handlePay} />
          </div>
        )}
      </div>

      {/* Payment history */}
      <PaymentsHistory invoices={invoices} />

      {/* Payment modal */}
      {selectedInvoice && (
        <PaymentsForm
          invoice={selectedInvoice}
          paymentMethods={paymentMethods}
          onSubmit={handleSubmitPayment}
          onClose={() => setSelectedInvoiceId(null)}
        />
      )}
    </div>
  );
}
