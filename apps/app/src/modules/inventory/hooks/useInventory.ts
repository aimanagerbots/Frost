import { useQuery } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: ['inventory', 'products', filter],
    queryFn: async () => {
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
  });
}

export function useBatches(tab?: BatchFilterTab) {
  return useQuery({
    queryKey: ['inventory', 'batches', tab],
    queryFn: async () => {
      await delay(300);
      let items = [...MOCK_BATCHES];
      if (tab === 'available-for-sale') items = items.filter(b => b.unitsForSale > 0);
      else if (tab === 'not-for-sale') items = items.filter(b => b.status === 'not-for-sale');
      else if (tab === 'excluded') items = items.filter(b => b.status === 'excluded');
      return items;
    },
  });
}

export function useStrains() {
  return useQuery({
    queryKey: ['inventory', 'strains'],
    queryFn: async () => { await delay(200); return [...MOCK_STRAINS]; },
  });
}

export function useQAResults(tab?: QAFilterTab) {
  return useQuery({
    queryKey: ['inventory', 'qa-results', tab],
    queryFn: async () => {
      await delay(350);
      let items = [...MOCK_QA_RESULTS];
      if (tab === 'passed') items = items.filter(q => q.status === 'passed');
      else if (tab === 'failed') items = items.filter(q => q.status === 'failed');
      else if (tab === 'pending') items = items.filter(q => q.status === 'pending');
      return items;
    },
  });
}

export function useDiscounts() {
  return useQuery({
    queryKey: ['inventory', 'discounts'],
    queryFn: async () => { await delay(250); return [...MOCK_DISCOUNTS]; },
  });
}

export function useRooms() {
  return useQuery({
    queryKey: ['inventory', 'rooms'],
    queryFn: async () => { await delay(200); return [...MOCK_ROOMS]; },
  });
}

export function useProductLines() {
  return useQuery({
    queryKey: ['inventory', 'product-lines'],
    queryFn: async () => { await delay(200); return [...MOCK_PRODUCT_LINES]; },
  });
}

export function useInventoryCategories() {
  return useQuery({
    queryKey: ['inventory', 'categories'],
    queryFn: async () => { await delay(200); return [...MOCK_CATEGORIES]; },
  });
}

export function useCatalogGroups() {
  return useQuery({
    queryKey: ['inventory', 'catalog-groups'],
    queryFn: async () => { await delay(200); return [...MOCK_CATALOG_GROUPS]; },
  });
}

export function useBackorders() {
  return useQuery({
    queryKey: ['inventory', 'backorders'],
    queryFn: async () => { await delay(250); return [...MOCK_BACKORDERS]; },
  });
}

export function useQALots() {
  return useQuery({
    queryKey: ['inventory', 'qa-lots'],
    queryFn: async () => { await delay(250); return [...MOCK_QA_LOTS]; },
  });
}

export function useQASamples() {
  return useQuery({
    queryKey: ['inventory', 'qa-samples'],
    queryFn: async () => { await delay(250); return [...MOCK_QA_SAMPLES]; },
  });
}

export function useEmployeeSamples() {
  return useQuery({
    queryKey: ['inventory', 'employee-samples'],
    queryFn: async () => { await delay(200); return [...MOCK_EMPLOYEE_SAMPLES]; },
  });
}

export function useDisposals() {
  return useQuery({
    queryKey: ['inventory', 'disposals'],
    queryFn: async () => { await delay(250); return [...MOCK_DISPOSALS]; },
  });
}

export function useProductTags() {
  return useQuery({
    queryKey: ['inventory', 'product-tags'],
    queryFn: async () => { await delay(150); return [...MOCK_PRODUCT_TAGS]; },
  });
}

export function useConversions() {
  return useQuery({
    queryKey: ['inventory', 'conversions'],
    queryFn: async () => { await delay(200); return [...MOCK_CONVERSIONS]; },
  });
}

export function useProductionRuns() {
  return useQuery({
    queryKey: ['inventory', 'production-runs'],
    queryFn: async () => { await delay(250); return [...MOCK_PRODUCTION_RUNS]; },
  });
}

export function useNonCannabisInventory() {
  return useQuery({
    queryKey: ['inventory', 'non-cannabis'],
    queryFn: async () => { await delay(300); return [...MOCK_NON_CANNABIS]; },
  });
}

export function useManageMenu(tab?: ManageMenuFilterTab) {
  return useQuery({
    queryKey: ['inventory', 'manage-menu', tab],
    queryFn: async () => {
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
  });
}
