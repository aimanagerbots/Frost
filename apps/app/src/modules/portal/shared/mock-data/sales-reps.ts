import type { PortalSalesRep } from '../types';

export const SALES_REPS: PortalSalesRep[] = [
  {
    id: 'rep-1',
    name: 'Marcus Johnson',
    title: 'Senior Account Executive',
    email: 'marcus.johnson@frostcannabis.com',
    phone: '(206) 555-0147',
    photoUrl: '/images/portal/reps/marcus-johnson.jpg',
    territory: 'Seattle / West',
  },
  {
    id: 'rep-2',
    name: 'Daniella Reyes',
    title: 'Account Executive',
    email: 'daniella.reyes@frostcannabis.com',
    phone: '(509) 555-0283',
    photoUrl: '/images/portal/reps/daniella-reyes.jpg',
    territory: 'East / South',
  },
];

export function getRepById(id: string): PortalSalesRep | undefined {
  return SALES_REPS.find((rep) => rep.id === id);
}
