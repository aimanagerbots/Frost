import type { PortalInvoice } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────

const ACCT_1 = 'acct-1'; // Greenfield
const ACCT_2 = 'acct-2'; // Pacific Leaf
const ACCT_3 = 'acct-3'; // Cascade Wellness

// ══════════════════════════════════════════════════════════════════════
// GREENFIELD — 8 invoices, all paid
// ══════════════════════════════════════════════════════════════════════

const greenfieldInvoices: PortalInvoice[] = [
  {
    id: 'inv-gf-08',
    invoiceNumber: 'INV-2026-0108',
    orderId: 'order-gf-42',
    orderNumber: 'ORD-2026-0842',
    issueDate: '2026-03-03',
    dueDate: '2026-03-17',
    deliveryDate: '2026-03-03',
    amount: 4536.00,
    status: 'paid',
    paidDate: '2026-03-10',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-gf-07',
    invoiceNumber: 'INV-2026-0107',
    orderId: 'order-gf-41',
    orderNumber: 'ORD-2026-0841',
    issueDate: '2026-02-24',
    dueDate: '2026-03-10',
    deliveryDate: '2026-02-26',
    amount: 2899.20,
    status: 'paid',
    paidDate: '2026-03-05',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-gf-06',
    invoiceNumber: 'INV-2026-0106',
    orderId: 'order-gf-40',
    orderNumber: 'ORD-2026-0840',
    issueDate: '2026-02-17',
    dueDate: '2026-03-03',
    deliveryDate: '2026-02-17',
    amount: 3168.00,
    status: 'paid',
    paidDate: '2026-02-28',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-gf-05',
    invoiceNumber: 'INV-2026-0105',
    orderId: 'order-gf-39',
    orderNumber: 'ORD-2026-0839',
    issueDate: '2026-02-10',
    dueDate: '2026-02-24',
    deliveryDate: '2026-02-10',
    amount: 2678.40,
    status: 'paid',
    paidDate: '2026-02-20',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-gf-04',
    invoiceNumber: 'INV-2026-0104',
    orderId: 'order-gf-38',
    orderNumber: 'ORD-2026-0838',
    issueDate: '2026-02-03',
    dueDate: '2026-02-17',
    deliveryDate: '2026-02-03',
    amount: 3067.20,
    status: 'paid',
    paidDate: '2026-02-14',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-gf-03',
    invoiceNumber: 'INV-2026-0103',
    orderId: 'order-gf-37',
    orderNumber: 'ORD-2026-0837',
    issueDate: '2026-01-27',
    dueDate: '2026-02-10',
    deliveryDate: '2026-01-27',
    amount: 1843.20,
    status: 'paid',
    paidDate: '2026-02-06',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-gf-02',
    invoiceNumber: 'INV-2026-0102',
    orderId: 'order-gf-36',
    orderNumber: 'ORD-2026-0836',
    issueDate: '2026-01-20',
    dueDate: '2026-02-03',
    deliveryDate: '2026-01-20',
    amount: 1963.20,
    status: 'paid',
    paidDate: '2026-01-30',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-gf-01',
    invoiceNumber: 'INV-2026-0101',
    orderId: 'order-gf-35',
    orderNumber: 'ORD-2026-0835',
    issueDate: '2026-01-13',
    dueDate: '2026-01-27',
    deliveryDate: '2026-01-13',
    amount: 1425.60,
    status: 'paid',
    paidDate: '2026-01-24',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
];

// ══════════════════════════════════════════════════════════════════════
// PACIFIC LEAF — 5 invoices: 3 paid, 2 overdue
// ══════════════════════════════════════════════════════════════════════

const pacificLeafInvoices: PortalInvoice[] = [
  {
    id: 'inv-pl-05',
    invoiceNumber: 'INV-2026-0115',
    orderId: 'order-pl-21',
    orderNumber: 'ORD-2026-0866',
    issueDate: '2026-02-22',
    dueDate: '2026-02-27',
    deliveryDate: '2026-02-22',
    amount: 2350.00,
    status: 'overdue',
    daysElapsed: 9,
    complianceStatus: 'overdue',
  },
  {
    id: 'inv-pl-04',
    invoiceNumber: 'INV-2026-0114',
    orderId: 'order-pl-20',
    orderNumber: 'ORD-2026-0865',
    issueDate: '2026-02-14',
    dueDate: '2026-03-01',
    deliveryDate: '2026-02-14',
    amount: 1850.00,
    status: 'overdue',
    daysElapsed: 7,
    complianceStatus: 'overdue',
  },
  {
    id: 'inv-pl-03',
    invoiceNumber: 'INV-2026-0113',
    orderId: 'order-pl-19',
    orderNumber: 'ORD-2026-0864',
    issueDate: '2026-02-07',
    dueDate: '2026-02-21',
    deliveryDate: '2026-02-07',
    amount: 1156.80,
    status: 'paid',
    paidDate: '2026-02-18',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-pl-02',
    invoiceNumber: 'INV-2026-0112',
    orderId: 'order-pl-18',
    orderNumber: 'ORD-2026-0863',
    issueDate: '2026-01-31',
    dueDate: '2026-02-14',
    deliveryDate: '2026-01-31',
    amount: 417.60,
    status: 'paid',
    paidDate: '2026-02-10',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-pl-01',
    invoiceNumber: 'INV-2026-0111',
    orderId: 'order-pl-17',
    orderNumber: 'ORD-2026-0862',
    issueDate: '2026-01-24',
    dueDate: '2026-02-07',
    deliveryDate: '2026-01-24',
    amount: 884.16,
    status: 'paid',
    paidDate: '2026-02-04',
    paymentMethod: 'ach',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
];

// ══════════════════════════════════════════════════════════════════════
// CASCADE WELLNESS — 2 invoices: 1 paid, 1 outstanding
// ══════════════════════════════════════════════════════════════════════

const cascadeInvoices: PortalInvoice[] = [
  {
    id: 'inv-cw-02',
    invoiceNumber: 'INV-2026-0122',
    orderId: 'order-cw-03',
    orderNumber: 'ORD-2026-0870',
    issueDate: '2026-03-05',
    dueDate: '2026-03-19',
    deliveryDate: '2026-02-25',
    amount: 316.80,
    status: 'outstanding',
    daysElapsed: 3,
    complianceStatus: 'compliant',
  },
  {
    id: 'inv-cw-01',
    invoiceNumber: 'INV-2026-0121',
    orderId: 'order-cw-02',
    orderNumber: 'ORD-2026-0869',
    issueDate: '2026-02-10',
    dueDate: '2026-02-24',
    deliveryDate: '2026-02-09',
    amount: 187.20,
    status: 'paid',
    paidDate: '2026-02-20',
    paymentMethod: 'echeck',
    daysElapsed: 0,
    complianceStatus: 'compliant',
  },
];

// ══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════

const invoicesByAccount: Record<string, PortalInvoice[]> = {
  [ACCT_1]: greenfieldInvoices,
  [ACCT_2]: pacificLeafInvoices,
  [ACCT_3]: cascadeInvoices,
};

export function getInvoicesForAccount(accountId: string): PortalInvoice[] {
  return invoicesByAccount[accountId] ?? [];
}
