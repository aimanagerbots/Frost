'use client';

import { useState } from 'react';
import {
  Send, Copy, Trash2, Tag, Settings2, Wand2,
} from 'lucide-react';
import type { CartLineItem } from '@/modules/sales/types';
import { ConversionSettingModal } from './ConversionSettingModal';
import { MarkTradeSamplesModal } from './MarkTradeSamplesModal';
import { AutoAllocateModal } from './AutoAllocateModal';

interface CartActionsProps {
  cartId: string;
  lineItems: CartLineItem[];
}

export function CartActions({ cartId, lineItems }: CartActionsProps) {
  const [conversionOpen, setConversionOpen] = useState(false);
  const [tradeSamplesOpen, setTradeSamplesOpen] = useState(false);
  const [autoAllocateOpen, setAutoAllocateOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
        >
          <Send className="h-4 w-4" />
          Submit Order
        </button>
        <button
          className="flex items-center gap-2 rounded-lg border border-default bg-card px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-accent-hover"
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </button>
        <button
          className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        <button
          onClick={() => setTradeSamplesOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-default bg-card px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-accent-hover"
        >
          <Tag className="h-4 w-4" />
          Mark Trade Samples
        </button>
        <button
          onClick={() => setConversionOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-default bg-card px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-accent-hover"
        >
          <Settings2 className="h-4 w-4" />
          Conversion Setting
        </button>
        <button
          onClick={() => setAutoAllocateOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-default bg-card px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-accent-hover"
        >
          <Wand2 className="h-4 w-4" />
          Auto Allocate
        </button>
      </div>

      <ConversionSettingModal
        open={conversionOpen}
        onClose={() => setConversionOpen(false)}
        cartId={cartId}
        lineItems={lineItems}
      />
      <MarkTradeSamplesModal
        open={tradeSamplesOpen}
        onClose={() => setTradeSamplesOpen(false)}
        lineItems={lineItems}
      />
      <AutoAllocateModal
        open={autoAllocateOpen}
        onClose={() => setAutoAllocateOpen(false)}
        cartId={cartId}
      />
    </>
  );
}
