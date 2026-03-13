import { useDemoQuery } from '@/lib/use-demo-query';
import type { ProductFilter, QAFilterTab, BatchFilterTab, ManageMenuFilterTab } from '@/modules/inventory/types';
import {
  MOCK_PRODUCTS, MOCK_BATCHES, MOCK_STRAINS, MOCK_QA_RESULTS, MOCK_DISCOUNTS,
  MOCK_ROOMS, MOCK_PRODUCT_LINES, MOCK_CATEGORIES, MOCK_CATALOG_GROUPS,
  MOCK_BACKORDERS, MOCK_QA_LOTS, MOCK_QA_SAMPLES, MOCK_EMPLOYEE_SAMPLES,
  MOCK_DISPOSALS, MOCK_PRODUCT_TAGS, MOCK_CONVERSIONS, MOCK_PRODUCTION_RUNS,
  MOCK_NON_CANNABIS, MOCK_MANAGE_MENU,
} from '@/mocks/inventory';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function useProducts(filter?: ProductFilter) {
  return useDemoQuery({
    queryKey: ['inventory', 'products', filter],
    demoQueryFn: async () => {
      await delay(300);
      let items = [...MOCK_PRODUCTS];
      if (filter?.tab === 'available-for-sale') items = items.filter(p => p.availableForSale > 0);
      else if (filter?.tab === 'not-for-sale') items = items.filter(p => p.status === 'not-for-sale');
      else if (filter?.tab === 'available-on-portal') items = items.filter(p => p.showAsDOHCompliant);
      else if (filter?.tab === 'active') items = items.filter(p => p.status === 'active');
      else if (filter?.tab === 'discontinued') items = items.filter(p => p.status === 'discontinued');
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        items = items.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      }
      if (filter?.productLine) items = items.filter(p => p.productLine === filter.productLine);
      return items;
    },
    emptyValue: [] as typeof MOCK_PRODUCTS,
  });
}

export function useBatches(tab?: BatchFilterTab) {
  return useDemoQuery({
    queryKey: ['inventory', 'batches', tab],
    demoQueryFn: async () => {
      await delay(300);
      let items = [...MOCK_BATCHES];
      if (tab === 'available-for-sale') items = items.filter(b => b.unitsForSale > 0);
      else if (tab === 'not-for-sale') items = items.filter(b => b.status === 'not-for-sale');
      else if (tab === 'excluded') items = items.filter(b => b.status === 'excluded');
      return items;
    },
    emptyValue: [] as typeof MOCK_BATCHES,
  });
}

export function useStrains() {
  return useDemoQuery({
    queryKey: ['inventory', 'strains'],
    demoQueryFn: async () => { await delay(200); return [...MOCK_STRAINS]; },
    emptyValue: [] as typeof MOCK_STRAINS,
  });
}

export function useQAResults(tab?: QAFilterTab) {
  return useDemoQuery({
    queryKey: ['inventory', 'qa-results', tab],
    demoQueryFn: async () => {
      await delay(350);
      let items = [...MOCK_QA_RESULTS];
      if (tab === 'passed') items = items.filter(q => q.status === 'passed');
      else if (tab === 'failed') items = items.filter(q => q.status === 'failed');
      else if (tab === 'pending') items = items.filter(q => q.status === 'pending');
      return items;
    },
    emptyValue: [] as typeof MOCK_QA_RESULTS,
  });
}

export function useDiscounts() {
  return useDemoQuery({
    queryKey: ['inventory', 'discounts'],
    demoQueryFn: async () => { await delay(250); return [...MOCK_DISCOUNTS]; },
    emptyValue: [] as typeof MOCK_DISCOUNTS,
  });
}

export function useRooms() {
  return useDemoQuery({
    queryKey: ['inventory', 'rooms'],
    demoQueryFn: async () => { await delay(200); return [...MOCK_ROOMS]; },
    emptyValue: [] as typeof MOCK_ROOMS,
  });
}

export function useProductLines() {
  return useDemoQuery({
    queryKey: ['inventory', 'product-lines'],
    demoQueryFn: async () => { await delay(200); return [...MOCK_PRODUCT_LINES]; },
    emptyValue: [] as typeof MOCK_PRODUCT_LINES,
  });
}

export function useInventoryCategories() {
  return useDemoQuery({
    queryKey: ['inventory', 'categories'],
    demoQueryFn: async () => { await delay(200); return [...MOCK_CATEGORIES]; },
    emptyValue: [] as typeof MOCK_CATEGORIES,
  });
}

export function useCatalogGroups() {
  return useDemoQuery({
    queryKey: ['inventory', 'catalog-groups'],
    demoQueryFn: async () => { await delay(200); return [...MOCK_CATALOG_GROUPS]; },
    emptyValue: [] as typeof MOCK_CATALOG_GROUPS,
  });
}

export function useBackorders() {
  return useDemoQuery({
    queryKey: ['inventory', 'backorders'],
    demoQueryFn: async () => { await delay(250); return [...MOCK_BACKORDERS]; },
    emptyValue: [] as typeof MOCK_BACKORDERS,
  });
}

export function useQALots() {
  return useDemoQuery({
    queryKey: ['inventory', 'qa-lots'],
    demoQueryFn: async () => { await delay(250); return [...MOCK_QA_LOTS]; },
    emptyValue: [] as typeof MOCK_QA_LOTS,
  });
}

export function useQASamples() {
  return useDemoQuery({
    queryKey: ['inventory', 'qa-samples'],
    demoQueryFn: async () => { await delay(250); return [...MOCK_QA_SAMPLES]; },
    emptyValue: [] as typeof MOCK_QA_SAMPLES,
  });
}

export function useEmployeeSamples() {
  return useDemoQuery({
    queryKey: ['inventory', 'employee-samples'],
    demoQueryFn: async () => { await delay(200); return [...MOCK_EMPLOYEE_SAMPLES]; },
    emptyValue: [] as typeof MOCK_EMPLOYEE_SAMPLES,
  });
}

export function useDisposals() {
  return useDemoQuery({
    queryKey: ['inventory', 'disposals'],
    demoQueryFn: async () => { await delay(250); return [...MOCK_DISPOSALS]; },
    emptyValue: [] as typeof MOCK_DISPOSALS,
  });
}

export function useProductTags() {
  return useDemoQuery({
    queryKey: ['inventory', 'product-tags'],
    demoQueryFn: async () => { await delay(150); return [...MOCK_PRODUCT_TAGS]; },
    emptyValue: [] as typeof MOCK_PRODUCT_TAGS,
  });
}

export function useConversions() {
  return useDemoQuery({
    queryKey: ['inventory', 'conversions'],
    demoQueryFn: async () => { await delay(200); return [...MOCK_CONVERSIONS]; },
    emptyValue: [] as typeof MOCK_CONVERSIONS,
  });
}

export function useProductionRuns() {
  return useDemoQuery({
    queryKey: ['inventory', 'production-runs'],
    demoQueryFn: async () => { await delay(250); return [...MOCK_PRODUCTION_RUNS]; },
    emptyValue: [] as typeof MOCK_PRODUCTION_RUNS,
  });
}

export function useNonCannabisInventory() {
  return useDemoQuery({
    queryKey: ['inventory', 'non-cannabis'],
    demoQueryFn: async () => { await delay(300); return [...MOCK_NON_CANNABIS]; },
    emptyValue: [] as typeof MOCK_NON_CANNABIS,
  });
}

export function useManageMenu(tab?: ManageMenuFilterTab) {
  return useDemoQuery({
    queryKey: ['inventory', 'manage-menu', tab],
    demoQueryFn: async () => {
      await delay(300);
      let items = [...MOCK_MANAGE_MENU];
      if (tab === 'available-for-sale') items = items.filter(m => m.availableForSale > 0);
      else if (tab === 'not-for-sale') items = items.filter(m => m.status === 'not-for-sale');
      else if (tab === 'available-on-portal') items = items.filter(m => m.availableOnPortal);
      else if (tab === 'active') items = items.filter(m => m.status === 'active');
      else if (tab === 'discontinued') items = items.filter(m => m.status === 'discontinued');
      // 'more-categories' shows all (placeholder for future sub-category filtering)
      return items;
    },
    emptyValue: [] as typeof MOCK_MANAGE_MENU,
  });
}
