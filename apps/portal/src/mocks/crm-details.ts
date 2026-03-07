import type {
  Account,
  AccountOrder,
  AccountHealthData,
  AccountVMIData,
  AccountPaymentSummary,
  AccountPayment,
  AccountDeliverySummary,
  AccountDelivery,
  AccountFile,
  AccountNote,
  HealthFactor,
  HealthRecommendation,
} from '@/modules/crm/types';
import { accounts } from './crm';

// --- Deterministic seed from account ID ---

function seed(id: string): () => number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(31, h) + id.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return (h % 10000) / 10000;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function dateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DRIVERS = ['Marcus Webb', 'Diego Fuentes', 'Kenji Tanaka', 'Alisha Pham', 'Troy Bennett'];

// --- Orders ---

function generateOrders(account: Account): AccountOrder[] {
  const rng = seed(account.id + '-orders');
  const count = Math.min(20, Math.max(8, Math.round(account.orderCount * 0.15)));
  const orders: AccountOrder[] = [];
  const activeCats = account.categoryMix.filter((c) => c.percentage > 0).map((c) => c.category);
  const statuses: AccountOrder['status'][] = ['delivered', 'delivered', 'delivered', 'delivered', 'in-transit', 'processing'];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rng() * 360);
    const catCount = Math.max(1, Math.min(activeCats.length, Math.floor(rng() * activeCats.length) + 1));
    const cats: string[] = [];
    for (let j = 0; j < catCount; j++) {
      const c = pick(rng, activeCats);
      if (!cats.includes(c)) cats.push(c);
    }
    // Weight total by category mix
    let total = 0;
    for (const cat of cats) {
      const mix = account.categoryMix.find((m) => m.category === cat);
      const weight = mix ? mix.percentage / 100 : 0.1;
      total += account.avgOrderValue * weight * (0.7 + rng() * 0.6);
    }
    total = Math.round(total / 10) * 10;

    orders.push({
      id: `ord-${account.id}-${i}`,
      date: dateOffset(daysAgo),
      orderNumber: `#${1100 + Math.floor(rng() * 200)}`,
      skuCount: Math.floor(rng() * 18) + 4,
      categories: cats,
      total,
      status: i < 2 ? pick(rng, ['in-transit', 'processing'] as const) : pick(rng, statuses),
    });
  }

  return orders.sort((a, b) => b.date.localeCompare(a.date));
}

// --- Health ---

function generateHealthData(account: Account): AccountHealthData {
  const rng = seed(account.id + '-health');

  const payScore = { excellent: 95, good: 78, fair: 55, poor: 30 }[account.paymentReliability];
  const activeCats = account.categoryMix.filter((c) => c.percentage > 0).length;
  const catDiversity = Math.min(100, activeCats * 18);
  const orderFreq = Math.min(100, Math.round(account.orderCount / 1.5));
  const revTrend = account.healthTrend === 'improving' ? 82 : account.healthTrend === 'stable' ? 65 : 38;
  const commEngagement = Math.min(100, 50 + Math.floor(rng() * 40));
  const competitiveExposure = account.status === 'churning' ? 25 : account.status === 'at-risk' ? 45 : 75 + Math.floor(rng() * 20);

  const factors: HealthFactor[] = [
    { label: 'Order Frequency', score: orderFreq, impact: orderFreq > 60 ? 'positive' : orderFreq > 40 ? 'neutral' : 'negative', weight: 25 },
    { label: 'Revenue Trend', score: revTrend, impact: account.healthTrend === 'improving' ? 'positive' : account.healthTrend === 'stable' ? 'neutral' : 'negative', weight: 20 },
    { label: 'Payment Reliability', score: payScore, impact: payScore > 70 ? 'positive' : payScore > 50 ? 'neutral' : 'negative', weight: 20 },
    { label: 'Communication Engagement', score: commEngagement, impact: commEngagement > 60 ? 'positive' : 'neutral', weight: 15 },
    { label: 'Category Diversity', score: catDiversity, impact: catDiversity > 50 ? 'positive' : 'neutral', weight: 10 },
    { label: 'Competitive Exposure', score: competitiveExposure, impact: competitiveExposure > 60 ? 'positive' : 'negative', weight: 10 },
  ];

  const recommendations: HealthRecommendation[] = [];
  if (account.status === 'churning' || account.status === 'at-risk') {
    recommendations.push({ title: 'Schedule Win-Back Meeting', description: `This account\'s health has declined. Schedule a face-to-face meeting to understand pain points and present updated pricing.`, priority: 'high' });
  }
  if (payScore < 60) {
    recommendations.push({ title: 'Address Payment Issues', description: 'Payment reliability is below threshold. Consider adjusting payment terms or requiring prepayment for next order.', priority: 'high' });
  }
  if (activeCats < 3) {
    recommendations.push({ title: 'Propose Category Expansion', description: `This account only purchases ${activeCats} categor${activeCats === 1 ? 'y' : 'ies'}. Send product catalog for complementary categories to increase basket size.`, priority: 'medium' });
  }
  if (account.vmiEnrolled) {
    recommendations.push({ title: 'Review VMI Thresholds', description: 'Quarterly VMI threshold review is due. Analyze sell-through data and adjust par levels for optimal inventory turns.', priority: 'low' });
  }
  if (recommendations.length === 0) {
    recommendations.push({ title: 'Maintain Momentum', description: 'This account is performing well across all metrics. Continue regular check-ins and share early access to new products.', priority: 'low' });
  }

  const history: { date: string; score: number }[] = [];
  const score = account.healthScore;
  for (let i = 11; i >= 0; i--) {
    const drift = account.healthTrend === 'improving' ? -2.5 : account.healthTrend === 'declining' ? 2.5 : 0;
    const past = Math.max(5, Math.min(98, Math.round(score + drift * (i - 5) + (rng() - 0.5) * 8)));
    history.push({ date: dateOffset(i * 30), score: past });
  }

  return {
    score: account.healthScore,
    trend: account.healthTrend,
    factors,
    recommendations,
    history,
  };
}

// --- VMI ---

function generateVMIData(account: Account): AccountVMIData {
  if (!account.vmiEnrolled) {
    return { enrolled: false, enrolledDate: null, sellThrough: [], inventoryLevels: [], daysOnHand: [], lastReorderDate: null, autoReorderCount: 0 };
  }

  const rng = seed(account.id + '-vmi');
  const sellThrough = Array.from({ length: 12 }, (_, i) => ({
    week: dateOffset((11 - i) * 7),
    units: 40 + Math.floor(rng() * 60),
  }));

  const activeCats = account.categoryMix.filter((c) => c.percentage > 0);
  const inventoryLevels = activeCats.map((c) => {
    const par = 20 + Math.floor(rng() * 40);
    const current = Math.floor(par * (0.3 + rng() * 0.9));
    return { category: c.category, current, par };
  });

  const daysOnHand = activeCats.map((c) => ({
    category: c.category,
    days: Math.floor(rng() * 14) + 1,
  }));

  return {
    enrolled: true,
    enrolledDate: dateOffset(Math.floor(rng() * 180) + 90),
    sellThrough,
    inventoryLevels,
    daysOnHand,
    lastReorderDate: dateOffset(Math.floor(rng() * 14)),
    autoReorderCount: 3 + Math.floor(rng() * 12),
  };
}

// --- Payments ---

function generatePayments(account: Account): AccountPaymentSummary {
  const rng = seed(account.id + '-payments');
  const count = Math.max(6, Math.min(12, Math.round(account.orderCount * 0.12)));
  const payments: AccountPayment[] = [];

  const isRainier = account.id === 'acct-rainier';
  const isEmerald = account.id === 'acct-emerald-city';

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor((i / count) * 300) + Math.floor(rng() * 20);
    const invoiceDate = dateOffset(daysAgo);
    const dueDate = dateOffset(daysAgo - 30);
    const amount = Math.round(account.avgOrderValue * (0.7 + rng() * 0.6) / 10) * 10;

    let status: AccountPayment['status'] = 'paid';
    let paidDate: string | null = dateOffset(daysAgo - 28 - Math.floor(rng() * 5));
    let method: AccountPayment['method'] = account.preferredPaymentMethod;

    // Rainier Remedies: 3 most recent are overdue
    if (isRainier && i < 3) {
      status = 'overdue';
      paidDate = null;
      method = null;
    }
    // Emerald City: 2 most recent are overdue (from before churn)
    if (isEmerald && i < 2) {
      status = 'overdue';
      paidDate = null;
      method = null;
    }
    // Poor/fair reliability: occasional late payments
    if (!isRainier && !isEmerald && account.paymentReliability === 'poor' && rng() < 0.4) {
      status = 'overdue';
      paidDate = null;
      method = null;
    }
    if (!isRainier && !isEmerald && account.paymentReliability === 'fair' && rng() < 0.2) {
      status = 'overdue';
      paidDate = null;
      method = null;
    }

    payments.push({
      id: `pay-${account.id}-${i}`,
      invoiceNumber: `INV-${1100 + Math.floor(rng() * 200)}`,
      date: invoiceDate,
      dueDate,
      amount,
      status,
      paidDate,
      method,
    });
  }

  const overdue = payments.filter((p) => p.status === 'overdue');
  const paid = payments.filter((p) => p.status === 'paid');
  const avgDays = paid.length > 0
    ? Math.round(paid.reduce((sum, p) => {
        const inv = new Date(p.date).getTime();
        const pay = new Date(p.paidDate!).getTime();
        return sum + Math.abs(pay - inv) / 86400000;
      }, 0) / paid.length)
    : 0;

  const reliabilityMap = { excellent: 95, good: 80, fair: 60, poor: 35 };

  return {
    outstanding: overdue.reduce((s, p) => s + p.amount, 0),
    reliability: reliabilityMap[account.paymentReliability],
    avgDaysToPay: avgDays,
    payments: payments.sort((a, b) => b.date.localeCompare(a.date)),
  };
}

// --- Deliveries ---

function generateDeliveries(account: Account): AccountDeliverySummary {
  const rng = seed(account.id + '-deliveries');
  const count = Math.max(8, Math.min(15, Math.round(account.orderCount * 0.12)));
  const deliveries: AccountDelivery[] = [];
  const statusPool: AccountDelivery['status'][] = ['delivered', 'delivered', 'delivered', 'delivered', 'scheduled', 'in-transit'];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor((i / count) * 300) + Math.floor(rng() * 15);
    const status = i < 2 ? pick(rng, ['scheduled', 'in-transit'] as const) : pick(rng, statusPool);
    const delivered = status === 'delivered';
    deliveries.push({
      id: `del-${account.id}-${i}`,
      date: dateOffset(daysAgo),
      orderNumber: `#${1100 + Math.floor(rng() * 200)}`,
      status,
      driver: pick(rng, DRIVERS),
      window: account.deliveryPreferences.window,
      deliveredAt: delivered ? `${8 + Math.floor(rng() * 6)}:${String(Math.floor(rng() * 60)).padStart(2, '0')} AM` : null,
      items: 4 + Math.floor(rng() * 20),
    });
  }

  const deliveredOnes = deliveries.filter((d) => d.status === 'delivered');
  const avgMins = deliveredOnes.length > 0
    ? Math.round(deliveredOnes.reduce((s) => s + 25 + Math.floor(rng() * 60), 0) / deliveredOnes.length)
    : 0;

  return {
    preferredWindow: account.deliveryPreferences.window,
    avgDeliveryMinutes: avgMins,
    onTimeRate: Math.round((85 + rng() * 14) * 10) / 10,
    deliveries: deliveries.sort((a, b) => b.date.localeCompare(a.date)),
  };
}

// --- Files ---

function generateFiles(account: Account): AccountFile[] {
  const rng = seed(account.id + '-files');
  const files: AccountFile[] = [];
  const reps = ['Jake Morrison', 'Priya Patel', 'Carlos Ruiz'];

  // COA files
  const coaCount = 2 + Math.floor(rng() * 2);
  for (let i = 0; i < coaCount; i++) {
    const batch = `B${2025 + Math.floor(rng() * 2)}-${String(Math.floor(rng() * 999)).padStart(3, '0')}`;
    files.push({
      id: `file-${account.id}-coa-${i}`,
      name: `COA_${batch}.pdf`,
      type: 'coa',
      uploadedBy: pick(rng, reps),
      uploadedAt: dateOffset(Math.floor(rng() * 180)),
      size: 120000 + Math.floor(rng() * 400000),
      url: '#',
    });
  }

  // Contract
  files.push({
    id: `file-${account.id}-contract`,
    name: `${account.name.replace(/[^a-zA-Z0-9]/g, '_')}_Contract_2025.pdf`,
    type: 'contract',
    uploadedBy: 'Dana Whitfield',
    uploadedAt: dateOffset(180 + Math.floor(rng() * 180)),
    size: 280000 + Math.floor(rng() * 200000),
    url: '#',
  });

  // Price agreement
  files.push({
    id: `file-${account.id}-price`,
    name: `Price_Agreement_Q1_2026.pdf`,
    type: 'other',
    uploadedBy: pick(rng, reps),
    uploadedAt: dateOffset(30 + Math.floor(rng() * 60)),
    size: 85000 + Math.floor(rng() * 100000),
    url: '#',
  });

  // License copy
  files.push({
    id: `file-${account.id}-license`,
    name: `License_${account.licenseNumber}.pdf`,
    type: 'license',
    uploadedBy: pick(rng, reps),
    uploadedAt: dateOffset(90 + Math.floor(rng() * 270)),
    size: 50000 + Math.floor(rng() * 80000),
    url: '#',
  });

  return files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

// --- Notes ---

const NOTE_TEMPLATES = [
  { content: 'Discussed Q2 promotional calendar. Account interested in co-marketing for flower launches.', author: 'Jake Morrison' },
  { content: 'Delivery driver reported new construction on access route. Updated delivery instructions.', author: 'Carlos Ruiz' },
  { content: 'Owner mentioned potential store renovation in June. May affect order volume temporarily.', author: 'Priya Patel' },
  { content: 'Competitor (Green Valley) running aggressive pricing in this territory. Monitor closely.', author: 'Jake Morrison' },
  { content: 'License renewal submitted. Expecting approval within 30 days.', author: 'Dana Whitfield' },
  { content: 'Account expressed interest in exclusive product launches. Consider for premium program.', author: 'Priya Patel' },
  { content: 'Budtender training session scheduled for next month. Sending product knowledge kits.', author: 'Carlos Ruiz' },
  { content: 'Payment terms reviewed with owner. Agreed to shift from COD to ACH starting next quarter.', author: 'Priya Patel' },
  { content: 'In-store display audit completed. Shelf positioning is strong — second only to local brand.', author: 'Jake Morrison' },
  { content: 'Account referred a new prospect in their network. Follow up with lead.', author: 'Carlos Ruiz' },
];

function generateNotes(account: Account): AccountNote[] {
  const rng = seed(account.id + '-notes');
  const count = 3 + Math.floor(rng() * 4);
  const notes: AccountNote[] = [];

  for (let i = 0; i < count; i++) {
    const tmpl = NOTE_TEMPLATES[Math.floor(rng() * NOTE_TEMPLATES.length)];
    notes.push({
      id: `note-${account.id}-${i}`,
      content: tmpl.content,
      author: tmpl.author,
      createdAt: dateOffset(Math.floor(rng() * 180)) + 'T' + String(8 + Math.floor(rng() * 9)).padStart(2, '0') + ':' + String(Math.floor(rng() * 60)).padStart(2, '0') + ':00Z',
      pinned: i === 0 && rng() > 0.5,
    });
  }

  return notes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// --- Exported Factory Functions ---

function findAccount(id: string): Account {
  return accounts.find((a) => a.id === id) || accounts[0];
}

export async function getAccountOrders(accountId: string): Promise<AccountOrder[]> {
  await delay(300);
  return generateOrders(findAccount(accountId));
}

export async function getAccountHealth(accountId: string): Promise<AccountHealthData> {
  await delay(300);
  return generateHealthData(findAccount(accountId));
}

export async function getAccountVMI(accountId: string): Promise<AccountVMIData> {
  await delay(300);
  return generateVMIData(findAccount(accountId));
}

export async function getAccountPayments(accountId: string): Promise<AccountPaymentSummary> {
  await delay(300);
  return generatePayments(findAccount(accountId));
}

export async function getAccountDeliveries(accountId: string): Promise<AccountDeliverySummary> {
  await delay(300);
  return generateDeliveries(findAccount(accountId));
}

export async function getAccountFiles(accountId: string): Promise<AccountFile[]> {
  await delay(300);
  return generateFiles(findAccount(accountId));
}

export async function getAccountNotes(accountId: string): Promise<AccountNote[]> {
  await delay(300);
  return generateNotes(findAccount(accountId));
}
