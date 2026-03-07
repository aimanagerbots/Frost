import type {
  BudgetDivision,
  BudgetScenario,
  CapexItem,
  TeamMemberCost,
  LaborMetrics,
  LaborAllocation,
  SchedulingData,
  LaborAIRecommendation,
  CostPerUnitDataPoint,
} from '@/modules/finance/types/budget-labor';

// ---------------------------------------------------------------------------
// Budget by Division (9 divisions, total ~$200K/month)
// ---------------------------------------------------------------------------

const budgetDivisions: BudgetDivision[] = [
  {
    id: 'div-cultivation',
    name: 'Cultivation',
    budget: 28000,
    actual: 26400,
    variance: -1600,
    variancePct: -5.7,
    status: 'under',
    lineItems: [
      { category: 'labor', subcategory: 'Grow team wages', budget: 12000, actual: 11800, variance: -200 },
      { category: 'materials', subcategory: 'Nutrients & soil', budget: 8000, actual: 7400, variance: -600 },
      { category: 'equipment', subcategory: 'Lighting & HVAC maintenance', budget: 5000, actual: 4800, variance: -200 },
      { category: 'other', subcategory: 'Water & utilities', budget: 3000, actual: 2400, variance: -600 },
    ],
  },
  {
    id: 'div-manufacturing',
    name: 'Manufacturing',
    budget: 42000,
    actual: 44800,
    variance: 2800,
    variancePct: 6.7,
    status: 'over',
    lineItems: [
      { category: 'labor', subcategory: 'Production team wages', budget: 22000, actual: 23840, variance: 1840 },
      { category: 'materials', subcategory: 'Raw materials & solvents', budget: 12000, actual: 12600, variance: 600 },
      { category: 'equipment', subcategory: 'Extraction equipment maintenance', budget: 5000, actual: 5160, variance: 160 },
      { category: 'other', subcategory: 'Lab supplies & testing', budget: 3000, actual: 3200, variance: 200 },
    ],
  },
  {
    id: 'div-packaging',
    name: 'Packaging',
    budget: 18000,
    actual: 17200,
    variance: -800,
    variancePct: -4.4,
    status: 'under',
    lineItems: [
      { category: 'labor', subcategory: 'Packaging team wages', budget: 9500, actual: 9000, variance: -500 },
      { category: 'materials', subcategory: 'Packaging materials & labels', budget: 6000, actual: 5800, variance: -200 },
      { category: 'equipment', subcategory: 'Label printer & sealer maintenance', budget: 2500, actual: 2400, variance: -100 },
    ],
  },
  {
    id: 'div-fulfillment',
    name: 'Fulfillment',
    budget: 12000,
    actual: 11500,
    variance: -500,
    variancePct: -4.2,
    status: 'under',
    lineItems: [
      { category: 'labor', subcategory: 'Fulfillment team wages', budget: 9800, actual: 9400, variance: -400 },
      { category: 'materials', subcategory: 'Shipping supplies', budget: 1200, actual: 1100, variance: -100 },
      { category: 'equipment', subcategory: 'Warehouse equipment', budget: 1000, actual: 1000, variance: 0 },
    ],
  },
  {
    id: 'div-delivery',
    name: 'Delivery',
    budget: 15000,
    actual: 16100,
    variance: 1100,
    variancePct: 7.3,
    status: 'on-track',
    lineItems: [
      { category: 'labor', subcategory: 'Driver wages', budget: 10000, actual: 10200, variance: 200 },
      { category: 'materials', subcategory: 'Fuel & vehicle consumables', budget: 3000, actual: 3600, variance: 600 },
      { category: 'equipment', subcategory: 'Vehicle maintenance', budget: 2000, actual: 2300, variance: 300 },
    ],
  },
  {
    id: 'div-sales',
    name: 'Sales',
    budget: 35000,
    actual: 33500,
    variance: -1500,
    variancePct: -4.3,
    status: 'under',
    lineItems: [
      { category: 'labor', subcategory: 'Sales team wages', budget: 25000, actual: 24500, variance: -500 },
      { category: 'materials', subcategory: 'Samples & collateral', budget: 4000, actual: 3600, variance: -400 },
      { category: 'other', subcategory: 'Travel & entertainment', budget: 4000, actual: 3400, variance: -600 },
      { category: 'other', subcategory: 'CRM & software subscriptions', budget: 2000, actual: 2000, variance: 0 },
    ],
  },
  {
    id: 'div-marketing',
    name: 'Marketing',
    budget: 12000,
    actual: 14200,
    variance: 2200,
    variancePct: 18.3,
    status: 'over',
    lineItems: [
      { category: 'labor', subcategory: 'Marketing coordinator', budget: 5000, actual: 5000, variance: 0 },
      { category: 'materials', subcategory: 'Print & promo materials', budget: 3000, actual: 4200, variance: 1200 },
      { category: 'other', subcategory: 'Digital advertising', budget: 2500, actual: 3200, variance: 700 },
      { category: 'other', subcategory: 'Photography & content', budget: 1500, actual: 1800, variance: 300 },
    ],
  },
  {
    id: 'div-admin',
    name: 'Admin / G&A',
    budget: 22000,
    actual: 21000,
    variance: -1000,
    variancePct: -4.5,
    status: 'under',
    lineItems: [
      { category: 'labor', subcategory: 'Admin & management wages', budget: 14000, actual: 13500, variance: -500 },
      { category: 'other', subcategory: 'Insurance & compliance', budget: 4000, actual: 3800, variance: -200 },
      { category: 'other', subcategory: 'Office supplies & software', budget: 2500, actual: 2300, variance: -200 },
      { category: 'other', subcategory: 'Professional services', budget: 1500, actual: 1400, variance: -100 },
    ],
  },
  {
    id: 'div-facilities',
    name: 'Facilities',
    budget: 16000,
    actual: 16800,
    variance: 800,
    variancePct: 5.0,
    status: 'on-track',
    lineItems: [
      { category: 'other', subcategory: 'Rent & lease', budget: 8000, actual: 8000, variance: 0 },
      { category: 'other', subcategory: 'Utilities (electric, gas, water)', budget: 4500, actual: 5200, variance: 700 },
      { category: 'equipment', subcategory: 'Building maintenance', budget: 2500, actual: 2600, variance: 100 },
      { category: 'other', subcategory: 'Security & janitorial', budget: 1000, actual: 1000, variance: 0 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Budget Scenarios
// ---------------------------------------------------------------------------

const budgetScenarios: BudgetScenario[] = [
  {
    id: 'scenario-q2-growth',
    name: 'Q2 Growth 15%',
    description: 'Revenue grows 15% in Q2 driven by new dispensary onboarding and expanded category penetration at existing accounts.',
    assumptions: [
      { label: 'Monthly Revenue', baseValue: 1240000, adjustedValue: 1426000 },
      { label: 'New Hires (Trim + Fulfillment)', baseValue: 0, adjustedValue: 2 },
      { label: 'Material Costs', baseValue: 86000, adjustedValue: 96320 },
      { label: 'Monthly Labor Cost', baseValue: 95000, adjustedValue: 106000 },
    ],
    projectedRevenue: 1426000,
    projectedExpenses: 218320,
    projectedNetIncome: 1207680,
    cashImpact: -8000,
    breakeven: undefined,
  },
  {
    id: 'scenario-lose-greenfield',
    name: 'Lose Greenfield Account',
    description: 'Greenfield Dispensary ($50K/month) churns. Immediate revenue loss with limited cost reduction available.',
    assumptions: [
      { label: 'Monthly Revenue', baseValue: 1240000, adjustedValue: 1190000 },
      { label: 'Delivery Runs / Week', baseValue: 5, adjustedValue: 4 },
      { label: 'Manufacturing Hours / Week', baseValue: 160, adjustedValue: 150 },
      { label: 'Monthly Savings (Delivery)', baseValue: 0, adjustedValue: 1200 },
      { label: 'Monthly Savings (Mfg Labor)', baseValue: 0, adjustedValue: 880 },
    ],
    projectedRevenue: 1190000,
    projectedExpenses: 197920,
    projectedNetIncome: 992080,
    cashImpact: -48000,
    breakeven: undefined,
  },
  {
    id: 'scenario-new-grow-room',
    name: 'New Grow Room Build',
    description: '$150K capex investment to add a fourth grow room, increasing flower capacity by 30%. First harvest at week 20.',
    assumptions: [
      { label: 'Capital Expenditure', baseValue: 0, adjustedValue: 150000 },
      { label: 'Build Duration (weeks)', baseValue: 0, adjustedValue: 8 },
      { label: 'First Harvest (weeks)', baseValue: 0, adjustedValue: 20 },
      { label: 'Flower Capacity Increase', baseValue: 100, adjustedValue: 130 },
      { label: 'Additional Monthly Revenue (post-harvest)', baseValue: 0, adjustedValue: 62000 },
    ],
    projectedRevenue: 1302000,
    projectedExpenses: 215000,
    projectedNetIncome: 1087000,
    cashImpact: -150000,
    breakeven: 'Month 10 post-build start',
  },
];

// ---------------------------------------------------------------------------
// CapEx Items
// ---------------------------------------------------------------------------

const capexItems: CapexItem[] = [
  {
    id: 'capex-led-upgrade',
    description: 'LED Upgrade Room 1-3',
    amount: 45000,
    status: 'installed',
    purchaseDate: '2025-11-15',
    usefulLife: 7,
    depreciationMethod: 'Straight-line',
    roi: 28,
    division: 'Cultivation',
  },
  {
    id: 'capex-extraction',
    description: 'Second Extraction Unit',
    amount: 42000,
    status: 'planned',
    purchaseDate: undefined,
    usefulLife: 10,
    depreciationMethod: 'Straight-line',
    roi: 35,
    division: 'Manufacturing',
  },
  {
    id: 'capex-delivery-van',
    description: 'Delivery Van #3',
    amount: 38000,
    status: 'purchased',
    purchaseDate: '2026-01-20',
    usefulLife: 5,
    depreciationMethod: 'Straight-line',
    roi: undefined,
    division: 'Delivery',
  },
  {
    id: 'capex-label-machine',
    description: 'Packaging Automation — Label Machine',
    amount: 18000,
    status: 'planned',
    purchaseDate: undefined,
    usefulLife: 5,
    depreciationMethod: 'Straight-line',
    roi: 40,
    division: 'Packaging',
  },
  {
    id: 'capex-clone-room',
    description: 'Clone Room Expansion',
    amount: 25000,
    status: 'planned',
    purchaseDate: undefined,
    usefulLife: 10,
    depreciationMethod: 'Straight-line',
    roi: undefined,
    division: 'Cultivation',
  },
];

// ---------------------------------------------------------------------------
// Labor — Team Member Costs (15 FTE + 2 part-time)
// ---------------------------------------------------------------------------

const teamMemberCosts: TeamMemberCost[] = [
  // Cultivation (2)
  { id: 'tm-sarah', name: 'Sarah Williams', division: 'Cultivation', role: 'Cultivation Manager', annualSalary: 69600, hourlyRate: 33.46, hoursThisMonth: 168, overtimeHours: 0, totalCost: 5800, costPerUnit: 3.20 },
  { id: 'tm-roberto', name: 'Roberto Mendez', division: 'Cultivation', role: 'Grow Technician', annualSalary: 50400, hourlyRate: 24.23, hoursThisMonth: 168, overtimeHours: 0, totalCost: 4200, costPerUnit: 3.20 },
  // Manufacturing (4)
  { id: 'tm-maria', name: 'Maria Santos', division: 'Manufacturing', role: 'Trim Lead', annualSalary: 62400, hourlyRate: 30.00, hoursThisMonth: 168, overtimeHours: 8, totalCost: 5200, costPerUnit: 12.40 },
  { id: 'tm-james', name: 'James Park', division: 'Manufacturing', role: 'Extraction Tech', annualSalary: 67200, hourlyRate: 32.31, hoursThisMonth: 168, overtimeHours: 12, totalCost: 5600, costPerUnit: 12.40 },
  { id: 'tm-lisa', name: 'Lisa Chen', division: 'Manufacturing', role: 'Pen Filling Specialist', annualSalary: 57600, hourlyRate: 27.69, hoursThisMonth: 168, overtimeHours: 4, totalCost: 4800, costPerUnit: 12.40 },
  { id: 'tm-marcus', name: 'Marcus Johnson', division: 'Manufacturing', role: 'Preroll Lead', annualSalary: 55200, hourlyRate: 26.54, hoursThisMonth: 168, overtimeHours: 8, totalCost: 4600, costPerUnit: 12.40 },
  // Packaging (2)
  { id: 'tm-rachel', name: 'Rachel Kim', division: 'Packaging', role: 'Packaging Lead', annualSalary: 57600, hourlyRate: 27.69, hoursThisMonth: 168, overtimeHours: 0, totalCost: 4800, costPerUnit: 0.45 },
  { id: 'tm-david', name: 'David Okonkwo', division: 'Packaging', role: 'Packaging Specialist', annualSalary: 50400, hourlyRate: 24.23, hoursThisMonth: 168, overtimeHours: 0, totalCost: 4200, costPerUnit: 0.45 },
  // Fulfillment (2)
  { id: 'tm-tyler', name: 'Tyler Ross', division: 'Fulfillment', role: 'Fulfillment Lead', annualSalary: 60000, hourlyRate: 28.85, hoursThisMonth: 168, overtimeHours: 4, totalCost: 5000, costPerUnit: 2.80 },
  { id: 'tm-aisha', name: 'Aisha Williams', division: 'Fulfillment', role: 'Fulfillment Specialist', annualSalary: 52800, hourlyRate: 25.38, hoursThisMonth: 168, overtimeHours: 4, totalCost: 4400, costPerUnit: 2.80 },
  // Delivery (3)
  { id: 'tm-mike', name: 'Mike Torres', division: 'Delivery', role: 'Driver', annualSalary: 55200, hourlyRate: 26.54, hoursThisMonth: 168, overtimeHours: 0, totalCost: 4600, costPerUnit: 18.50 },
  { id: 'tm-chris', name: 'Chris Petersen', division: 'Delivery', role: 'Driver', annualSalary: 50400, hourlyRate: 24.23, hoursThisMonth: 168, overtimeHours: 0, totalCost: 4200, costPerUnit: 18.50 },
  { id: 'tm-amy', name: 'Amy Nakamura', division: 'Delivery', role: 'Driver', annualSalary: 57600, hourlyRate: 27.69, hoursThisMonth: 168, overtimeHours: 0, totalCost: 4800, costPerUnit: 18.50 },
  // Sales (4)
  { id: 'tm-jake', name: 'Jake Morrison', division: 'Sales', role: 'Sales Rep', annualSalary: 74400, hourlyRate: 35.77, hoursThisMonth: 168, overtimeHours: 0, totalCost: 6200 },
  { id: 'tm-priya', name: 'Priya Patel', division: 'Sales', role: 'Sales Rep', annualSalary: 69600, hourlyRate: 33.46, hoursThisMonth: 168, overtimeHours: 0, totalCost: 5800 },
  { id: 'tm-carlos', name: 'Carlos Ruiz', division: 'Sales', role: 'Sales Rep', annualSalary: 60000, hourlyRate: 28.85, hoursThisMonth: 168, overtimeHours: 0, totalCost: 5000 },
  { id: 'tm-dana', name: 'Dana Whitfield', division: 'Sales', role: 'Sales Manager', annualSalary: 90000, hourlyRate: 43.27, hoursThisMonth: 168, overtimeHours: 0, totalCost: 7500 },
];

// ---------------------------------------------------------------------------
// Labor Metrics
// ---------------------------------------------------------------------------

const laborMetrics: LaborMetrics = {
  totalHeadcount: 17,
  totalLaborCost: 95000,
  costPerUnit: [
    { division: 'Cultivation', metric: '$/plant', value: 3.20, trend: -4.2 },
    { division: 'Manufacturing', metric: '$/lb processed', value: 12.40, trend: -3.8 },
    { division: 'Packaging', metric: '$/package', value: 0.45, trend: -2.1 },
    { division: 'Fulfillment', metric: '$/order', value: 2.80, trend: -1.8 },
    { division: 'Delivery', metric: '$/delivery', value: 18.50, trend: -6.5 },
  ],
  revenuePerEmployee: 82000,
  overtimePercent: 2.4,
};

// ---------------------------------------------------------------------------
// Labor Allocation (weekly hours by activity)
// ---------------------------------------------------------------------------

const laborAllocation: LaborAllocation[] = [
  { division: 'Trimming', hours: 42, percentage: 22, costPerHour: 28.50 },
  { division: 'Extraction', hours: 35, percentage: 18, costPerHour: 32.00 },
  { division: 'Preroll', hours: 28, percentage: 15, costPerHour: 26.50 },
  { division: 'Packaging', hours: 32, percentage: 17, costPerHour: 25.50 },
  { division: 'Fulfillment', hours: 24, percentage: 13, costPerHour: 27.00 },
  { division: 'Delivery', hours: 30, percentage: 16, costPerHour: 26.00 },
];

// ---------------------------------------------------------------------------
// Scheduling Efficiency (by day of week)
// ---------------------------------------------------------------------------

const schedulingData: SchedulingData[] = [
  { dayOfWeek: 'Monday', demand: 85, staffed: 90, gap: 5, status: 'optimal' },
  { dayOfWeek: 'Tuesday', demand: 92, staffed: 80, gap: -12, status: 'understaffed' },
  { dayOfWeek: 'Wednesday', demand: 88, staffed: 80, gap: -8, status: 'understaffed' },
  { dayOfWeek: 'Thursday', demand: 78, staffed: 80, gap: 2, status: 'optimal' },
  { dayOfWeek: 'Friday', demand: 95, staffed: 85, gap: -10, status: 'understaffed' },
  { dayOfWeek: 'Saturday', demand: 40, staffed: 50, gap: 10, status: 'overstaffed' },
  { dayOfWeek: 'Sunday', demand: 15, staffed: 20, gap: 5, status: 'overstaffed' },
];

// ---------------------------------------------------------------------------
// AI Recommendations
// ---------------------------------------------------------------------------

const laborRecommendations: LaborAIRecommendation[] = [
  {
    id: 'rec-trim-tech',
    title: 'Add Trim Technician',
    description: 'Adding one trim technician at $22/hr would increase throughput 15% and reduce cost-per-lb by 8%.',
    impact: 'Payback in 3 weeks. ROI: 280% annualized.',
    priority: 'high',
  },
  {
    id: 'rec-extraction-pt',
    title: 'Part-Time Extraction Tech',
    description: 'Manufacturing overtime ($1,840 this month) is recurring. A part-time extraction tech 3 days/week would cost $2,100 but eliminate overtime and increase capacity.',
    impact: 'Net cost increase: $260/month with 15% more capacity.',
    priority: 'high',
  },
  {
    id: 'rec-shift-saturday',
    title: 'Shift Saturday Staff to Tuesday',
    description: 'Tuesday-Friday understaffing causes 15% of fulfillment delays. Shift one Saturday worker to Tuesday.',
    impact: 'Eliminates 15% of fulfillment delays at zero additional cost.',
    priority: 'medium',
  },
  {
    id: 'rec-efficiency',
    title: 'Team Efficiency Above Average',
    description: 'Revenue per employee is $82K — industry average is $75K. Team is efficient and well-utilized.',
    impact: 'No action needed. Continue current staffing model.',
    priority: 'low',
  },
  {
    id: 'rec-delivery-savings',
    title: 'Route Optimization Funding',
    description: 'Delivery cost per stop is down 18% since route optimization. Savings fund ~60% of a new driver hire.',
    impact: 'If volume grows 10%, current savings cover new driver onboarding.',
    priority: 'medium',
  },
  {
    id: 'rec-label-automation',
    title: 'Packaging Automation ROI',
    description: 'Label machine at $18K would eliminate 12 hrs/week of manual labeling — currently the biggest packaging bottleneck.',
    impact: 'ROI in 8 months. Frees Rachel & David for QC.',
    priority: 'high',
  },
];

// ---------------------------------------------------------------------------
// Cost Per Unit Trends (6 months)
// ---------------------------------------------------------------------------

const costPerUnitTrends: CostPerUnitDataPoint[] = [
  { month: 'Oct', flowerPerLb: 142, prerollPerUnit: 1.85, vapePerUnit: 8.20, fulfillmentPerOrder: 2.95, deliveryPerStop: 19.80 },
  { month: 'Nov', flowerPerLb: 138, prerollPerUnit: 1.82, vapePerUnit: 8.15, fulfillmentPerOrder: 2.90, deliveryPerStop: 19.50 },
  { month: 'Dec', flowerPerLb: 135, prerollPerUnit: 1.80, vapePerUnit: 8.10, fulfillmentPerOrder: 2.88, deliveryPerStop: 19.20 },
  { month: 'Jan', flowerPerLb: 131, prerollPerUnit: 1.78, vapePerUnit: 8.05, fulfillmentPerOrder: 2.85, deliveryPerStop: 18.90 },
  { month: 'Feb', flowerPerLb: 128, prerollPerUnit: 1.75, vapePerUnit: 7.95, fulfillmentPerOrder: 2.82, deliveryPerStop: 18.70 },
  { month: 'Mar', flowerPerLb: 126, prerollPerUnit: 1.72, vapePerUnit: 7.90, fulfillmentPerOrder: 2.80, deliveryPerStop: 18.50 },
];

// ---------------------------------------------------------------------------
// Getter functions (300ms simulated delay)
// ---------------------------------------------------------------------------

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 300));

export const getBudgetByDivision = (): Promise<BudgetDivision[]> => delay(budgetDivisions);
export const getBudgetScenarios = (): Promise<BudgetScenario[]> => delay(budgetScenarios);
export const getCapexItems = (): Promise<CapexItem[]> => delay(capexItems);
export const getLaborData = (): Promise<TeamMemberCost[]> => delay(teamMemberCosts);
export const getLaborMetrics = (): Promise<LaborMetrics> => delay(laborMetrics);
export const getLaborAllocation = (): Promise<LaborAllocation[]> => delay(laborAllocation);
export const getSchedulingData = (): Promise<SchedulingData[]> => delay(schedulingData);
export const getLaborRecommendations = (): Promise<LaborAIRecommendation[]> => delay(laborRecommendations);
export const getCostPerUnitTrends = (): Promise<CostPerUnitDataPoint[]> => delay(costPerUnitTrends);
