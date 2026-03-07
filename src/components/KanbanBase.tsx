'use client';

import { useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LoadingSkeleton } from './LoadingSkeleton';

interface KanbanColumn<T> {
  id: string;
  title: string;
  color: string;
  items: T[];
}

interface KanbanBaseProps<T extends { id: string }> {
  columns: KanbanColumn<T>[];
  renderCard: (item: T) => ReactNode;
  onDragEnd: (itemId: string, fromColumnId: string, toColumnId: string) => void;
  columnHeaderExtra?: (columnId: string, count: number) => ReactNode;
  emptyColumnMessage?: string;
  loading?: boolean;
}

function SortableCard<T extends { id: string }>({
  item,
  renderCard,
}: {
  item: T;
  renderCard: (item: T) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {renderCard(item)}
    </div>
  );
}

function DroppableColumn({
  id,
  children,
  emptyMessage,
}: {
  id: string;
  children: ReactNode;
  emptyMessage?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[120px] flex-col gap-2 rounded-lg p-2 transition-colors ${
        isOver ? 'bg-elevated/60' : ''
      }`}
    >
      {children}
      {!children || (Array.isArray(children) && children.length === 0) ? (
        <div className="flex flex-1 items-center justify-center py-8 text-xs text-muted">
          {emptyMessage || 'No items'}
        </div>
      ) : null}
    </div>
  );
}

export function KanbanBase<T extends { id: string }>({
  columns,
  renderCard,
  onDragEnd,
  columnHeaderExtra,
  emptyColumnMessage,
  loading = false,
}: KanbanBaseProps<T>) {
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-72 shrink-0">
            <LoadingSkeleton variant="card" count={3} />
          </div>
        ))}
      </div>
    );
  }

  // Build a lookup: itemId -> columnId
  const itemColumnMap = new Map<string, string>();
  const allItemsMap = new Map<string, T>();
  for (const col of columns) {
    for (const item of col.items) {
      itemColumnMap.set(item.id, col.id);
      allItemsMap.set(item.id, item);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const item = allItemsMap.get(String(event.active.id));
    setActiveItem(item || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const fromCol = itemColumnMap.get(activeId);

    // Determine target column: either the item's column or the column itself
    let toCol = itemColumnMap.get(overId);
    if (!toCol) {
      // Dropped on a column droppable directly
      toCol = overId;
    }

    if (fromCol && toCol && fromCol !== toCol) {
      onDragEnd(activeId, fromCol, toCol);
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex w-72 shrink-0 flex-col rounded-xl border border-default bg-card"
          >
            {/* Column header */}
            <div className="flex items-center justify-between border-b border-default px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <span className="text-sm font-medium text-bright">{col.title}</span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${col.color}20`,
                    color: col.color,
                  }}
                >
                  {col.items.length}
                </span>
              </div>
              {columnHeaderExtra?.(col.id, col.items.length)}
            </div>

            {/* Column body */}
            <SortableContext
              items={col.items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableColumn id={col.id} emptyMessage={emptyColumnMessage}>
                {col.items.map((item) => (
                  <SortableCard key={item.id} item={item} renderCard={renderCard} />
                ))}
              </DroppableColumn>
            </SortableContext>
          </div>
        ))}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeItem ? (
          <div className="rotate-2 scale-105 opacity-90">{renderCard(activeItem)}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
