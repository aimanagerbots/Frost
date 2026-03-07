import { create } from 'zustand';

export interface CRMTab {
  id: string;
  label: string;
  subModules: { id: string; label: string; icon: string }[];
}

export const CRM_TABS: CRMTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    subModules: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { id: 'ai-copilot', label: 'AI Copilot', icon: 'Bot' },
    ],
  },
  {
    id: 'accounts',
    label: 'Accounts',
    subModules: [
      { id: 'accounts', label: 'Accounts', icon: 'Building2' },
      { id: 'territory-map', label: 'Territory Map', icon: 'Map' },
      { id: 'segments', label: 'Segments', icon: 'Tags' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    subModules: [
      { id: 'opportunities', label: 'Opportunities', icon: 'Target' },
      { id: 'reorder-center', label: 'Reorder Center', icon: 'RefreshCw' },
      { id: 'price-book', label: 'Price Book', icon: 'BookOpen' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy' },
    ],
  },
  {
    id: 'outreach',
    label: 'Outreach',
    subModules: [
      { id: 'interactions', label: 'Interactions', icon: 'MessageSquare' },
      { id: 'campaigns', label: 'Campaigns', icon: 'Megaphone' },
      { id: 'vendor-days', label: 'Vendor Days', icon: 'CalendarDays' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    subModules: [
      { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
      { id: 'product-recommendations', label: 'Product Recommendations', icon: 'Sparkles' },
      { id: 'compliance-monitor', label: 'Compliance Monitor', icon: 'Shield' },
      { id: 'win-loss-log', label: 'Win/Loss Log', icon: 'FileText' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    subModules: [
      { id: 'playbooks', label: 'Playbooks', icon: 'BookMarked' },
    ],
  },
];

interface Breadcrumb {
  label: string;
  tab?: string;
  subModule?: string;
}

interface CRMStore {
  activeTab: string;
  activeSubModule: string;
  selectedAccountId: string | null;
  breadcrumbs: Breadcrumb[];
  tabBarCollapsed: boolean;
  setActiveTab: (tab: string) => void;
  setActiveSubModule: (tab: string, subModule: string) => void;
  setSelectedAccountId: (id: string | null) => void;
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void;
  toggleTabBar: () => void;
}

export const useCRMStore = create<CRMStore>((set) => ({
  activeTab: 'overview',
  activeSubModule: 'dashboard',
  selectedAccountId: null,
  breadcrumbs: [],
  tabBarCollapsed: false,
  setActiveTab: (tab) => {
    const tabConfig = CRM_TABS.find((t) => t.id === tab);
    const firstSub = tabConfig?.subModules[0]?.id || '';
    set({ activeTab: tab, activeSubModule: firstSub, breadcrumbs: [] });
  },
  setActiveSubModule: (tab, subModule) => {
    set({ activeTab: tab, activeSubModule: subModule, breadcrumbs: [] });
  },
  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
  setBreadcrumbs: (crumbs) => set({ breadcrumbs: crumbs }),
  toggleTabBar: () => set((s) => ({ tabBarCollapsed: !s.tabBarCollapsed })),
}));
