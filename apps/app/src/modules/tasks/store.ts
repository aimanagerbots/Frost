import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
}

const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: 'todo', title: 'To Do', color: '#8B5CF6' },
  { id: 'in-progress', title: 'In Progress', color: '#5BB8E6' },
  { id: 'done', title: 'Done', color: '#22C55E' },
  { id: 'blocked', title: 'Blocked', color: '#EF4444' },
];

interface TaskBoardStore {
  columns: BoardColumn[];
  groupBy: 'status' | 'pipeline';
  addColumn: (title: string) => void;
  renameColumn: (id: string, title: string) => void;
  removeColumn: (id: string) => void;
  setGroupBy: (groupBy: 'status' | 'pipeline') => void;
}

export const useTaskBoardStore = create<TaskBoardStore>()(
  persist(
    (set) => ({
      columns: DEFAULT_COLUMNS,
      groupBy: 'status',
      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: `custom-${Date.now()}`,
              title,
              color: '#94A3B8',
            },
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
      setGroupBy: (groupBy) => set({ groupBy }),
    }),
    { name: 'frost-task-board-columns' }
  )
);
