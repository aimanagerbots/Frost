'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info } from 'lucide-react';
import { ModalShell } from './ModalShell';

const schema = z.object({
  holdingCompany: z.string(),
  partnershipStatus: z.string(),
  name: z.string().min(1, 'Name is required'),
  workflowStatus: z.string().min(1, 'Workflow status is required'),
  streetAddress: z.string(),
  doBusinessAs: z.string(),
  city: z.string(),
  state: z.string(),
  county: z.string(),
  zipCode: z.string(),
  route: z.string(),
  phone: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface AddNonCannabisAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const INPUT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none';

const SELECT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none';

const WORKFLOW_STATUSES = ['Prospect', 'Partner', 'Active', 'Inactive'];
const WA_STATES = ['', 'Washington', 'Oregon', 'California', 'Idaho', 'Montana'];

export function AddNonCannabisAccountModal({ open, onClose }: AddNonCannabisAccountModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      holdingCompany: '',
      partnershipStatus: '',
      name: '',
      workflowStatus: '',
      streetAddress: '',
      doBusinessAs: '',
      city: '',
      state: '',
      county: '',
      zipCode: '',
      route: '',
      phone: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Non-cannabis account created:', data);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="New Non-Cannabis Client" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Warning banner */}
        <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs text-amber-400">
            Please note that the account you are about to add will have certain restrictions. You can only accept transfer or sell non-cannabis products to this account.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Holding Company</label>
            <select {...register('holdingCompany')} className={SELECT_CLS}>
              <option value="">-- Select holding company --</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Partnership Status</label>
            <select {...register('partnershipStatus')} className={SELECT_CLS}>
              <option value="">-- Select --</option>
              <option value="prospect">Prospect</option>
              <option value="partner">Partner</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">
              Name <span className="text-red-400">*</span>
            </label>
            <input {...register('name')} className={INPUT_CLS} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">
              Workflow Status <span className="text-red-400">*</span>
            </label>
            <select {...register('workflowStatus')} className={SELECT_CLS}>
              <option value="">-- SELECT WORKFLOW STATUS --</option>
              {WORKFLOW_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.workflowStatus && <p className="mt-1 text-xs text-red-400">{errors.workflowStatus.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Street Address</label>
            <input {...register('streetAddress')} className={INPUT_CLS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Do Business As</label>
            <input {...register('doBusinessAs')} className={INPUT_CLS} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">City</label>
            <input {...register('city')} className={INPUT_CLS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">State</label>
            <select {...register('state')} className={SELECT_CLS}>
              {WA_STATES.map((s) => (
                <option key={s} value={s}>{s || '-- Select --'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">County</label>
            <input {...register('county')} className={INPUT_CLS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Zip Code</label>
            <input {...register('zipCode')} className={INPUT_CLS} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Route</label>
            <select {...register('route')} className={SELECT_CLS}>
              <option value="">-- SELECT ROUTE --</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Phone</label>
            <input {...register('phone')} className={INPUT_CLS} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-default px-4 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
          >
            Close
          </button>
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#F59E0B' }}
          >
            Create
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
