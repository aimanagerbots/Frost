export type StrainType = 'indica' | 'sativa' | 'hybrid' | 'cbd' | 'balanced';

export type StrainDifficulty = 'easy' | 'moderate' | 'advanced';

/** Consumer-facing strain profile */
export interface StrainProfile {
  id: string;
  name: string;
  slug: string;
  type: StrainType;
  lineage: string;
  thcRange: string;
  cbdRange: string;
  terpeneProfile: string[];
  difficulty: StrainDifficulty;
  description?: string;
  imageUrl?: string;
}
