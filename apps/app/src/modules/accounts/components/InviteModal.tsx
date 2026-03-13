'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalShell } from './ModalShell';
import type { SalesAccount } from '../types';

const schema = z.object({
  clientName: z.string().min(1),
  address: z.string().min(1),
  licenseUBI: z.string().min(1),
  email: z.string().email('Valid email required'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  account: SalesAccount | null;
}

const INPUT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none';

export function InviteModal({ open, onClose, account }: InviteModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      clientName: account?.clientName ?? '',
      address: account ? `${account.address}, ${account.city}` : '',
      licenseUBI: account?.licenseUBI ?? '',
      email: account?.email ?? '',
      message: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    // Mock — would POST to API
    console.log('Invite sent:', data);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Invitation Form">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Client Name</label>
          <input {...register('clientName')} readOnly className={INPUT_CLS + ' bg-elevated'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Address</label>
          <input {...register('address')} readOnly className={INPUT_CLS + ' bg-elevated'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">License / UBI</label>
          <input {...register('licenseUBI')} readOnly className={INPUT_CLS + ' bg-elevated'} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input {...register('email')} className={INPUT_CLS} placeholder="Email Address" />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Message</label>
          <textarea {...register('message')} rows={3} className={INPUT_CLS} placeholder="Optional Message" />
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
            Invite
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
