import type { TeamMember, TeamFilter } from '@/modules/team/types';

const members: TeamMember[] = [
  // Sales
  {
    id: 'member-jake',
    name: 'Jake Morrison',
    role: 'Sales Rep',
    division: 'sales',
    email: 'jake.morrison@frostfarms.com',
    phone: '206-555-1201',
    startDate: '2023-03-15',
    modules: ['CRM', 'Orders', 'Products', 'Meetings'],
    status: 'active',
  },
  {
    id: 'member-priya',
    name: 'Priya Patel',
    role: 'Sales Rep',
    division: 'sales',
    email: 'priya.patel@frostfarms.com',
    phone: '206-555-1202',
    startDate: '2023-06-01',
    modules: ['CRM', 'Orders', 'Products', 'Meetings'],
    status: 'active',
  },
  {
    id: 'member-carlos',
    name: 'Carlos Ruiz',
    role: 'Sales Rep',
    division: 'sales',
    email: 'carlos.ruiz@frostfarms.com',
    phone: '206-555-1203',
    startDate: '2024-01-10',
    modules: ['CRM', 'Orders', 'Products'],
    status: 'active',
  },
  {
    id: 'member-dana',
    name: 'Dana Whitfield',
    role: 'Sales Manager',
    division: 'sales',
    email: 'dana.whitfield@frostfarms.com',
    phone: '206-555-1204',
    startDate: '2022-09-01',
    modules: ['CRM', 'Orders', 'Products', 'Reports', 'Meetings', 'Insights'],
    status: 'active',
  },
  // Manufacturing
  {
    id: 'member-maria',
    name: 'Maria Santos',
    role: 'Trim Lead',
    division: 'manufacturing',
    email: 'maria.santos@frostfarms.com',
    phone: '206-555-1301',
    startDate: '2023-02-20',
    modules: ['Manufacturing', 'Inventory', 'Tasks'],
    status: 'active',
  },
  {
    id: 'member-james',
    name: 'James Park',
    role: 'Extraction Tech',
    division: 'manufacturing',
    email: 'james.park@frostfarms.com',
    phone: '206-555-1302',
    startDate: '2023-08-14',
    modules: ['Manufacturing', 'Inventory', 'COA'],
    status: 'active',
  },
  {
    id: 'member-lisa',
    name: 'Lisa Chen',
    role: 'Pen Filling Specialist',
    division: 'manufacturing',
    email: 'lisa.chen@frostfarms.com',
    phone: '206-555-1303',
    startDate: '2024-02-05',
    modules: ['Manufacturing', 'Inventory', 'Packaging'],
    status: 'on-leave',
  },
  {
    id: 'member-marcus',
    name: 'Marcus Johnson',
    role: 'Preroll Lead',
    division: 'manufacturing',
    email: 'marcus.johnson@frostfarms.com',
    phone: '206-555-1304',
    startDate: '2023-05-22',
    modules: ['Manufacturing', 'Inventory', 'Tasks'],
    status: 'active',
  },
  // Packaging
  {
    id: 'member-rachel',
    name: 'Rachel Kim',
    role: 'Packaging Lead',
    division: 'packaging',
    email: 'rachel.kim@frostfarms.com',
    phone: '206-555-1401',
    startDate: '2023-01-09',
    modules: ['Packaging', 'Inventory', 'Fulfillment', 'Tasks'],
    status: 'active',
  },
  {
    id: 'member-david',
    name: 'David Okonkwo',
    role: 'Packaging Specialist',
    division: 'packaging',
    email: 'david.okonkwo@frostfarms.com',
    phone: '206-555-1402',
    startDate: '2024-03-18',
    modules: ['Packaging', 'Inventory'],
    status: 'active',
  },
  // Fulfillment
  {
    id: 'member-tyler',
    name: 'Tyler Ross',
    role: 'Fulfillment Lead',
    division: 'fulfillment',
    email: 'tyler.ross@frostfarms.com',
    phone: '206-555-1501',
    startDate: '2022-11-15',
    modules: ['Fulfillment', 'Orders', 'Inventory', 'Tasks'],
    status: 'active',
  },
  {
    id: 'member-aisha',
    name: 'Aisha Williams',
    role: 'Fulfillment Specialist',
    division: 'fulfillment',
    email: 'aisha.williams@frostfarms.com',
    phone: '206-555-1502',
    startDate: '2024-04-01',
    modules: ['Fulfillment', 'Orders', 'Inventory'],
    status: 'active',
  },
  // Delivery
  {
    id: 'member-mike',
    name: 'Mike Torres',
    role: 'Driver',
    division: 'delivery',
    email: 'mike.torres@frostfarms.com',
    phone: '206-555-1601',
    startDate: '2023-04-10',
    modules: ['Delivery'],
    status: 'active',
  },
  {
    id: 'member-chris',
    name: 'Chris Petersen',
    role: 'Driver',
    division: 'delivery',
    email: 'chris.petersen@frostfarms.com',
    phone: '206-555-1602',
    startDate: '2023-07-25',
    modules: ['Delivery'],
    status: 'active',
  },
  {
    id: 'member-amy',
    name: 'Amy Nakamura',
    role: 'Driver',
    division: 'delivery',
    email: 'amy.nakamura@frostfarms.com',
    phone: '206-555-1603',
    startDate: '2024-01-22',
    modules: ['Delivery'],
    status: 'active',
  },
  // Cultivation
  {
    id: 'member-sarah',
    name: 'Sarah Williams',
    role: 'Cultivation Manager',
    division: 'cultivation',
    email: 'sarah.williams@frostfarms.com',
    phone: '206-555-1701',
    startDate: '2022-06-01',
    modules: ['Cultivation', 'Inventory', 'Tasks', 'Reports'],
    status: 'active',
  },
  // Lab
  {
    id: 'member-nicole',
    name: 'Nicole Martinez',
    role: 'Quality Assurance Manager',
    division: 'lab',
    email: 'nicole.martinez@frostfarms.com',
    phone: '206-555-1801',
    startDate: '2022-08-15',
    modules: ['COA', 'Manufacturing', 'Approvals', 'Reports'],
    status: 'active',
  },
];

export async function getTeamMembers(filters?: TeamFilter): Promise<TeamMember[]> {
  await new Promise((r) => setTimeout(r, 300));
  let result = [...members];
  if (filters?.division) result = result.filter((m) => m.division === filters.division);
  if (filters?.status) result = result.filter((m) => m.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getTeamMetrics() {
  await new Promise((r) => setTimeout(r, 300));
  const active = members.filter((m) => m.status === 'active').length;
  const onLeave = members.filter((m) => m.status === 'on-leave').length;
  const divisions = new Set(members.map((m) => m.division)).size;
  return { total: members.length, active, divisions, onLeave };
}
