import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Users,
  ClipboardList,
  BarChart3,
  Target,
  Leaf,
  Factory,
  Package,
  Warehouse,
  BoxSelect,
  Truck,
  Megaphone,
  Lightbulb,
  FlaskConical,
  Bot,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Brain,
  FolderKanban,
  Video,
  FileText,
  UsersRound,
  DollarSign,
  PieChart,
  Settings,
  Server,
  GitBranch,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  accent: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, accent: '#667EEA' },
      { label: 'Tasks', href: '/tasks', icon: CheckSquare, accent: '#8B5CF6' },
      { label: 'Calendar', href: '/calendar', icon: CalendarDays, accent: '#3B82F6' },
    ],
  },
  {
    title: 'SALES & CRM',
    items: [
      { label: 'CRM', href: '/crm', icon: Users, accent: '#F59E0B' },
      { label: 'Pipeline', href: '/pipeline', icon: GitBranch, accent: '#F59E0B' },
      { label: 'Orders', href: '/orders', icon: ClipboardList, accent: '#F59E0B' },
      { label: 'VMI', href: '/vmi', icon: BarChart3, accent: '#EF4444' },
      { label: 'Competitor Intel', href: '/competitors', icon: Target, accent: '#F97316' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Cultivation', href: '/cultivation', icon: Leaf, accent: '#22C55E' },
      { label: 'Manufacturing', href: '/manufacturing', icon: Factory, accent: '#10B981' },
      { label: 'Packaging', href: '/packaging', icon: Package, accent: '#84CC16' },
      { label: 'Inventory', href: '/inventory', icon: Warehouse, accent: '#8B5CF6' },
      { label: 'Fulfillment', href: '/fulfillment', icon: BoxSelect, accent: '#14B8A6' },
      { label: 'Delivery', href: '/delivery', icon: Truck, accent: '#0EA5E9' },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      { label: 'Content', href: '/content', icon: Megaphone, accent: '#EC4899' },
      { label: 'Product Planning', href: '/products', icon: Lightbulb, accent: '#DB2777' },
    ],
  },
  {
    title: 'LAB / QUALITY',
    items: [
      { label: 'COA Manager', href: '/coa', icon: FlaskConical, accent: '#9333EA' },
    ],
  },
  {
    title: 'AI & KNOWLEDGE',
    items: [
      { label: 'Agent Hub', href: '/agents', icon: Bot, accent: '#06B6D4' },
      { label: 'Approvals', href: '/approvals', icon: ShieldCheck, accent: '#FBBF24' },
      { label: 'Council', href: '/council', icon: BookOpen, accent: '#6366F1' },
      { label: 'Insights', href: '/insights', icon: Sparkles, accent: '#06B6D4' },
      { label: 'Memory', href: '/memory', icon: Brain, accent: '#8B5CF6' },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Projects', href: '/projects', icon: FolderKanban, accent: '#7C3AED' },
      { label: 'Meetings', href: '/meetings', icon: Video, accent: '#2563EB' },
      { label: 'Docs', href: '/docs', icon: FileText, accent: '#64748B' },
      { label: 'Team', href: '/team', icon: UsersRound, accent: '#0D9488' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Finance', href: '/finance', icon: DollarSign, accent: '#059669' },
      { label: 'Reports', href: '/reports', icon: PieChart, accent: '#475569' },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings, accent: '#94A3B8' },
      { label: 'System', href: '/system', icon: Server, accent: '#64748B' },
    ],
  },
];
