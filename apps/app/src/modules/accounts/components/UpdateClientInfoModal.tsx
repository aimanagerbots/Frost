'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalShell } from './ModalShell';
import type { SalesAccount } from '../types';

const schema = z.object({
  holdingCompany: z.string(),
  name: z.string().min(1, 'Required'),
  licenseNo: z.string(),
  ubi: z.string(),
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  county: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  licenseType: z.string(),
  route: z.string(),
  partnershipStatus: z.string(),
  privilegeDescription: z.string(),
  privilegeStatus: z.string(),
  workflowStatus: z.string(),
  doBusinessAs: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface UpdateClientInfoModalProps {
  open: boolean;
  onClose: () => void;
  account: SalesAccount | null;
}

const INPUT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none';

const SELECT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none';

const WA_STATES = ['Washington', 'Oregon', 'California', 'Idaho', 'Montana'];
const LICENSE_TYPES = ['', 'Marijuana Retailer', 'Marijuana Producer Tier 1', 'Marijuana Producer Tier 2', 'Marijuana Processor'];
const WORKFLOW_STATUSES = ['Prospect', 'Partner', 'Active', 'Inactive'];

export function UpdateClientInfoModal({ open, onClose, account }: UpdateClientInfoModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      holdingCompany: '',
      name: account?.clientName ?? '',
      licenseNo: account?.licenseUBI ?? '',
      ubi: '',
      streetAddress: account?.address ?? '',
      city: account?.city ?? '',
      state: 'Washington',
      county: '',
      zipCode: '',
      phone: '',
      licenseType: '',
      route: '',
      partnershipStatus: '',
      privilegeDescription: '',
      privilegeStatus: '',
      workflowStatus: account?.status === 'active' ? 'Partner' : 'Prospect',
      doBusinessAs: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Client info updated:', data);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Update Client Info" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Holding Company</label>
            <select {...register('holdingCompany')} className={SELECT_CLS}>
              <option value="">-- Select holding company --</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">License No.</label>
            <input {...register('licenseNo')} className={INPUT_CLS} />
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
            <label className="mb-1 block text-xs font-medium text-text-muted">UBI</label>
            <input {...register('ubi')} className={INPUT_CLS} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Street Address</label>
            <input {...register('streetAddress')} className={INPUT_CLS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">State</label>
            <select {...register('state')} className={SELECT_CLS}>
              {WA_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">City</label>
            <input {...register('city')} className={INPUT_CLS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Zip Code</label>
            <input {...register('zipCode')} className={INPUT_CLS} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">County</label>
            <input {...register('county')} className={INPUT_CLS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Phone</label>
            <input {...register('phone')} className={INPUT_CLS} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">License Type</label>
            <select {...register('licenseType')} className={SELECT_CLS}>
              {LICENSE_TYPES.map((t) => (
                <option key={t} value={t}>{t || '-- Select --'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Route</label>
            <select {...register('route')} className={SELECT_CLS}>
              <option value="">-- SELECT ROUTE --</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Partnership Status</label>
            <select {...register('partnershipStatus')} className={SELECT_CLS}>
              <option value="">-- Select --</option>
              <option value="prospect">Prospect</option>
              <option value="partner">Partner</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Workflow Status</label>
            <select {...register('workflowStatus')} className={SELECT_CLS}>
              {WORKFLOW_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Do Business As</label>
          <input {...register('doBusinessAs')} className={INPUT_CLS} />
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
