export type Division = 'sales' | 'manufacturing' | 'packaging' | 'fulfillment' | 'delivery' | 'cultivation' | 'lab' | 'marketing' | 'management' | 'admin';
export type MemberStatus = 'active' | 'on-leave' | 'inactive';

export interface TeamMember {
  [key: string]: unknown;
  id: string;
  name: string;
  role: string;
  division: Division;
  email: string;
  phone: string;
  startDate: string;
  modules: string[];
  status: MemberStatus;
}

export interface TeamFilter {
  division?: Division;
  status?: MemberStatus;
  search?: string;
}
