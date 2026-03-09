'use client';

import { useState } from 'react';
import { X, Building2, CreditCard, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalInvoice, PortalPaymentMethod } from '@/modules/portal/shared/types';

interface PaymentsFormProps {
  invoice: PortalInvoice;
  paymentMethods: PortalPaymentMethod[];
  onSubmit: (invoiceId: string, methodId: string) => void;
  onClose: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function PaymentsForm({
  invoice,
  paymentMethods,
  onSubmit,
  onClose,
}: PaymentsFormProps) {
  const defaultMethod = paymentMethods.find((m) => m.isDefault);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    defaultMethod?.id ?? ''
  );
  const [showAddNew, setShowAddNew] = useState(false);
  const [newMethodType, setNewMethodType] = useState<'ach' | 'echeck'>('ach');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = () => {
    if (selectedMethodId) {
      onSubmit(invoice.id, selectedMethodId);
    }
  };

  const isValid = selectedMethodId !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border-default bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default p-5">
          <div>
            <h2 className="text-lg font-semibold text-text-bright">
              Submit Payment
            </h2>
            <p className="mt-0.5 text-sm text-text-muted">
              Invoice {invoice.invoiceNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5">
          {/* Amount */}
          <div className="rounded-lg bg-elevated p-4 text-center">
            <p className="text-sm text-text-muted">Payment Amount</p>
            <p className="mt-1 text-3xl font-bold text-text-bright">
              {formatCurrency(invoice.amount)}
            </p>
          </div>

          {/* Existing methods */}
          {paymentMethods.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-default">
                Select Payment Method
              </p>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                    selectedMethodId === method.id
                      ? 'border-accent-primary/50 bg-accent-primary/[0.06]'
                      : 'border-border-default bg-elevated hover:border-border-default/80'
                  )}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.id}
                    checked={selectedMethodId === method.id}
                    onChange={() => {
                      setSelectedMethodId(method.id);
                      setShowAddNew(false);
                    }}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                      selectedMethodId === method.id
                        ? 'border-accent-primary'
                        : 'border-text-muted/40'
                    )}
                  >
                    {selectedMethodId === method.id && (
                      <div className="h-2 w-2 rounded-full bg-accent-primary" />
                    )}
                  </div>
                  <Building2 className="h-4 w-4 shrink-0 text-text-muted" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-default">
                      {method.label}
                    </p>
                    <p className="text-xs text-text-muted">
                      {method.type.toUpperCase()} ending in {method.lastFour}
                      {method.isDefault && ' — Default'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Add new method toggle */}
          <button
            type="button"
            onClick={() => {
              setShowAddNew(!showAddNew);
              if (!showAddNew) setSelectedMethodId('');
            }}
            className="flex items-center gap-2 text-sm font-medium text-accent-primary transition-colors hover:text-accent-primary/80"
          >
            <Plus className="h-4 w-4" />
            Add New Payment Method
          </button>

          {/* Add new form */}
          {showAddNew && (
            <div className="space-y-3 rounded-lg border border-border-default bg-elevated p-4">
              {/* Type selector */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewMethodType('ach')}
                  className={cn(
                    'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    newMethodType === 'ach'
                      ? 'bg-accent-primary/15 text-accent-primary'
                      : 'bg-base text-text-muted hover:text-text-default'
                  )}
                >
                  ACH Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setNewMethodType('echeck')}
                  className={cn(
                    'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    newMethodType === 'echeck'
                      ? 'bg-accent-primary/15 text-accent-primary'
                      : 'bg-base text-text-muted hover:text-text-default'
                  )}
                >
                  E-Check
                </button>
              </div>

              {/* Inputs */}
              <div>
                <label className="mb-1 block text-xs text-text-muted">
                  Routing Number
                </label>
                <input
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="123456789"
                  className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-default placeholder-text-muted/50 outline-none transition-colors focus:border-accent-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="000123456789"
                  className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-default placeholder-text-muted/50 outline-none transition-colors focus:border-accent-primary/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border-default p-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm font-medium text-text-default transition-colors hover:bg-base"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors',
              isValid
                ? 'bg-accent-primary hover:bg-accent-primary/90'
                : 'cursor-not-allowed bg-accent-primary/30 text-white/50'
            )}
          >
            <CreditCard className="h-4 w-4" />
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
}
