import type { PortalPromotion } from '../types';

export const PORTAL_PROMOTIONS: PortalPromotion[] = [
  {
    id: 'promo-1',
    title: 'Concentrate Week',
    description: 'Take 10% off all concentrates — shatter and live resin included. Limited time only.',
    discountType: 'percentage',
    discountValue: 10,
    applicableCategories: ['concentrates'],
    startDate: '2026-03-05',
    endDate: '2026-03-13',
    isActive: true,
    badge: '10% OFF',
  },
  {
    id: 'promo-2',
    title: 'Wedding Cake Bundle',
    description: 'Buy 5 cases (60 units) of Wedding Cake 3.5g flower and get 12 units free. Stock up on your best-seller.',
    discountType: 'bogo',
    discountValue: 12,
    applicableProductIds: ['prod-fl-wc-35', 'prod-fl-wc-7', 'prod-fl-wc-14'],
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    isActive: true,
    badge: 'BUNDLE',
  },
  {
    id: 'promo-3',
    title: 'New Customer Special',
    description: '20% off your first order over $500. Available to Tier 3 (new) accounts only.',
    discountType: 'percentage',
    discountValue: 20,
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    isActive: true,
    badge: '20% OFF',
  },
];

export function getActivePromotions(): PortalPromotion[] {
  return PORTAL_PROMOTIONS.filter((promo) => promo.isActive);
}

export function getPromotionById(id: string): PortalPromotion | undefined {
  return PORTAL_PROMOTIONS.find((promo) => promo.id === id);
}
