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
import { ACCENT } from '@/design/colors';

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
      { label: 'Chat', href: '/chat', icon: MessageSquare, accent: ACCENT },
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, accent: ACCENT },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Email', href: '/email', icon: Mail, accent: ACCENT },
      { label: 'Calendar', href: '/calendar', icon: CalendarDays, accent: ACCENT },
      { label: 'Tasks', href: '/tasks', icon: CheckSquare, accent: ACCENT },
      { label: 'Projects', href: '/projects', icon: FolderKanban, accent: ACCENT },
      { label: 'Meetings', href: '/meetings', icon: Video, accent: ACCENT },
      { label: 'Docs', href: '/docs', icon: FileText, accent: ACCENT },
      { label: 'Team', href: '/team', icon: UsersRound, accent: ACCENT },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      { label: 'Content Creator', href: '/content-creator', icon: Wand2, accent: ACCENT },
      { label: 'Content Calendar', href: '/content-calendar', icon: CalendarRange, accent: ACCENT },
      { label: 'Social Media', href: '/social', icon: Share2, accent: ACCENT },
      { label: 'Email Marketing', href: '/email-marketing', icon: SendHorizonal, accent: ACCENT },
      { label: 'SEO / Blog', href: '/seo', icon: Search, accent: ACCENT },
      { label: 'Events', href: '/events', icon: PartyPopper, accent: ACCENT },
      { label: 'Paid Ads', href: '/paid-ads', icon: Megaphone, accent: ACCENT },
      { label: 'Merchandise', href: '/merch', icon: ShoppingBag, accent: ACCENT },
    ],
  },
  {
    title: 'SALES & CRM',
    items: [
      { label: 'CRM', href: '/crm', icon: Users, accent: ACCENT },
      { label: 'Pipeline', href: '/pipeline', icon: GitBranch, accent: ACCENT },
      { label: 'Orders', href: '/orders', icon: ClipboardList, accent: ACCENT },
      { label: 'VMI', href: '/vmi', icon: BarChart3, accent: ACCENT },
      { label: 'Competitor Intel', href: '/competitors', icon: Target, accent: ACCENT },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Inventory', href: '/inventory', icon: Warehouse, accent: ACCENT },
      { label: 'Cultivation', href: '/cultivation', icon: Leaf, accent: ACCENT },
      { label: 'Manufacturing', href: '/manufacturing', icon: Factory, accent: ACCENT },
      { label: 'Packaging', href: '/packaging', icon: Package, accent: ACCENT },
      { label: 'Fulfillment', href: '/fulfillment', icon: BoxSelect, accent: ACCENT },
      { label: 'Delivery', href: '/delivery', icon: Truck, accent: ACCENT },
      { label: 'Products & R&D', href: '/products', icon: FlaskConical, accent: ACCENT },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Finance Dashboard', href: '/finance', icon: DollarSign, accent: ACCENT },
      { label: 'Accounts Receivable', href: '/ar', icon: ArrowDownToLine, accent: ACCENT },
      { label: 'Accounts Payable', href: '/ap', icon: ArrowUpFromLine, accent: ACCENT },
      { label: 'Budget & Planning', href: '/budget', icon: Calculator, accent: ACCENT },
      { label: 'Labor & Payroll', href: '/labor', icon: HardHat, accent: ACCENT },
      { label: 'Reports', href: '/reports', icon: PieChart, accent: ACCENT },
    ],
  },
  {
    title: 'AI & KNOWLEDGE',
    items: [
      { label: 'Agent Hub', href: '/agents', icon: Bot, accent: ACCENT },
      { label: 'Approvals', href: '/approvals', icon: ShieldCheck, accent: ACCENT },
      { label: 'Council', href: '/council', icon: BookOpen, accent: ACCENT },
      { label: 'Insights', href: '/insights', icon: Sparkles, accent: ACCENT },
      { label: 'Memory', href: '/memory', icon: Brain, accent: ACCENT },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings, accent: ACCENT },
      { label: 'System', href: '/system', icon: Server, accent: ACCENT },
    ],
  },
];
