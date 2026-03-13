'use client';

import { useDemoQuery } from '@/lib/use-demo-query';

export interface TeamRole {
  name: string;
  count: number;
  color: string;
}

export interface TeamPerson {
  id: string;
  name: string;
  role: string;
  progress: number;
  avatarColor: string;
}

export interface MonthlyStat {
  month: string;
  value: number;
}

export interface TeamDashboardData {
  greeting: string;
  subtitle: string;
  teamTotal: number;
  roles: TeamRole[];
  complianceRate: number;
  certified: number;
  needsTraining: number;
  people: TeamPerson[];
  stats: {
    participation: number;
    avgTime: string;
    avgScore: string;
  };
  monthlyStats: MonthlyStat[];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

async function fetchTeamDashboard(): Promise<TeamDashboardData> {
  await new Promise((r) => setTimeout(r, 400));

  return {
    greeting: `${getGreeting()}, Jordan`,
    subtitle: "Check your team's latest activity",
    teamTotal: 154,
    roles: [
      { name: 'Budtender', count: 61, color: '#5BB8E6' },
      { name: 'Manager', count: 16, color: '#F59E0B' },
      { name: 'Cultivation', count: 28, color: '#EF4444' },
      { name: 'Processing', count: 37, color: '#8B5CF6' },
      { name: 'Delivery', count: 12, color: '#10B981' },
    ],
    complianceRate: 74,
    certified: 114,
    needsTraining: 40,
    people: [
      { id: '1', name: 'Oliver Cranston', role: 'Lead Budtender', progress: 12, avatarColor: '#5BB8E6' },
      { id: '2', name: 'Sara Green', role: 'Cultivation Tech', progress: 76, avatarColor: '#10B981' },
      { id: '3', name: 'Sam Wilson', role: 'Processing Lead', progress: 32, avatarColor: '#8B5CF6' },
    ],
    stats: {
      participation: 19,
      avgTime: '3.25h',
      avgScore: '4.6/5.0',
    },
    monthlyStats: [
      { month: 'Jan', value: 12 },
      { month: 'Feb', value: 8 },
      { month: 'Mar', value: 15 },
      { month: 'Apr', value: 22 },
      { month: 'May', value: 18 },
      { month: 'Jun', value: 25 },
      { month: 'Jul', value: 30 },
      { month: 'Aug', value: 28 },
      { month: 'Sep', value: 19 },
      { month: 'Oct', value: 14 },
      { month: 'Nov', value: 10 },
      { month: 'Dec', value: 6 },
    ],
  };
}

export function useTeamDashboard() {
  return useDemoQuery<TeamDashboardData>({
    queryKey: ['team', 'mobile-dashboard'],
    demoQueryFn: fetchTeamDashboard,
    emptyValue: {
      greeting: '',
      subtitle: '',
      teamTotal: 0,
      roles: [],
      complianceRate: 0,
      certified: 0,
      needsTraining: 0,
      people: [],
      stats: { participation: 0, avgTime: '0h', avgScore: '0/5.0' },
      monthlyStats: [],
    },
  });
}
