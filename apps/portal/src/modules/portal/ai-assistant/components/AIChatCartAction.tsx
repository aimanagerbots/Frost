'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIChatCartActionProps {
  action: {
    productId: string;
    productName: string;
    quantity: number;
  };
  onAdd: () => void;
}

export function AIChatCartAction({ action, onAdd }: AIChatCartActionProps) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (added) return;
    onAdd();
    setAdded(true);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-base/50 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-default">
          {action.productName}
        </p>
        <p className="text-xs text-text-muted">Qty: {action.quantity}</p>
      </div>

      <button
        onClick={handleAdd}
        disabled={added}
        className={cn(
          'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          added
            ? 'bg-green-500/15 text-green-400 cursor-default'
            : 'bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25'
        )}
      >
        {added ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Added
          </>
        ) : (
          <>
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
