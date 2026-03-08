import type {
  COASubmission,
  COAMetrics,
  COAStatus,
} from '@/modules/coa/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// — COA Submissions —

const submissions: COASubmission[] = [
  // PASSED (8)
  {
    id: 'coa-001',
    batchNumber: 'FL-2024-081',
    productName: 'Wedding Cake',
    category: 'flower',
    strainName: 'Wedding Cake',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-01',
    expectedReturn: '2024-12-06',
    status: 'passed',
    documentUrl: '/docs/coa/FL-2024-081.pdf',
    results: {
      thcPercent: 28.5,
      cbdPercent: 0.1,
      totalCannabinoids: 31.2,
      terpeneProfile: [
        { name: 'Myrcene', percent: 1.2 },
        { name: 'Limonene', percent: 0.8 },
        { name: 'Caryophyllene', percent: 0.6 },
        { name: 'Linalool', percent: 0.3 },
        { name: 'Pinene', percent: 0.2 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 8.2,
      overallStatus: 'pass',
    },
  },
  {
    id: 'coa-002',
    batchNumber: 'FL-2024-082',
    productName: 'Blue Dream',
    category: 'flower',
    strainName: 'Blue Dream',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-02',
    expectedReturn: '2024-12-07',
    status: 'passed',
    documentUrl: '/docs/coa/FL-2024-082.pdf',
    results: {
      thcPercent: 21.3,
      cbdPercent: 0.3,
      totalCannabinoids: 24.1,
      terpeneProfile: [
        { name: 'Myrcene', percent: 0.9 },
        { name: 'Pinene', percent: 0.7 },
        { name: 'Terpinolene', percent: 0.4 },
        { name: 'Caryophyllene', percent: 0.3 },
        { name: 'Ocimene', percent: 0.2 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 9.1,
      overallStatus: 'pass',
    },
  },
  {
    id: 'coa-003',
    batchNumber: 'CN-2024-031',
    productName: 'Gelato Live Resin',
    category: 'concentrate',
    strainName: 'Gelato',
    labName: 'Steep Hill',
    submittedDate: '2024-12-01',
    expectedReturn: '2024-12-08',
    status: 'passed',
    documentUrl: '/docs/coa/CN-2024-031.pdf',
    results: {
      thcPercent: 78.4,
      cbdPercent: 0.2,
      totalCannabinoids: 82.6,
      terpeneProfile: [
        { name: 'Limonene', percent: 4.2 },
        { name: 'Caryophyllene', percent: 3.1 },
        { name: 'Myrcene', percent: 2.8 },
        { name: 'Linalool', percent: 1.5 },
        { name: 'Humulene', percent: 0.9 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 1.4,
      overallStatus: 'pass',
    },
  },
  {
    id: 'coa-004',
    batchNumber: 'FL-2024-083',
    productName: 'Gorilla Glue #4',
    category: 'flower',
    strainName: 'Gorilla Glue #4',
    labName: 'Green Leaf Labs',
    submittedDate: '2024-12-03',
    expectedReturn: '2024-12-07',
    status: 'passed',
    documentUrl: '/docs/coa/FL-2024-083.pdf',
    results: {
      thcPercent: 25.7,
      cbdPercent: 0.1,
      totalCannabinoids: 28.4,
      terpeneProfile: [
        { name: 'Caryophyllene', percent: 1.4 },
        { name: 'Myrcene', percent: 1.1 },
        { name: 'Limonene', percent: 0.7 },
        { name: 'Humulene', percent: 0.5 },
        { name: 'Pinene', percent: 0.3 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 7.8,
      overallStatus: 'pass',
    },
  },
  {
    id: 'coa-005',
    batchNumber: 'PR-2024-054',
    productName: 'OG Kush 6-Pack Prerolls',
    category: 'preroll',
    strainName: 'OG Kush',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-04',
    expectedReturn: '2024-12-09',
    status: 'passed',
    documentUrl: '/docs/coa/PR-2024-054.pdf',
    results: {
      thcPercent: 22.1,
      cbdPercent: 0.2,
      totalCannabinoids: 24.8,
      terpeneProfile: [
        { name: 'Myrcene', percent: 1.0 },
        { name: 'Limonene', percent: 0.9 },
        { name: 'Caryophyllene', percent: 0.5 },
        { name: 'Linalool', percent: 0.4 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 10.2,
      overallStatus: 'pass',
    },
  },
  {
    id: 'coa-006',
    batchNumber: 'VP-2024-022',
    productName: 'Blue Dream CDT Cart 1g',
    category: 'vaporizer',
    strainName: 'Blue Dream',
    labName: 'Steep Hill',
    submittedDate: '2024-12-03',
    expectedReturn: '2024-12-10',
    status: 'passed',
    documentUrl: '/docs/coa/VP-2024-022.pdf',
    results: {
      thcPercent: 85.2,
      cbdPercent: 0.4,
      totalCannabinoids: 88.9,
      terpeneProfile: [
        { name: 'Myrcene', percent: 3.5 },
        { name: 'Pinene', percent: 2.1 },
        { name: 'Terpinolene', percent: 1.8 },
        { name: 'Ocimene', percent: 0.7 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 0.3,
      overallStatus: 'pass',
    },
  },
  {
    id: 'coa-007',
    batchNumber: 'ED-2024-019',
    productName: 'Sour Gummy Bears 10pk',
    category: 'edible',
    strainName: 'Hybrid Blend',
    labName: 'Green Leaf Labs',
    submittedDate: '2024-12-05',
    expectedReturn: '2024-12-09',
    status: 'passed',
    documentUrl: '/docs/coa/ED-2024-019.pdf',
    results: {
      thcPercent: 10.0,
      cbdPercent: 0.5,
      totalCannabinoids: 11.2,
      terpeneProfile: [
        { name: 'Myrcene', percent: 0.2 },
        { name: 'Limonene', percent: 0.1 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 12.5,
      overallStatus: 'pass',
    },
  },
  {
    id: 'coa-008',
    batchNumber: 'FL-2024-084',
    productName: 'Purple Punch',
    category: 'flower',
    strainName: 'Purple Punch',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-05',
    expectedReturn: '2024-12-10',
    status: 'passed',
    documentUrl: '/docs/coa/FL-2024-084.pdf',
    results: {
      thcPercent: 19.8,
      cbdPercent: 0.1,
      totalCannabinoids: 22.3,
      terpeneProfile: [
        { name: 'Limonene', percent: 0.8 },
        { name: 'Caryophyllene', percent: 0.6 },
        { name: 'Myrcene', percent: 0.5 },
        { name: 'Linalool', percent: 0.4 },
        { name: 'Pinene', percent: 0.2 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 8.9,
      overallStatus: 'pass',
    },
  },

  // FAILED (2)
  {
    id: 'coa-009',
    batchNumber: 'FL-2024-087',
    productName: 'Girl Scout Cookies Quarter',
    category: 'flower',
    strainName: 'Girl Scout Cookies',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-06',
    expectedReturn: '2024-12-11',
    status: 'failed',
    remediationNotes: 'Aspergillus detected at 1,200 CFU/g (limit: 1,000 CFU/g). Recommended: remediation via additional drying and retest.',
    results: {
      thcPercent: 24.3,
      cbdPercent: 0.2,
      totalCannabinoids: 27.1,
      terpeneProfile: [
        { name: 'Caryophyllene', percent: 1.1 },
        { name: 'Limonene', percent: 0.9 },
        { name: 'Myrcene', percent: 0.7 },
        { name: 'Humulene', percent: 0.4 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'fail', value: 'Aspergillus: 1,200 CFU/g (limit: 1,000)' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 13.8,
      overallStatus: 'fail',
    },
  },
  {
    id: 'coa-010',
    batchNumber: 'CN-2024-035',
    productName: 'Sour Diesel Shatter',
    category: 'concentrate',
    strainName: 'Sour Diesel',
    labName: 'Steep Hill',
    submittedDate: '2024-12-07',
    expectedReturn: '2024-12-14',
    status: 'failed',
    remediationNotes: 'Trace pesticide (Myclobutanil) detected at 0.15 ppm (limit: 0.10 ppm). Batch quarantined. Recommended: full solvent remediation and retest.',
    results: {
      thcPercent: 72.1,
      cbdPercent: 0.3,
      totalCannabinoids: 76.8,
      terpeneProfile: [
        { name: 'Myrcene', percent: 2.4 },
        { name: 'Limonene', percent: 1.9 },
        { name: 'Caryophyllene', percent: 1.2 },
        { name: 'Pinene', percent: 0.8 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'fail', value: 'Myclobutanil: 0.15 ppm (limit: 0.10)' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 0.8,
      overallStatus: 'fail',
    },
  },

  // REMEDIATION (1)
  {
    id: 'coa-011',
    batchNumber: 'FL-2024-079',
    productName: 'OG Kush',
    category: 'flower',
    strainName: 'OG Kush',
    labName: 'Confidence Analytics',
    submittedDate: '2024-11-28',
    expectedReturn: '2024-12-03',
    status: 'remediation',
    remediationNotes: 'Original test failed for moisture content (14.2%, limit 13%). Batch sent for additional drying. Retest submitted 12/10.',
    results: {
      thcPercent: 23.1,
      cbdPercent: 0.2,
      totalCannabinoids: 25.9,
      terpeneProfile: [
        { name: 'Myrcene', percent: 1.0 },
        { name: 'Limonene', percent: 0.9 },
        { name: 'Caryophyllene', percent: 0.5 },
      ],
      contaminants: [
        { type: 'Pesticides', result: 'pass' },
        { type: 'Heavy Metals', result: 'pass' },
        { type: 'Microbial', result: 'pass' },
        { type: 'Residual Solvents', result: 'pass' },
      ],
      moistureContent: 14.2,
      overallStatus: 'fail',
    },
  },

  // IN-TESTING (4)
  {
    id: 'coa-012',
    batchNumber: 'FL-2024-090',
    productName: 'Sour Diesel',
    category: 'flower',
    strainName: 'Sour Diesel',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-10',
    expectedReturn: '2024-12-15',
    status: 'in-testing',
  },
  {
    id: 'coa-013',
    batchNumber: 'CN-2024-038',
    productName: 'Wedding Cake Budder',
    category: 'concentrate',
    strainName: 'Wedding Cake',
    labName: 'Steep Hill',
    submittedDate: '2024-12-09',
    expectedReturn: '2024-12-16',
    status: 'in-testing',
  },
  {
    id: 'coa-014',
    batchNumber: 'PR-2024-058',
    productName: 'Gorilla Glue 3-Pack Prerolls',
    category: 'preroll',
    strainName: 'Gorilla Glue #4',
    labName: 'Green Leaf Labs',
    submittedDate: '2024-12-11',
    expectedReturn: '2024-12-15',
    status: 'in-testing',
  },
  {
    id: 'coa-015',
    batchNumber: 'VP-2024-025',
    productName: 'OG Kush Distillate 0.5g',
    category: 'vaporizer',
    strainName: 'OG Kush',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-10',
    expectedReturn: '2024-12-15',
    status: 'in-testing',
  },

  // SUBMITTED (5)
  {
    id: 'coa-016',
    batchNumber: 'FL-2024-092',
    productName: 'Jack Herer',
    category: 'flower',
    strainName: 'Jack Herer',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-13',
    expectedReturn: '2024-12-18',
    status: 'submitted',
  },
  {
    id: 'coa-017',
    batchNumber: 'CN-2024-040',
    productName: 'Blue Dream Wax',
    category: 'concentrate',
    strainName: 'Blue Dream',
    labName: 'Steep Hill',
    submittedDate: '2024-12-13',
    expectedReturn: '2024-12-20',
    status: 'submitted',
  },
  {
    id: 'coa-018',
    batchNumber: 'ED-2024-022',
    productName: 'Dark Chocolate Bar 100mg',
    category: 'edible',
    strainName: 'Indica Blend',
    labName: 'Green Leaf Labs',
    submittedDate: '2024-12-14',
    expectedReturn: '2024-12-18',
    status: 'submitted',
  },
  {
    id: 'coa-019',
    batchNumber: 'BV-2024-008',
    productName: 'Lemonade Seltzer 4-Pack',
    category: 'beverage',
    strainName: 'Sativa Blend',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-14',
    expectedReturn: '2024-12-19',
    status: 'submitted',
  },
  {
    id: 'coa-020',
    batchNumber: 'FL-2024-093',
    productName: 'Gelato',
    category: 'flower',
    strainName: 'Gelato',
    labName: 'Confidence Analytics',
    submittedDate: '2024-12-15',
    expectedReturn: '2024-12-20',
    status: 'submitted',
  },
];

const metrics: COAMetrics = {
  totalSubmissions: 20,
  pendingResults: 9,
  passRate: 88,
  avgTurnaround: 5.2,
  failedThisMonth: 2,
};

// — Export functions —

export async function getCOASubmissions(filters?: {
  status?: COAStatus;
  search?: string;
}): Promise<COASubmission[]> {
  await delay(400);
  let result = [...submissions];
  if (filters?.status) {
    result = result.filter((s) => s.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.batchNumber.toLowerCase().includes(q) ||
        s.productName.toLowerCase().includes(q) ||
        s.strainName.toLowerCase().includes(q) ||
        s.labName.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getCOASubmission(id: string): Promise<COASubmission | undefined> {
  await delay(300);
  return submissions.find((s) => s.id === id);
}

export async function getCOAMetrics(): Promise<COAMetrics> {
  await delay(300);
  return metrics;
}
