'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ShoppingCart } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import type { CatalogProduct } from '@/modules/sales/types';

const ACCENT = '#F59E0B';

const schema = z.object({
  quantity: z
    .number()
    .int('Must be a whole number')
    .min(1, 'Minimum quantity is 1')
    .max(9999, 'Maximum quantity is 9,999'),
});

type FormValues = z.infer<typeof schema>;

interface AddToCartModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
  onAdd: (productId: string, quantity: number) => void;
}

export function AddToCartModal({ product, onClose, onAdd }: AddToCartModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { quantity: 0 },
  });

  const qty = watch('quantity') || 0;
  const lineTotal = product ? qty * product.price : 0;

  // Reset form when product changes
  useEffect(() => {
    reset({ quantity: 0 });
  }, [product, reset]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!product) return null;

  const onSubmit = (data: FormValues) => {
    onAdd(product.id, data.quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Add ${product.name} to cart`}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-default bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-text-bright">Add to Cart</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-elevated hover:text-text-default transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product Name (readonly) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Product
            </label>
            <div className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default">
              {product.name}
            </div>
          </div>

          {/* Price (readonly) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Unit Price
            </label>
            <div className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default">
              ${product.price.toFixed(2)}
            </div>
          </div>

          {/* Available */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Available
            </label>
            <div className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default">
              {product.available} units
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Quantity
            </label>
            <input
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none"
              placeholder="Enter quantity"
              min={0}
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-400">{errors.quantity.message}</p>
            )}
          </div>

          {/* Line Total */}
          <div className="rounded-lg bg-elevated px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-muted">Line Total</span>
            <span
              className="text-lg font-bold"
              style={{ color: ACCENT }}
            >
              ${lineTotal.toFixed(2)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-default px-4 py-2 text-sm font-medium text-text-muted hover:bg-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
