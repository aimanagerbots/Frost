import {
  MessageSquare,
  LayoutDashboard,
  Mail,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Video,
  FileText,
  UsersRound,
  Wand2,
  CalendarRange,
  Share2,
  SendHorizonal,
  Search,
  PartyPopper,
  Megaphone,
  ShoppingBag,
  Users,
  GitBranch,
  ClipboardList,
  BarChart3,
  Target,
  Warehouse,
  Leaf,
  Factory,
  Package,
  BoxSelect,
  Truck,
  FlaskConical,
  DollarSign,
  ArrowDownToLine,
  ArrowUpFromLine,
  Calculator,
  HardHat,
  PieChart,
  Bot,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Brain,
  Settings,
  Server,
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
      { label: 'Chat', href: '/chat', icon: MessageSquare, accent: '#06B6D4' },
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, accent: '#667EEA' },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Email', href: '/email', icon: Mail, accent: '#3B82F6' },
      { label: 'Calendar', href: '/calendar', icon: CalendarDays, accent: '#3B82F6' },
      { label: 'Tasks', href: '/tasks', icon: CheckSquare, accent: '#8B5CF6' },
      { label: 'Projects', href: '/projects', icon: FolderKanban, accent: '#7C3AED' },
      { label: 'Meetings', href: '/meetings', icon: Video, accent: '#2563EB' },
      { label: 'Docs', href: '/docs', icon: FileText, accent: '#64748B' },
      { label: 'Team', href: '/team', icon: UsersRound, accent: '#0D9488' },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      { label: 'Content Creator', href: '/content-creator', icon: Wand2, accent: '#EC4899' },
      { label: 'Content Calendar', href: '/content-calendar', icon: CalendarRange, accent: '#EC4899' },
      { label: 'Social Media', href: '/social', icon: Share2, accent: '#EC4899' },
      { label: 'Email Marketing', href: '/email-marketing', icon: SendHorizonal, accent: '#EC4899' },
      { label: 'SEO / Blog', href: '/seo', icon: Search, accent: '#EC4899' },
      { label: 'Events', href: '/events', icon: PartyPopper, accent: '#EC4899' },
      { label: 'Paid Ads', href: '/paid-ads', icon: Megaphone, accent: '#EC4899' },
      { label: 'Merchandise', href: '/merch', icon: ShoppingBag, accent: '#EC4899' },
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
      { label: 'Inventory', href: '/inventory', icon: Warehouse, accent: '#8B5CF6' },
      { label: 'Cultivation', href: '/cultivation', icon: Leaf, accent: '#22C55E' },
      { label: 'Manufacturing', href: '/manufacturing', icon: Factory, accent: '#10B981' },
      { label: 'Packaging', href: '/packaging', icon: Package, accent: '#84CC16' },
      { label: 'Fulfillment', href: '/fulfillment', icon: BoxSelect, accent: '#14B8A6' },
      { label: 'Delivery', href: '/delivery', icon: Truck, accent: '#0EA5E9' },
      { label: 'Products & R&D', href: '/products', icon: FlaskConical, accent: '#DB2777' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Finance Dashboard', href: '/finance', icon: DollarSign, accent: '#059669' },
      { label: 'Accounts Receivable', href: '/ar', icon: ArrowDownToLine, accent: '#059669' },
      { label: 'Accounts Payable', href: '/ap', icon: ArrowUpFromLine, accent: '#059669' },
      { label: 'Budget & Planning', href: '/budget', icon: Calculator, accent: '#059669' },
      { label: 'Labor & Payroll', href: '/labor', icon: HardHat, accent: '#059669' },
      { label: 'Reports', href: '/reports', icon: PieChart, accent: '#475569' },
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
    title: 'ADMIN',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings, accent: '#94A3B8' },
      { label: 'System', href: '/system', icon: Server, accent: '#64748B' },
    ],
  },
];
