'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalShell } from './ModalShell';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required').or(z.literal('')),
  title: z.string(),
  phone: z.string(),
  phoneType: z.string(),
  note: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
}

const INPUT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none';

const SELECT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none';

const TITLES = ['', 'Buyer', 'Owner', 'Manager', 'Purchasing Agent', 'Store Manager', 'Inventory Manager'];
const PHONE_TYPES = ['Mobile', 'Office', 'Direct'];

export function AddContactModal({ open, onClose }: AddContactModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      phone: '',
      phoneType: 'Mobile',
      note: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Contact added:', data);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Client Contact" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">First Name</label>
            <input {...register('firstName')} className={INPUT_CLS} placeholder="First Name" />
            {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Last Name</label>
            <input {...register('lastName')} className={INPUT_CLS} placeholder="Last Name" />
            {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Email</label>
            <input {...register('email')} className={INPUT_CLS} placeholder="Email" />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Title</label>
            <select {...register('title')} className={SELECT_CLS}>
              {TITLES.map((t) => (
                <option key={t} value={t}>{t || '-- SELECT TITLE --'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Phone</label>
            <input {...register('phone')} className={INPUT_CLS} placeholder="Phone" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Phone Type</label>
            <select {...register('phoneType')} className={SELECT_CLS}>
              {PHONE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Note</label>
          <textarea {...register('note')} rows={3} className={INPUT_CLS} placeholder="Note" />
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
            Save
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
