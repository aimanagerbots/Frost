'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Check } from 'lucide-react';
import { useAllAccounts } from '../hooks';
import { useState, useRef, useEffect } from 'react';

const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  type: z.enum(['territory', 'rep', 'custom']),
  accountIds: z.array(z.string()).min(1, 'Select at least one account'),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateGroupForm) => void;
}

export function CreateGroupModal({ open, onClose, onCreate }: CreateGroupModalProps) {
  const { data: accounts = [] } = useAllAccounts();
  const [accountSearch, setAccountSearch] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '', type: 'territory', accountIds: [] },
  });

  function handleClose() {
    reset();
    setAccountSearch('');
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const filteredAccounts = accounts.filter((a) =>
    a.clientName.toLowerCase().includes(accountSearch.toLowerCase())
  );

  const onSubmit = (data: CreateGroupForm) => {
    onCreate(data);
    handleClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Create Account Group"
    >
      <div className="w-full max-w-lg rounded-xl border border-default bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-bright">Create Account Group</h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-card-hover hover:text-text-default"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-default">
              Group Name
            </label>
            <input
              {...register('name')}
              placeholder="e.g. Seattle Metro"
              className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-default">
              Group Type
            </label>
            <select
              {...register('type')}
              className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none"
            >
              <option value="territory">Territory</option>
              <option value="rep">Rep</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Account Multi-Select */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-default">
              Accounts
            </label>
            <input
              type="text"
              value={accountSearch}
              onChange={(e) => setAccountSearch(e.target.value)}
              placeholder="Filter accounts..."
              className="mb-2 w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none"
            />
            {errors.accountIds && (
              <p className="mb-2 text-xs text-red-400">{errors.accountIds.message}</p>
            )}
            <Controller
              control={control}
              name="accountIds"
              render={({ field }) => (
                <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-default bg-base p-2">
                  {filteredAccounts.map((account) => {
                    const selected = field.value.includes(account.id);
                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => {
                          const next = selected
                            ? field.value.filter((id) => id !== account.id)
                            : [...field.value, account.id];
                          field.onChange(next);
                        }}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                          selected
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'text-text-default hover:bg-card-hover'
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            selected
                              ? 'border-amber-500 bg-amber-500'
                              : 'border-default'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3 text-black" />}
                        </div>
                        <span>{account.clientName}</span>
                        <span className="ml-auto text-xs text-text-muted">{account.city}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <Controller
              control={control}
              name="accountIds"
              render={({ field }) => (
                <p className="mt-1 text-xs text-text-muted">
                  {field.value.length} account{field.value.length !== 1 ? 's' : ''} selected
                </p>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-default px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-card-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: '#F59E0B' }}
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
