'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalShell } from './ModalShell';
import type { SalesAccount } from '../types';

const schema = z.object({
  acceptsMonday: z.boolean(),
  acceptsTuesday: z.boolean(),
  acceptsWednesday: z.boolean(),
  acceptsThursday: z.boolean(),
  acceptsFriday: z.boolean(),
  acceptsSaturday: z.boolean(),
  acceptsSunday: z.boolean(),
  acceptsAm: z.boolean(),
  acceptsPm: z.boolean(),
  prefersMonday: z.boolean(),
  prefersTuesday: z.boolean(),
  prefersWednesday: z.boolean(),
  prefersThursday: z.boolean(),
  prefersFriday: z.boolean(),
  prefersSaturday: z.boolean(),
  prefersSunday: z.boolean(),
  prefersAm: z.boolean(),
  prefersPm: z.boolean(),
  specialInstructions: z.string(),
  labelBarcodePreference: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface UpdateDeliveryPrefsModalProps {
  open: boolean;
  onClose: () => void;
  account: SalesAccount | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const INPUT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none';

const SELECT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none';

export function UpdateDeliveryPrefsModal({ open, onClose, account }: UpdateDeliveryPrefsModalProps) {
  const deliveryDays = account?.deliveryDays ?? [];

  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      acceptsMonday: deliveryDays.includes('Monday'),
      acceptsTuesday: deliveryDays.includes('Tuesday'),
      acceptsWednesday: deliveryDays.includes('Wednesday'),
      acceptsThursday: deliveryDays.includes('Thursday'),
      acceptsFriday: deliveryDays.includes('Friday'),
      acceptsSaturday: false,
      acceptsSunday: false,
      acceptsAm: account?.amPm === 'am',
      acceptsPm: account?.amPm === 'pm',
      prefersMonday: false,
      prefersTuesday: false,
      prefersWednesday: false,
      prefersThursday: false,
      prefersFriday: false,
      prefersSaturday: false,
      prefersSunday: false,
      prefersAm: false,
      prefersPm: false,
      specialInstructions: account?.specialInstructions ?? '',
      labelBarcodePreference: account?.labelBarcodePreference ?? 'QR Code',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Delivery prefs updated:', data);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Delivery Preferences" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
        {/* Accepts Deliveries */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-default">Accepts Deliveries</h3>
          <div className="flex flex-wrap items-center gap-4">
            {DAYS.map((day) => (
              <label key={`accepts-${day}`} className="flex cursor-pointer items-center gap-2 text-sm text-text-default">
                <input
                  type="checkbox"
                  {...register(`accepts${day}` as keyof FormValues)}
                  className="h-4 w-4 rounded border-default accent-amber-500"
                />
                {day}
              </label>
            ))}
            <div className="ml-4 flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-text-default">
                <input type="checkbox" {...register('acceptsAm')} className="h-4 w-4 rounded border-default accent-amber-500" />
                AM
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-text-default">
                <input type="checkbox" {...register('acceptsPm')} className="h-4 w-4 rounded border-default accent-amber-500" />
                PM
              </label>
            </div>
          </div>
        </div>

        {/* Prefers Deliveries */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-default">Prefers Deliveries</h3>
          <div className="flex flex-wrap items-center gap-4">
            {DAYS.map((day) => (
              <label key={`prefers-${day}`} className="flex cursor-pointer items-center gap-2 text-sm text-text-default">
                <input
                  type="checkbox"
                  {...register(`prefers${day}` as keyof FormValues)}
                  className="h-4 w-4 rounded border-default accent-amber-500"
                />
                {day}
              </label>
            ))}
            <div className="ml-4 flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-text-default">
                <input type="checkbox" {...register('prefersAm')} className="h-4 w-4 rounded border-default accent-amber-500" />
                AM
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-text-default">
                <input type="checkbox" {...register('prefersPm')} className="h-4 w-4 rounded border-default accent-amber-500" />
                PM
              </label>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-default">Special Instructions For All Deliveries</h3>
          <textarea {...register('specialInstructions')} rows={3} className={INPUT_CLS} />
        </div>

        {/* Label Barcode Preference */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-default">Label Barcode Preference</h3>
          <select {...register('labelBarcodePreference')} className={SELECT_CLS}>
            <option value="QR Code">QR Code</option>
            <option value="UPC">UPC</option>
            <option value="None">None</option>
          </select>
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
