import { create } from 'zustand';
import type { PortalProduct, PortalCartItem, PortalOrderTemplate } from '../types';

function getAppliedDiscount(
  product: PortalProduct,
  quantity: number
): PortalCartItem['appliedDiscount'] {
  if (product.volumeBreaks.length === 0) return undefined;

  // Find the best matching volume break (highest minQuantity that quantity meets)
  const applicableBreak = [...product.volumeBreaks]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((vb) => quantity >= vb.minQuantity);

  if (!applicableBreak) return undefined;

  const savedAmount =
    (product.unitPrice - applicableBreak.pricePerUnit) * quantity;

  return {
    type: 'volume' as const,
    label: `${applicableBreak.discountPercent}% off (${applicableBreak.minQuantity}+ units)`,
    savedAmount,
  };
}

interface PortalCartState {
  items: PortalCartItem[];
  addItem: (product: PortalProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  totalDiscount: () => number;
  loadTemplate: (template: PortalOrderTemplate, products: PortalProduct[]) => void;
  saveAsTemplate: (name: string) => PortalOrderTemplate;
}

export const usePortalCart = create<PortalCartState>((set, get) => ({
  items: [],

  addItem: (product: PortalProduct, quantity: number = 1) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i.product.id === product.id);

    if (existingIndex >= 0) {
      const newQuantity = items[existingIndex].quantity + quantity;
      const updatedItems = items.map((item, idx) =>
        idx === existingIndex
          ? {
              ...item,
              quantity: newQuantity,
              appliedDiscount: getAppliedDiscount(item.product, newQuantity),
            }
          : item
      );
      set({ items: updatedItems });
    } else {
      const newItem: PortalCartItem = {
        product,
        quantity,
        appliedDiscount: getAppliedDiscount(product, quantity),
      };
      set({ items: [...items, newItem] });
    }
  },

  removeItem: (productId: string) => {
    const { items } = get();
    set({ items: items.filter((i) => i.product.id !== productId) });
  },

  updateQuantity: (productId: string, quantity: number) => {
    const { items } = get();
    if (quantity <= 0) {
      set({ items: items.filter((i) => i.product.id !== productId) });
      return;
    }
    const updatedItems = items.map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity,
            appliedDiscount: getAppliedDiscount(item.product, quantity),
          }
        : item
    );
    set({ items: updatedItems });
  },

  clearCart: () => {
    set({ items: [] });
  },

  totalItems: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  totalPrice: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.product.unitPrice;
      const discount = item.appliedDiscount?.savedAmount ?? 0;
      return sum + lineTotal - discount;
    }, 0);
  },

  totalDiscount: () => {
    const { items } = get();
    return items.reduce(
      (sum, item) => sum + (item.appliedDiscount?.savedAmount ?? 0),
      0
    );
  },

  loadTemplate: (template: PortalOrderTemplate, products: PortalProduct[]) => {
    const newItems: PortalCartItem[] = [];
    for (const templateItem of template.items) {
      const product = products.find((p) => p.id === templateItem.productId);
      if (!product) continue;
      newItems.push({
        product,
        quantity: templateItem.quantity,
        appliedDiscount: getAppliedDiscount(product, templateItem.quantity),
      });
    }
    set({ items: newItems });
  },

  saveAsTemplate: (name: string): PortalOrderTemplate => {
    const { items } = get();
    const estimatedTotal = items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.product.unitPrice;
      const discount = item.appliedDiscount?.savedAmount ?? 0;
      return sum + lineTotal - discount;
    }, 0);

    return {
      id: `tmpl-${Date.now()}`,
      name,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      createdAt: new Date().toISOString(),
      estimatedTotal,
    };
  },
}));
