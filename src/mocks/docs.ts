import type { Document, DocFilter } from '@/modules/docs/types';

const DOCUMENTS: Document[] = [
  // SOPs (5)
  {
    id: 'doc-001',
    name: 'Cultivation Standard Operating Procedure',
    type: 'sop',
    category: 'Operations',
    uploadedBy: 'Dana Whitfield',
    uploadedAt: '2026-03-01',
    size: 2_450_000,
    tags: ['cultivation', 'grow-room', 'procedures'],
    linkedModule: 'Cultivation',
    version: 3,
    description: 'Comprehensive guide covering all cultivation procedures from seed to harvest, including environmental controls, nutrient schedules, and pest management protocols.',
  },
  {
    id: 'doc-002',
    name: 'Extraction Lab Safety Protocol',
    type: 'sop',
    category: 'Operations',
    uploadedBy: 'Jake Morrison',
    uploadedAt: '2026-02-25',
    size: 1_800_000,
    tags: ['extraction', 'safety', 'lab', 'BHO', 'solventless'],
    linkedModule: 'Manufacturing',
    version: 2,
    description: 'Safety protocols for hydrocarbon and solventless extraction operations, including PPE requirements, emergency procedures, and equipment maintenance schedules.',
  },
  {
    id: 'doc-003',
    name: 'Packaging Room Workflow',
    type: 'sop',
    category: 'Operations',
    uploadedBy: 'Maria Chen',
    uploadedAt: '2026-02-18',
    size: 950_000,
    tags: ['packaging', 'workflow', 'compliance', 'labeling'],
    linkedModule: 'Packaging',
    version: 1,
    description: 'Step-by-step packaging workflow for all product categories, including label verification, weight checks, and child-resistant packaging requirements.',
  },
  {
    id: 'doc-004',
    name: 'Fulfillment Pick-Pack Guide',
    type: 'sop',
    category: 'Operations',
    uploadedBy: 'Dana Whitfield',
    uploadedAt: '2026-03-03',
    size: 1_200_000,
    tags: ['fulfillment', 'pick-pack', 'orders', 'warehouse'],
    linkedModule: 'Fulfillment',
    version: 2,
    description: 'Fulfillment team guide for order picking, packing, and staging. Covers priority queues, substitution policies, and quality verification steps.',
  },
  {
    id: 'doc-005',
    name: 'Delivery Driver Handbook',
    type: 'sop',
    category: 'Operations',
    uploadedBy: 'Carlos Reyes',
    uploadedAt: '2026-02-10',
    size: 3_100_000,
    tags: ['delivery', 'drivers', 'routes', 'compliance', 'chain-of-custody'],
    linkedModule: 'Delivery',
    version: 3,
    description: 'Complete driver handbook covering route protocols, chain-of-custody procedures, customer verification, and incident reporting.',
  },

  // Compliance (4)
  {
    id: 'doc-006',
    name: 'WSLCB License Renewal 2026',
    type: 'compliance',
    category: 'Legal',
    uploadedBy: 'Priya Patel',
    uploadedAt: '2026-02-28',
    size: 4_500_000,
    tags: ['license', 'WSLCB', 'renewal', 'state-compliance'],
    version: 1,
    description: 'Complete license renewal package for the Washington State Liquor and Cannabis Board. Includes updated facility diagrams, security plans, and ownership disclosures.',
  },
  {
    id: 'doc-007',
    name: 'CCRS Reporting Guide',
    type: 'compliance',
    category: 'Legal',
    uploadedBy: 'Priya Patel',
    uploadedAt: '2026-02-20',
    size: 780_000,
    tags: ['CCRS', 'traceability', 'reporting', 'state-compliance'],
    version: 2,
    description: 'Internal guide for Cannabis Central Reporting System (CCRS) compliance. Covers daily reporting requirements, error resolution, and audit preparation.',
  },
  {
    id: 'doc-008',
    name: 'Payment Compliance Policy',
    type: 'compliance',
    category: 'Legal',
    uploadedBy: 'Dana Whitfield',
    uploadedAt: '2026-03-02',
    size: 520_000,
    tags: ['payments', 'compliance', 'cash-handling', 'banking'],
    linkedModule: 'Finance',
    version: 1,
    description: 'Payment processing and cash handling compliance policy. Covers banking relationships, cash management procedures, and anti-money laundering protocols.',
  },
  {
    id: 'doc-009',
    name: 'Product Labeling Requirements',
    type: 'compliance',
    category: 'Legal',
    uploadedBy: 'Maria Chen',
    uploadedAt: '2026-02-15',
    size: 1_350_000,
    tags: ['labeling', 'packaging', 'compliance', 'regulations'],
    linkedModule: 'Packaging',
    version: 2,
    description: 'Comprehensive product labeling requirements per Washington State regulations. Includes template designs, required fields, and symbol specifications.',
  },

  // Contracts (3)
  {
    id: 'doc-010',
    name: 'Greenfield Dispensary Supply Agreement',
    type: 'contract',
    category: 'Legal',
    uploadedBy: 'Jake Morrison',
    uploadedAt: '2026-02-22',
    size: 2_800_000,
    tags: ['contract', 'supply', 'dispensary', 'wholesale'],
    linkedModule: 'CRM',
    version: 1,
    description: 'Master supply agreement with Greenfield Dispensary for recurring wholesale flower and concentrate orders. Includes pricing tiers and volume commitments.',
  },
  {
    id: 'doc-011',
    name: 'Headset.io Data License',
    type: 'contract',
    category: 'Legal',
    uploadedBy: 'Priya Patel',
    uploadedAt: '2026-02-12',
    size: 680_000,
    tags: ['contract', 'data', 'analytics', 'market-intelligence'],
    linkedModule: 'Competitors',
    version: 1,
    description: 'Annual data licensing agreement with Headset.io for market intelligence and competitive analytics across Washington State cannabis markets.',
  },
  {
    id: 'doc-012',
    name: 'Growlink IoT Service Contract',
    type: 'contract',
    category: 'Legal',
    uploadedBy: 'Carlos Reyes',
    uploadedAt: '2026-03-04',
    size: 1_100_000,
    tags: ['contract', 'IoT', 'sensors', 'environmental-controls'],
    linkedModule: 'Cultivation',
    version: 2,
    description: 'Service contract for Growlink environmental monitoring system. Covers sensor hardware, cloud platform access, and on-site maintenance.',
  },

  // Product Specs (3)
  {
    id: 'doc-013',
    name: 'Frost Premium Flower Specs',
    type: 'product-spec',
    category: 'Product',
    uploadedBy: 'Jake Morrison',
    uploadedAt: '2026-02-27',
    size: 1_600_000,
    tags: ['flower', 'specs', 'quality', 'grading'],
    linkedModule: 'Products',
    version: 3,
    description: 'Quality specifications for Frost Premium flower line. Includes trichome density requirements, moisture targets, terpene profiles, and visual grading criteria.',
  },
  {
    id: 'doc-014',
    name: 'Solventless Concentrate Standards',
    type: 'product-spec',
    category: 'Product',
    uploadedBy: 'Maria Chen',
    uploadedAt: '2026-02-19',
    size: 890_000,
    tags: ['concentrate', 'solventless', 'rosin', 'quality'],
    linkedModule: 'Manufacturing',
    version: 2,
    description: 'Manufacturing standards for solventless concentrate products including live rosin, hash rosin, and bubble hash. Covers input material specs and final product criteria.',
  },
  {
    id: 'doc-015',
    name: 'Beverage Formulation Guide',
    type: 'product-spec',
    category: 'Product',
    uploadedBy: 'Dana Whitfield',
    uploadedAt: '2026-03-05',
    size: 2_100_000,
    tags: ['beverage', 'formulation', 'nano-emulsion', 'dosing'],
    linkedModule: 'Manufacturing',
    version: 1,
    description: 'Formulation guide for Frost cannabis-infused beverages. Covers nano-emulsion technology, flavor profiles, dosing accuracy, and shelf stability testing.',
  },

  // Marketing (2)
  {
    id: 'doc-016',
    name: 'Brand Style Guide',
    type: 'marketing',
    category: 'Marketing',
    uploadedBy: 'Carlos Reyes',
    uploadedAt: '2026-02-14',
    size: 5_200_000,
    tags: ['brand', 'style-guide', 'logo', 'typography', 'colors'],
    linkedModule: 'Content',
    version: 2,
    description: 'Official Frost brand style guide. Includes logo usage rules, color palettes, typography, photography direction, and tone of voice guidelines.',
  },
  {
    id: 'doc-017',
    name: 'Product Photography Standards',
    type: 'marketing',
    category: 'Marketing',
    uploadedBy: 'Maria Chen',
    uploadedAt: '2026-02-08',
    size: 3_400_000,
    tags: ['photography', 'product-shots', 'content', 'e-commerce'],
    linkedModule: 'Content',
    version: 1,
    description: 'Standards for product photography across all categories. Covers lighting setup, background specs, angle requirements, and post-processing guidelines.',
  },

  // Other (3)
  {
    id: 'doc-018',
    name: 'Employee Handbook',
    type: 'other',
    category: 'HR',
    uploadedBy: 'Priya Patel',
    uploadedAt: '2026-02-05',
    size: 4_800_000,
    tags: ['HR', 'policies', 'onboarding', 'benefits'],
    linkedModule: 'Team',
    version: 3,
    description: 'Complete employee handbook covering company policies, benefits, code of conduct, safety procedures, and cannabis-specific workplace regulations.',
  },
  {
    id: 'doc-019',
    name: 'Insurance Policy Summary',
    type: 'other',
    category: 'HR',
    uploadedBy: 'Dana Whitfield',
    uploadedAt: '2026-02-17',
    size: 320_000,
    tags: ['insurance', 'liability', 'coverage', 'risk'],
    linkedModule: 'Finance',
    version: 1,
    description: 'Summary of all active insurance policies including general liability, product liability, crop insurance, and workers compensation coverage details.',
  },
  {
    id: 'doc-020',
    name: 'Equipment Maintenance Log',
    type: 'other',
    category: 'Operations',
    uploadedBy: 'Jake Morrison',
    uploadedAt: '2026-03-06',
    size: 150_000,
    tags: ['equipment', 'maintenance', 'preventive', 'schedule'],
    linkedModule: 'Manufacturing',
    version: 1,
    description: 'Rolling maintenance log for all production equipment. Tracks service dates, replacement parts, calibration records, and upcoming maintenance schedules.',
  },
];

export async function getDocuments(filters?: DocFilter): Promise<Document[]> {
  await new Promise((r) => setTimeout(r, 300));

  let results = [...DOCUMENTS];

  if (filters?.type) {
    results = results.filter((d) => d.type === filters.type);
  }

  if (filters?.category) {
    results = results.filter((d) => d.category === filters.category);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q))
    );
  }

  return results;
}
