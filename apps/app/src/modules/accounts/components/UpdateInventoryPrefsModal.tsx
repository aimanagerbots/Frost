'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalShell } from './ModalShell';
import type { SalesAccount } from '../types';

const schema = z.object({
  fulfillmentPriority: z.string(),
  specialInstructions: z.string(),
  recentlyBoughtDays: z.string(),
  boughtLongTimeAgoDays: z.string(),
  neverBoughtDays: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface UpdateInventoryPrefsModalProps {
  open: boolean;
  onClose: () => void;
  account: SalesAccount | null;
}

const INPUT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none';

const PRIORITIES = [
  { value: 'fifo', label: 'FIFO' },
  { value: 'newest-first', label: 'Newest' },
  { value: 'highest-qa', label: 'Highest QA' },
  { value: 'lowest-qa', label: 'Lowest QA' },
];

export function UpdateInventoryPrefsModal({ open, onClose, account }: UpdateInventoryPrefsModalProps) {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      fulfillmentPriority: account?.fulfillmentPriority ?? 'fifo',
      specialInstructions: '',
      recentlyBoughtDays: '',
      boughtLongTimeAgoDays: '',
      neverBoughtDays: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Inventory prefs updated:', data);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Inventory Preferences" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Fulfillment Priority */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-default">Fulfillment Priority</h3>
            <div className="space-y-2">
              {PRIORITIES.map((p) => (
                <label key={p.value} className="flex cursor-pointer items-center gap-2 text-sm text-text-default">
                  <input
                    type="radio"
                    value={p.value}
                    {...register('fulfillmentPriority')}
                    className="h-4 w-4 accent-amber-500"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-default">Special Instructions For All Fulfillments</h3>
            <textarea {...register('specialInstructions')} rows={4} className={INPUT_CLS} />
          </div>

          {/* Purchase History Indicator */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-default">Purchase History Indicator</h3>
            <p className="mb-3 rounded-lg bg-green-500/10 p-2 text-xs text-green-400">
              This setting is used to mark inventories based on purchase history. Set number of days for each category.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-sm bg-green-500" />
                <span className="w-32 text-xs text-text-muted">Recently Bought</span>
                <input {...register('recentlyBoughtDays')} className={INPUT_CLS + ' max-w-[80px]'} placeholder="days" />
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-sm bg-amber-500" />
                <span className="w-32 text-xs text-text-muted">Bought Long Time Ago</span>
                <input {...register('boughtLongTimeAgoDays')} className={INPUT_CLS + ' max-w-[80px]'} placeholder="days" />
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-sm bg-red-500" />
                <span className="w-32 text-xs text-text-muted">Never Bought</span>
                <input {...register('neverBoughtDays')} className={INPUT_CLS + ' max-w-[80px]'} placeholder="days" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-default px-4 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#F59E0B' }}
          >
            Update
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
