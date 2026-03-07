export interface BudgetLineItem {
  category: 'labor' | 'materials' | 'equipment' | 'other';
  subcategory: string;
  budget: number;
  actual: number;
  variance: number;
}

export interface BudgetDivision {
  id: string;
  name: string;
  budget: number;
  actual: number;
  variance: number;
  variancePct: number;
  status: 'under' | 'on-track' | 'over';
  lineItems: BudgetLineItem[];
}

export interface BudgetScenario {
  id: string;
  name: string;
  description: string;
  assumptions: {
    label: string;
    baseValue: number;
    adjustedValue: number;
  }[];
  projectedRevenue: number;
  projectedExpenses: number;
  projectedNetIncome: number;
  cashImpact: number;
  breakeven?: string;
}

export interface CapexItem {
  id: string;
  description: string;
  amount: number;
  status: 'planned' | 'approved' | 'purchased' | 'installed';
  purchaseDate?: string;
  usefulLife: number;
  depreciationMethod: string;
  roi?: number;
  division: string;
}

export interface TeamMemberCost {
  id: string;
  name: string;
  division: string;
  role: string;
  annualSalary: number;
  hourlyRate: number;
  hoursThisMonth: number;
  overtimeHours: number;
  totalCost: number;
  costPerUnit?: number;
}

export interface LaborMetrics {
  totalHeadcount: number;
  totalLaborCost: number;
  costPerUnit: {
    division: string;
    metric: string;
    value: number;
    trend: number;
  }[];
  revenuePerEmployee: number;
  overtimePercent: number;
}

export interface LaborAllocation {
  division: string;
  hours: number;
  percentage: number;
  costPerHour: number;
}

export interface SchedulingData {
  dayOfWeek: string;
  demand: number;
  staffed: number;
  gap: number;
  status: 'overstaffed' | 'optimal' | 'understaffed';
}

export interface LaborAIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CostPerUnitDataPoint {
  month: string;
  flowerPerLb: number;
  prerollPerUnit: number;
  vapePerUnit: number;
  fulfillmentPerOrder: number;
  deliveryPerStop: number;
}
