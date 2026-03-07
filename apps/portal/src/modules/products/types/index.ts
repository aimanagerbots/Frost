export type ProductCategory = 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
export type ProductStage = 'ideation' | 'formulation' | 'sample' | 'testing' | 'approved' | 'launched';

export interface ProductConcept {
  [key: string]: unknown;
  id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string;
  strainName?: string;
  stage: ProductStage;
  description: string;
  targetLaunch: string;
  assignee: string;
  estimatedMargin?: number;
  targetAccounts?: string[];
  notes?: string;
}

export interface RDMetrics {
  conceptsInPipeline: number;
  avgTimeToLaunch: string;
  launchesThisQuarter: number;
  successRate: number;
}

export interface ProductFilter {
  stage?: ProductStage;
  category?: ProductCategory;
  search?: string;
}
