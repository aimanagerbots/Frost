'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePipelineStates } from '../hooks';
import type { PipelineState } from '../types';

const CATEGORIES = [
  { key: undefined, label: 'All' },
  { key: 'flower', label: 'Flower' },
  { key: 'preroll', label: 'Preroll' },
  { key: 'vaporizer', label: 'Vaporizer' },
  { key: 'concentrate', label: 'Concentrate' },
] as const;

const ACCENT = '#10B981';

// Vaporizer branching paths
const VAPE_DISTILLATE_PATH = ['Extracted', 'Crude', 'Distillate', 'Flavored', 'Pen Filled', 'Loose Filled'];
const VAPE_LIVE_RESIN_PATH = ['Extracted', 'Flavored', 'Pen Filled', 'Loose Filled'];
const VAPE_SOLVENTLESS_PATH = ['Extracted', 'Pen Filled', 'Loose Filled'];

interface PipelineProps {
  onStateClick?: (state: string, category: string) => void;
}

function StateNode({ state, isActive, onClick }: { state: PipelineState; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 rounded-lg border px-3 py-2 transition-all',
        isActive
          ? 'border-transparent bg-elevated shadow-sm'
          : 'border-default bg-card hover:bg-card-hover'
      )}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-text-bright"
        style={{ backgroundColor: `${state.color}30`, color: state.color }}
      >
        {state.count}
      </span>
      <span className="text-[10px] text-text-muted whitespace-nowrap">{state.state}</span>
    </button>
  );
}

function Arrow() {
  return (
    <div className="flex items-center px-1 text-text-muted">
      <svg width="20" height="12" viewBox="0 0 20 12">
        <line x1="0" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <polyline points="12,2 18,6 12,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function LinearPipeline({ states, activeState, onStateClick }: { states: PipelineState[]; activeState: string | null; onStateClick: (state: string, category: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {states.map((s, i) => (
        <div key={s.stateCode} className="flex items-center">
          <StateNode
            state={s}
            isActive={activeState === s.state}
            onClick={() => onStateClick(s.state, s.category)}
          />
          {i < states.length - 1 && <Arrow />}
        </div>
      ))}
    </div>
  );
}

function VaporizerPipeline({ states, activeState, onStateClick }: { states: PipelineState[]; activeState: string | null; onStateClick: (state: string, category: string) => void }) {
  const stateMap = new Map(states.map(s => [s.state, s]));

  const renderPath = (path: string[], label: string) => {
    const pathStates = path.map(name => stateMap.get(name)).filter(Boolean) as PipelineState[];
    if (pathStates.length === 0) return null;

    return (
      <div className="flex items-center gap-1">
        <span className="w-24 text-right text-[10px] text-text-muted pr-2">{label}</span>
        {pathStates.map((s, i) => (
          <div key={s.stateCode + label} className="flex items-center">
            <StateNode
              state={s}
              isActive={activeState === s.state}
              onClick={() => onStateClick(s.state, s.category)}
            />
            {i < pathStates.length - 1 && <Arrow />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {renderPath(VAPE_DISTILLATE_PATH, 'Distillate')}
      {renderPath(VAPE_LIVE_RESIN_PATH, 'Live Resin')}
      {renderPath(VAPE_SOLVENTLESS_PATH, 'Solventless')}
    </div>
  );
}

export function ManufacturingPipeline({ onStateClick }: PipelineProps) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [activeState, setActiveState] = useState<string | null>(null);
  const { data: states } = usePipelineStates(activeCategory);

  const handleStateClick = (state: string, category: string) => {
    setActiveState(prev => prev === state ? null : state);
    onStateClick?.(state, category);
  };

  // Group states by category for "All" view
  const grouped = (states ?? []).reduce<Record<string, PipelineState[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-bright">Pipeline Overview</h2>
        <div className="flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => { setActiveCategory(cat.key); setActiveState(null); }}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                activeCategory === cat.key
                  ? 'text-text-bright'
                  : 'text-text-muted hover:text-text-default hover:bg-elevated'
              )}
              style={activeCategory === cat.key ? { backgroundColor: `${ACCENT}20`, color: ACCENT } : undefined}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-default bg-card p-4 overflow-x-auto">
        {!activeCategory ? (
          // All view — show each category
          <div className="space-y-4">
            {Object.entries(grouped).map(([cat, catStates]) => (
              <div key={cat}>
                <div className="mb-2 text-xs font-medium text-text-muted capitalize">{cat}</div>
                {cat === 'vaporizer' ? (
                  <VaporizerPipeline states={catStates} activeState={activeState} onStateClick={handleStateClick} />
                ) : (
                  <LinearPipeline states={catStates} activeState={activeState} onStateClick={handleStateClick} />
                )}
              </div>
            ))}
          </div>
        ) : activeCategory === 'vaporizer' ? (
          <VaporizerPipeline states={states ?? []} activeState={activeState} onStateClick={handleStateClick} />
        ) : (
          <LinearPipeline states={states ?? []} activeState={activeState} onStateClick={handleStateClick} />
        )}
      </div>
    </div>
  );
}
