export interface SubNavItem {
  label: string;
  tab: string;
  sub?: string;
}

/**
 * Maps module base paths to their sub-category tabs.
 * Used by tab-based categories to render sidebar items
 * and by modules that have internal tab navigation.
 */
export const MODULE_SUB_CATEGORIES: Record<string, SubNavItem[]> = {
  '/crm': [
    { label: 'Overview', tab: 'overview', sub: 'dashboard' },
    { label: 'Accounts', tab: 'accounts', sub: 'accounts' },
    { label: 'Sales', tab: 'sales', sub: 'opportunities' },
    { label: 'Outreach', tab: 'outreach', sub: 'interactions' },
    { label: 'Intelligence', tab: 'intelligence', sub: 'analytics' },
    { label: 'Tools', tab: 'tools', sub: 'playbooks' },
  ],
  '/chat': [
    { label: 'AI Chat', tab: 'ai' },
    { label: 'Team Chat', tab: 'dm' },
  ],
  '/cultivation': [
    { label: 'Environment', tab: 'environment' },
    { label: 'Tasks', tab: 'tasks' },
    { label: 'Calendar', tab: 'calendar' },
    { label: 'Supplies', tab: 'supplies' },
    { label: 'Genetics', tab: 'genetics' },
    { label: 'AI Chat', tab: 'chat' },
  ],
  '/manufacturing': [
    { label: 'Dashboard', tab: 'dashboard' },
    { label: 'Work Orders', tab: 'work-orders' },
    { label: 'Production Lines', tab: 'production-lines' },
    { label: 'Batch Tracker', tab: 'batch-tracker' },
    { label: 'Equipment', tab: 'equipment' },
  ],
  '/inventory': [
    { label: 'Manage Menu Batches', tab: 'menu-batches' },
    { label: 'Non-Cannabis Inventory', tab: 'non-cannabis' },
    { label: 'Production Categories', tab: 'production-categories' },
    { label: 'Product Lines', tab: 'product-lines' },
    { label: 'Products Catalog Groups', tab: 'products-catalog' },
    { label: 'Strains', tab: 'strains' },
    { label: 'Inventory Rooms', tab: 'rooms' },
    { label: 'Discount & Promotion', tab: 'discounts' },
    { label: 'Back Orders', tab: 'back-orders' },
    { label: 'QA Result', tab: 'qa-result' },
    { label: 'Conversions for Orders', tab: 'conversions' },
    { label: 'Product Tag', tab: 'product-tag' },
    { label: 'QA Lot', tab: 'qa-lot' },
    { label: 'QA Sample', tab: 'qa-sample' },
    { label: 'Employee Sample', tab: 'employee-sample' },
    { label: 'Disposal', tab: 'disposal' },
  ],
};

/**
 * Given a pathname, returns the matching sub-categories and the module base path.
 * Returns null if the current module has no sub-categories.
 */
export function getSubCategories(pathname: string): {
  basePath: string;
  items: SubNavItem[];
} | null {
  for (const [basePath, items] of Object.entries(MODULE_SUB_CATEGORIES)) {
    if (pathname === basePath || pathname.startsWith(basePath + '/')) {
      return { basePath, items };
    }
  }
  return null;
}
