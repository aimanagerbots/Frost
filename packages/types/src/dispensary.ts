/** Dispensary location for store locator / product finder */
export interface DispensaryLocation {
  id: string;
  name: string;
  slug: string;
  dba: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  region: string;
  phone?: string;
  website?: string;
  hours?: string;
  imageUrl?: string;
  logoUrl?: string;
  description?: string;
  frostPartnerSince?: string;
  featuredDeal?: string;
  categoriesCarried: string[];
}
