import type { ProductConcept, ProductFilter, RDMetrics } from '@/modules/products/types';

const PRODUCT_CONCEPTS: ProductConcept[] = [
  {
    id: 'prod-001',
    name: 'Solventless Live Rosin Gummy — 25mg',
    category: 'edible',
    stage: 'formulation',
    description:
      'Premium solventless edible featuring live rosin extracted in-house. Each gummy delivers a full-spectrum 25mg dose with natural fruit flavors and no artificial colors. Targeting the connoisseur segment seeking clean, high-potency edibles.',
    targetLaunch: '2026-05-01',
    assignee: 'Dana Whitfield',
    estimatedMargin: 62,
    targetAccounts: ['Green Leaf Dispensary', 'Elevation Wellness'],
  },
  {
    id: 'prod-002',
    name: 'Blue Dream 2g Disposable Vape',
    category: 'vaporizer',
    stage: 'sample',
    description:
      'All-in-one disposable vape pen with 2g live resin oil. Ceramic coil heating element for smooth draws. Blue Dream terpene profile with uplifting sativa-dominant effects.',
    targetLaunch: '2026-04-15',
    assignee: 'James Park',
    estimatedMargin: 55,
    strainName: 'Blue Dream',
  },
  {
    id: 'prod-003',
    name: 'Wedding Cake Diamond-Infused Preroll',
    category: 'preroll',
    stage: 'testing',
    description:
      'Hand-rolled 1.5g preroll with Wedding Cake flower, coated in live resin and rolled in THCa diamonds. Premium glass tube packaging with humidity control.',
    targetLaunch: '2026-04-01',
    assignee: 'Marcus Johnson',
    estimatedMargin: 58,
    strainName: 'Wedding Cake',
  },
  {
    id: 'prod-004',
    name: 'CBD:THC 1:1 Tincture 500mg',
    category: 'concentrate',
    stage: 'ideation',
    description:
      'Balanced 1:1 ratio tincture with 250mg CBD and 250mg THC per bottle. MCT oil carrier with natural peppermint flavor. Graduated dropper for precise dosing.',
    targetLaunch: '2026-06-01',
    assignee: 'Dana Whitfield',
    notes: 'Wellness segment expansion — growing demand for balanced ratios from medical customers and new consumers seeking mild effects.',
  },
  {
    id: 'prod-005',
    name: 'Mango Passionfruit Sparkling Water 10mg',
    category: 'beverage',
    stage: 'approved',
    description:
      'Fast-acting nano-emulsified THC sparkling water. Tropical mango and passionfruit flavor with zero sugar and zero calories. 10mg THC per 12oz can.',
    targetLaunch: '2026-03-15',
    assignee: 'Dana Whitfield',
    estimatedMargin: 48,
    targetAccounts: ['Cloud Nine Cannabis', 'Herbal Heights', 'Green Leaf Dispensary'],
  },
  {
    id: 'prod-006',
    name: 'OG Kush Live Resin Sugar 1g',
    category: 'concentrate',
    stage: 'ideation',
    description:
      'Single-source live resin sugar extracted from fresh-frozen OG Kush. Preserves full terpene profile with a granular, easy-to-dose consistency. Glass jar packaging.',
    targetLaunch: '2026-07-01',
    assignee: 'James Park',
    strainName: 'OG Kush',
  },
  {
    id: 'prod-007',
    name: 'Gelato Premium Flower — Ounce',
    category: 'flower',
    stage: 'launched',
    description:
      'Indoor-grown Gelato flower in a premium 28g jar. Hand-trimmed, slow-cured for 14 days. Rich dessert terpene profile with balanced hybrid effects.',
    targetLaunch: '2026-02-15',
    assignee: 'Dana Whitfield',
    estimatedMargin: 45,
    strainName: 'Gelato',
    targetAccounts: ['Green Leaf Dispensary', 'Elevation Wellness', 'Cloud Nine Cannabis'],
  },
  {
    id: 'prod-008',
    name: 'Zkittlez Infused Blunt 2g',
    category: 'preroll',
    stage: 'formulation',
    description:
      'Hemp-wrapped 2g blunt infused with Zkittlez live resin. Slow-burning wrap with a candy-sweet terpene profile. Individually sealed in a doob tube.',
    targetLaunch: '2026-05-15',
    assignee: 'Marcus Johnson',
    estimatedMargin: 52,
    strainName: 'Zkittlez',
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProductConcepts(filters?: ProductFilter): Promise<ProductConcept[]> {
  await delay(400);
  let results = [...PRODUCT_CONCEPTS];

  if (filters?.stage) {
    results = results.filter((p) => p.stage === filters.stage);
  }
  if (filters?.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters?.search) {
    const term = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.assignee.toLowerCase().includes(term)
    );
  }

  return results;
}

export async function getRDMetrics(): Promise<RDMetrics> {
  await delay(300);
  return {
    conceptsInPipeline: PRODUCT_CONCEPTS.filter((p) => p.stage !== 'launched').length,
    avgTimeToLaunch: '14 weeks',
    launchesThisQuarter: PRODUCT_CONCEPTS.filter((p) => p.stage === 'launched').length,
    successRate: 78,
  };
}
