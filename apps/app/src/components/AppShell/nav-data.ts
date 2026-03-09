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
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import { ACCENT } from '@/design/colors';

export interface NavItem {
  label: string;
  href: string;
  slug: string;
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
      { label: 'Chat', href: '/chat', slug: 'chat', icon: MessageSquare, accent: ACCENT },
      { label: 'Dashboard', href: '/dashboard', slug: 'dashboard', icon: LayoutDashboard, accent: ACCENT },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Email', href: '/email', slug: 'email', icon: Mail, accent: ACCENT },
      { label: 'Calendar', href: '/calendar', slug: 'calendar', icon: CalendarDays, accent: ACCENT },
      { label: 'Tasks', href: '/tasks', slug: 'tasks', icon: CheckSquare, accent: ACCENT },
      { label: 'Projects', href: '/projects', slug: 'projects', icon: FolderKanban, accent: ACCENT },
      { label: 'Meetings', href: '/meetings', slug: 'meetings', icon: Video, accent: ACCENT },
      { label: 'Docs', href: '/docs', slug: 'docs', icon: FileText, accent: ACCENT },
      { label: 'Team', href: '/team', slug: 'team', icon: UsersRound, accent: ACCENT },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      { label: 'Content Creator', href: '/content-creator', slug: 'content-creator', icon: Wand2, accent: ACCENT },
      { label: 'Content Calendar', href: '/content-calendar', slug: 'content-calendar', icon: CalendarRange, accent: ACCENT },
      { label: 'Social Media', href: '/social', slug: 'social', icon: Share2, accent: ACCENT },
      { label: 'Email Marketing', href: '/email-marketing', slug: 'email-marketing', icon: SendHorizonal, accent: ACCENT },
      { label: 'SEO / Blog', href: '/seo', slug: 'seo', icon: Search, accent: ACCENT },
      { label: 'Events', href: '/events', slug: 'events', icon: PartyPopper, accent: ACCENT },
      { label: 'Paid Ads', href: '/paid-ads', slug: 'paid-ads', icon: Megaphone, accent: ACCENT },
      { label: 'Merchandise', href: '/merch', slug: 'merch', icon: ShoppingBag, accent: ACCENT },
    ],
  },
  {
    title: 'SALES & CRM',
    items: [
      { label: 'CRM', href: '/crm', slug: 'crm', icon: Users, accent: ACCENT },
      { label: 'Pipeline', href: '/pipeline', slug: 'pipeline', icon: GitBranch, accent: ACCENT },
      { label: 'Orders', href: '/orders', slug: 'orders', icon: ClipboardList, accent: ACCENT },
      { label: 'VMI', href: '/vmi', slug: 'vmi', icon: BarChart3, accent: ACCENT },
      { label: 'Competitor Intel', href: '/competitors', slug: 'competitors', icon: Target, accent: ACCENT },
    ],
  },
  {
    title: 'DIVISIONS',
    items: [
      { label: 'Inventory', href: '/inventory', slug: 'inventory', icon: Warehouse, accent: ACCENT },
      { label: 'Cultivation', href: '/cultivation', slug: 'cultivation', icon: Leaf, accent: ACCENT },
      { label: 'Manufacturing', href: '/manufacturing', slug: 'manufacturing', icon: Factory, accent: ACCENT },
      { label: 'Packaging', href: '/packaging', slug: 'packaging', icon: Package, accent: ACCENT },
      { label: 'Fulfillment', href: '/fulfillment', slug: 'fulfillment', icon: BoxSelect, accent: ACCENT },
      { label: 'Delivery', href: '/delivery', slug: 'delivery', icon: Truck, accent: ACCENT },
      { label: 'Products & R&D', href: '/products', slug: 'products', icon: FlaskConical, accent: ACCENT },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Finance Dashboard', href: '/finance', slug: 'finance', icon: DollarSign, accent: ACCENT },
      { label: 'Accounts Receivable', href: '/ar', slug: 'ar', icon: ArrowDownToLine, accent: ACCENT },
      { label: 'Accounts Payable', href: '/ap', slug: 'ap', icon: ArrowUpFromLine, accent: ACCENT },
      { label: 'Budget & Planning', href: '/budget', slug: 'budget', icon: Calculator, accent: ACCENT },
      { label: 'Labor & Payroll', href: '/labor', slug: 'labor', icon: HardHat, accent: ACCENT },
      { label: 'Reports', href: '/reports', slug: 'reports', icon: PieChart, accent: ACCENT },
    ],
  },
  {
    title: 'AI & KNOWLEDGE',
    items: [
      { label: 'Agent Hub', href: '/agents', slug: 'agents', icon: Bot, accent: ACCENT },
      { label: 'Approvals', href: '/approvals', slug: 'approvals', icon: ShieldCheck, accent: ACCENT },
      { label: 'Council', href: '/council', slug: 'council', icon: BookOpen, accent: ACCENT },
      { label: 'Insights', href: '/insights', slug: 'insights', icon: Sparkles, accent: ACCENT },
      { label: 'Memory', href: '/memory', slug: 'memory', icon: Brain, accent: ACCENT },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { label: 'Settings', href: '/settings', slug: 'settings', icon: Settings, accent: ACCENT },
      { label: 'Users', href: '/users', slug: 'users', icon: UserCog, accent: ACCENT },
      { label: 'System', href: '/system', slug: 'system', icon: Server, accent: ACCENT },
    ],
  },
];

/** Set of all module slugs — used by demo mode to grant access to everything */
export const ALL_MODULE_SLUGS: Set<string> = new Set(
  navGroups.flatMap((g) => g.items.map((i) => i.slug)),
);
