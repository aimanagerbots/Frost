'use client';

import { useState } from 'react';
import { ModalShell } from './ModalShell';
import { useSalesReps } from '../hooks';

interface AssignSalespersonModalProps {
  open: boolean;
  onClose: () => void;
  currentRep: string;
}

export function AssignSalespersonModal({ open, onClose, currentRep }: AssignSalespersonModalProps) {
  const { data: reps = [] } = useSalesReps();
  const [selected, setSelected] = useState(currentRep);

  const handleAssign = () => {
    console.log('Assigned rep:', selected);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Change Assigned Sales Person">
      <div className="space-y-3">
        {reps.map((rep) => (
          <label key={rep} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-elevated">
            <input
              type="radio"
              name="salesRep"
              value={rep}
              checked={selected === rep}
              onChange={() => setSelected(rep)}
              className="h-4 w-4 accent-amber-500"
            />
            <span className="text-sm text-text-default">{rep}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-default px-4 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
        >
          Close
        </button>
        <button
          type="button"
          onClick={handleAssign}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#F59E0B' }}
        >
          Assign
        </button>
      </div>
    </ModalShell>
  );
}
