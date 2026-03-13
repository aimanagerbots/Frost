'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalShell } from './ModalShell';

const schema = z.object({
  note: z.string(),
  sentSamples: z.boolean(),
  leftVoicemail: z.boolean(),
  emailed: z.boolean(),
  called: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface UpdateNotesModalProps {
  open: boolean;
  onClose: () => void;
}

const INPUT_CLS =
  'w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none';

export function UpdateNotesModal({ open, onClose }: UpdateNotesModalProps) {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      note: '',
      sentSamples: false,
      leftVoicemail: false,
      emailed: false,
      called: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Note added:', data);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Add Note" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <textarea
            {...register('note')}
            rows={4}
            className={INPUT_CLS}
            placeholder="type your note here"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {[
            { name: 'sentSamples' as const, label: 'Sent Samples' },
            { name: 'leftVoicemail' as const, label: 'Left Voicemail' },
            { name: 'emailed' as const, label: 'Emailed' },
            { name: 'called' as const, label: 'Called' },
          ].map(({ name, label }) => (
            <label key={name} className="flex cursor-pointer items-center gap-2 text-sm text-text-default">
              <input
                type="checkbox"
                {...register(name)}
                className="h-4 w-4 rounded border-default accent-amber-500"
              />
              {label}
            </label>
          ))}
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
            Add Note
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
