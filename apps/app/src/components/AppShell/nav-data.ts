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
  LineChart,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { ACCENT } from '@/design/colors';

/* ── Types ─────────────────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
  slug: string;
  icon: LucideIcon;
  accent: string;
}

export interface SubItem {
  label: string;
  tab: string;
  sub?: string;
}

export interface NavCategory {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Route-based categories: each item is a separate page */
  items: NavItem[];
  /** Frost-only extra route items rendered below a separator in the sidebar */
  extraItems?: NavItem[];
  /** Tab-based categories: sidebar items are tabs within a single route */
  tabRoute?: string;
  tabs?: SubItem[];
  /** Frost-only extra tabs rendered below a separator in the sidebar */
  extraTabs?: SubItem[];
  /** true = mirrors Cultivera structure, false = Frost-only module */
  cultivera?: boolean;
}


/* ── Categories ────────────────────────────────────────────────────── */

export const categories: NavCategory[] = [
  /* ── 1. Grow (Cultivera Module 1) ─────────────────────────────── */
  {
    key: 'grow',
    label: 'Grow',
    icon: Leaf,
    cultivera: true,
    items: [],
    tabRoute: '/cultivation',
    tabs: [
      { label: 'Overview', tab: 'overview' },
      { label: 'Dashboard', tab: 'dashboard' },
      { label: 'Grow Cycles', tab: 'grow-cycles' },
      { label: 'Plants', tab: 'plants' },
      { label: 'Grow Sources', tab: 'grow-sources' },
      { label: 'Rooms', tab: 'rooms' },
      { label: 'Harvest', tab: 'harvest' },
      { label: 'QA Lot', tab: 'qa-lot' },
      { label: 'QA Sample', tab: 'qa-sample' },
      { label: 'Disposal', tab: 'disposal' },
    ],
    extraTabs: [
      { label: 'Environment', tab: 'environment' },
      { label: 'Tasks', tab: 'tasks' },
      { label: 'Calendar', tab: 'calendar' },
      { label: 'Supplies', tab: 'supplies' },
      { label: 'AI Chat', tab: 'chat' },
    ],
  },

  /* ── 2. Analytics (Cultivera Module 2) — NEW ───────────────────── */
  {
    key: 'analytics',
    label: 'Analytics',
    icon: LineChart,
    cultivera: true,
    items: [],
    tabRoute: '/analytics',
    tabs: [
      { label: 'Client By Product', tab: 'client-by-product' },
      { label: 'Product By Client', tab: 'product-by-client' },
      { label: 'Expected Days of Inventory', tab: 'expected-days' },
      { label: 'Harvest Yield', tab: 'harvest-yield' },
      { label: 'Last Ordered By Account', tab: 'last-ordered' },
      { label: 'Monthly Sales (12mo)', tab: 'monthly-sales' },
      { label: 'Monthly Sales Comparison', tab: 'monthly-comparison' },
      { label: 'Sales By Person', tab: 'sales-by-person' },
      { label: 'Production Run I/O', tab: 'production-io' },
      { label: 'Product-Line Sales by Account', tab: 'product-line-sales' },
      { label: 'Sales Recommendations', tab: 'sales-recommendations' },
    ],
  },

  /* ── 3. Sales (Cultivera Module 3) ─────────────────────────────── */
  {
    key: 'sales',
    label: 'Sales',
    icon: Users,
    cultivera: true,
    items: [
      { label: 'Dashboard', href: '/sales-dashboard', slug: 'sales-dashboard', icon: LayoutDashboard, accent: ACCENT },
      { label: 'Accounts', href: '/accounts', slug: 'accounts', icon: Users, accent: ACCENT },
      { label: 'Account Groups', href: '/account-groups', slug: 'account-groups', icon: UsersRound, accent: ACCENT },
      { label: 'Carts', href: '/carts', slug: 'carts', icon: ShoppingBag, accent: ACCENT },
      { label: 'Inventory', href: '/vmi', slug: 'vmi', icon: BarChart3, accent: ACCENT },
      { label: 'Catalogs', href: '/catalogs', slug: 'catalogs', icon: BookOpen, accent: ACCENT },
      { label: 'Orders', href: '/orders', slug: 'orders', icon: ClipboardList, accent: ACCENT },
      { label: 'Sales Person Report', href: '/sales-person-report', slug: 'sales-person-report', icon: PieChart, accent: ACCENT },
      { label: 'Order Summary', href: '/order-summary', slug: 'order-summary', icon: FileText, accent: ACCENT },
    ],
    extraItems: [
      { label: 'CRM', href: '/crm', slug: 'crm', icon: Users, accent: ACCENT },
      { label: 'Pipeline', href: '/pipeline', slug: 'pipeline', icon: GitBranch, accent: ACCENT },
      { label: 'Competitor Intel', href: '/competitors', slug: 'competitors', icon: Target, accent: ACCENT },
      { label: 'Cultivera', href: '/cultivera', slug: 'cultivera', icon: Store, accent: '#22D3EE' },
    ],
  },

  /* ── 4. Inventory Management (Cultivera Module 4) ──────────────── */
  {
    key: 'inventory',
    label: 'Inventory Mgmt',
    icon: Warehouse,
    cultivera: true,
    items: [
      { label: 'Products & R&D', href: '/products', slug: 'products', icon: FlaskConical, accent: ACCENT },
    ],
    tabRoute: '/inventory',
    tabs: [
      { label: 'Manage Menu', tab: 'menu-batches' },
      { label: 'Batches', tab: 'batches' },
      { label: 'Non-Cannabis Inventory', tab: 'non-cannabis' },
      { label: 'Production (BOMs)', tab: 'production-categories' },
      { label: 'Categories', tab: 'categories' },
      { label: 'Product Lines', tab: 'product-lines' },
      { label: 'Products', tab: 'products-tab' },
      { label: 'Catalog Groups', tab: 'products-catalog' },
      { label: 'Strains', tab: 'strains' },
      { label: 'Inventory Rooms', tab: 'rooms' },
      { label: 'Discount & Promotion', tab: 'discounts' },
      { label: 'Backorders', tab: 'back-orders' },
      { label: 'QA Result (COA)', tab: 'qa-result' },
      { label: 'Conversions for Orders', tab: 'conversions' },
      { label: 'Product Tag', tab: 'product-tag' },
      { label: 'QA Lot', tab: 'qa-lot' },
      { label: 'QA Sample', tab: 'qa-sample' },
      { label: 'Employee Sample', tab: 'employee-sample' },
      { label: 'Disposal', tab: 'disposal' },
    ],
  },

  /* ── 5. Fulfillment (Cultivera Module 5) ───────────────────────── */
  {
    key: 'fulfillment',
    label: 'Fulfillment',
    icon: BoxSelect,
    cultivera: true,
    items: [],
    tabRoute: '/fulfillment',
    tabs: [
      { label: 'Orders', tab: 'orders' },
      { label: 'Vehicles', tab: 'vehicles' },
      { label: 'Drivers', tab: 'drivers' },
      { label: 'Delivery Agents', tab: 'delivery-agents' },
      { label: 'Quarantine Schedule', tab: 'quarantine-schedule' },
      { label: 'Delivery Schedule', tab: 'delivery-schedule' },
      { label: 'Transfer Inbound', tab: 'transfer-inbound' },
      { label: 'Transfer Outbound', tab: 'transfer-outbound' },
    ],
    extraTabs: [
      { label: 'Delivery', tab: 'delivery' },
    ],
  },

  /* ── 6. Configuration (Cultivera Module 6) ─────────────────────── */
  {
    key: 'config',
    label: 'Configuration',
    icon: Settings,
    cultivera: true,
    items: [
      { label: 'Account Management', href: '/account-management', slug: 'account-management', icon: UserCog, accent: ACCENT },
      { label: 'Marketplace Settings', href: '/marketplace-settings', slug: 'marketplace-settings', icon: ShoppingBag, accent: ACCENT },
      { label: 'Client Note Attributes', href: '/client-note-attributes', slug: 'client-note-attributes', icon: FileText, accent: ACCENT },
      { label: 'Statuses', href: '/statuses', slug: 'statuses', icon: CheckSquare, accent: ACCENT },
      { label: 'Notifications', href: '/notifications', slug: 'notifications', icon: MessageSquare, accent: ACCENT },
      { label: 'Routes', href: '/delivery-routes', slug: 'delivery-routes', icon: Truck, accent: ACCENT },
      { label: 'Users', href: '/users', slug: 'users', icon: UserCog, accent: ACCENT },
      { label: 'Roles', href: '/roles', slug: 'roles', icon: ShieldCheck, accent: ACCENT },
      { label: 'Audit', href: '/audit', slug: 'audit', icon: Search, accent: ACCENT },
      { label: 'Sync Settings', href: '/sync-settings', slug: 'sync-settings', icon: Settings, accent: ACCENT },
      { label: 'Locations', href: '/locations', slug: 'locations', icon: Target, accent: ACCENT },
      { label: 'Chart of Accounts', href: '/chart-of-accounts', slug: 'chart-of-accounts', icon: PieChart, accent: ACCENT },
      { label: 'QuickBooks', href: '/quickbooks', slug: 'quickbooks', icon: Calculator, accent: ACCENT },
      { label: 'API Key', href: '/api-key', slug: 'api-key', icon: Server, accent: ACCENT },
      // Frost extras
      { label: 'Settings', href: '/settings', slug: 'settings', icon: Settings, accent: ACCENT },
      { label: 'System', href: '/system', slug: 'system', icon: Server, accent: ACCENT },
    ],
  },

  /* ── Frost-only modules (cultivera: false) ──────────────────────── */

  {
    key: 'workspace',
    label: 'Workspace',
    icon: LayoutDashboard,
    cultivera: false,
    items: [
      { label: 'Dashboard', href: '/dashboard', slug: 'dashboard', icon: LayoutDashboard, accent: ACCENT },
      { label: 'Chat', href: '/chat', slug: 'chat', icon: MessageSquare, accent: ACCENT },
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
    key: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    cultivera: false,
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
    key: 'manufacturing',
    label: 'Manufacturing',
    icon: Factory,
    cultivera: false,
    items: [],
    tabRoute: '/manufacturing',
    tabs: [
      { label: 'Dashboard', tab: 'dashboard' },
      { label: 'Work Orders', tab: 'work-orders' },
      { label: 'Production Lines', tab: 'production-lines' },
      { label: 'Batch Tracker', tab: 'batch-tracker' },
      { label: 'Equipment', tab: 'equipment' },
    ],
  },
  {
    key: 'packaging',
    label: 'Packaging',
    icon: Package,
    cultivera: false,
    items: [],
    tabRoute: '/packaging',
    tabs: [
      { label: 'Dashboard', tab: 'dashboard' },
      { label: 'Work Orders', tab: 'work-orders' },
      { label: 'Packaging Lines', tab: 'packaging-lines' },
      { label: 'Equipment', tab: 'equipment' },
      { label: 'Order Tracker', tab: 'order-tracker' },
    ],
  },
  {
    key: 'accounting',
    label: 'Accounting',
    icon: DollarSign,
    cultivera: false,
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
    key: 'ai',
    label: 'AI',
    icon: Bot,
    cultivera: false,
    items: [
      { label: 'Agent Hub', href: '/agents', slug: 'agents', icon: Bot, accent: ACCENT },
      { label: 'Approvals', href: '/approvals', slug: 'approvals', icon: ShieldCheck, accent: ACCENT },
      { label: 'Council', href: '/council', slug: 'council', icon: BookOpen, accent: ACCENT },
      { label: 'Insights', href: '/insights', slug: 'insights', icon: Sparkles, accent: ACCENT },
      { label: 'Memory', href: '/memory', slug: 'memory', icon: Brain, accent: ACCENT },
    ],
  },
];

/* ── Helpers ────────────────────────────────────────────────────────── */

/** Determine which category the current pathname belongs to */
export function getCategoryForPath(pathname: string): NavCategory | null {
  for (const cat of categories) {
    // Check tab-based route match
    if (cat.tabRoute && (pathname === cat.tabRoute || pathname.startsWith(cat.tabRoute + '/'))) {
      return cat;
    }
    // Check route-based item match (items + extraItems)
    const allItems = [...cat.items, ...(cat.extraItems ?? [])];
    if (allItems.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))) {
      return cat;
    }
  }
  // Default to Workspace
  return categories.find(c => c.key === 'workspace') ?? null;
}

/** Set of all module slugs — used by demo mode to grant access to everything */
export const ALL_MODULE_SLUGS: Set<string> = new Set([
  // Route-based module slugs
  ...categories.flatMap((c) => [...c.items, ...(c.extraItems ?? [])].map((i) => i.slug)),
  // Tab-based module slugs (derived from tabRoute)
  ...categories
    .filter((c) => c.tabRoute)
    .map((c) => c.tabRoute!.replace('/', '')),
  // Dashboard (not in any category but still a valid module)
  'dashboard',
]);
