import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ManufacturingView } from './types';

interface ManufacturingStore {
  activeView: ManufacturingView;
  selectedWorkOrderId: string | null;
  setView: (view: ManufacturingView) => void;
  selectWorkOrder: (id: string | null) => void;
}

export const useManufacturingStore = create<ManufacturingStore>((set) => ({
  activeView: 'dashboard',
  selectedWorkOrderId: null,
  setView: (view) => set({ activeView: view, selectedWorkOrderId: null }),
  selectWorkOrder: (id) => set({ selectedWorkOrderId: id }),
}));

// ── Work Order Board Columns ─────────────────────────────────
export interface WorkOrderBoardColumn {
  id: string;
  title: string;
  color: string;
}

const DEFAULT_WO_COLUMNS: WorkOrderBoardColumn[] = [
  { id: 'queued', title: 'Queued', color: '#FBBF24' },
  { id: 'in-progress', title: 'In Progress', color: '#10B981' },
  { id: 'blocked', title: 'Blocked', color: '#EF4444' },
  { id: 'completed', title: 'Completed', color: '#22C55E' },
];

const PROTECTED_WO_COLUMNS = new Set(['queued', 'in-progress', 'blocked', 'completed']);

interface WorkOrderBoardStore {
  columns: WorkOrderBoardColumn[];
  isProtected: (id: string) => boolean;
  addColumn: (title: string) => void;
  renameColumn: (id: string, title: string) => void;
  removeColumn: (id: string) => void;
}

export const useWorkOrderBoardStore = create<WorkOrderBoardStore>()(
  persist(
    (set) => ({
      columns: DEFAULT_WO_COLUMNS,
      isProtected: (id) => PROTECTED_WO_COLUMNS.has(id),
      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: `custom-${Date.now()}`, title, color: '#94A3B8' },
          ],
        })),
      renameColumn: (id, title) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title } : col
          ),
        })),
      removeColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
        })),
    }),
    { name: 'frost-wo-board-columns' }
  )
);
