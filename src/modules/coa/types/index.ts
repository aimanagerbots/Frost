export type COAStatus = 'submitted' | 'in-testing' | 'passed' | 'failed' | 'remediation';

export interface TerpeneEntry {
  name: string;
  percent: number;
}

export interface ContaminantEntry {
  type: string;
  result: 'pass' | 'fail';
  value?: string;
}

export interface COAResults {
  thcPercent: number;
  cbdPercent: number;
  totalCannabinoids: number;
  terpeneProfile: TerpeneEntry[];
  contaminants: ContaminantEntry[];
  moistureContent: number;
  overallStatus: 'pass' | 'fail';
}

export interface COASubmission {
  [key: string]: unknown;
  id: string;
  batchNumber: string;
  productName: string;
  category: 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
  strainName: string;
  labName: string;
  submittedDate: string;
  expectedReturn: string;
  status: COAStatus;
  results?: COAResults;
  documentUrl?: string;
  remediationNotes?: string;
}

export interface COAMetrics {
  totalSubmissions: number;
  pendingResults: number;
  passRate: number;
  avgTurnaround: number;
  failedThisMonth: number;
}
