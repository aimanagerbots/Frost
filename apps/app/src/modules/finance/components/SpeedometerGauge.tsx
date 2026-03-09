'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import type { FinanceSpeedometer } from '@/modules/finance/types';


interface SpeedometerGaugeProps {
  gauge: FinanceSpeedometer;
}

export function SpeedometerGauge({ gauge }: SpeedometerGaugeProps) {
  const [expanded, setExpanded] = useState(false);

  const cx = 100;
  const cy = 100;
  const r = 80;
  const strokeWidth = 14;

  // Arc helper: angle 0 = left (180°), angle 180 = right (0°)
  const polarToCartesian = (angle: number) => {
    const rad = ((180 - angle) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  };

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  // Needle rotation: score 0 → -90° (left), score 100 → 90° (right)
  const needleAngle = -90 + (gauge.score / 100) * 180;

  const TrendIcon = gauge.trend > 0 ? TrendingUp : gauge.trend < 0 ? TrendingDown : Minus;
  const trendColor = gauge.trend > 0 ? 'text-green-400' : gauge.trend < 0 ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="bg-card border border-default rounded-xl p-4 flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[180px]">
        {/* Red zone: 0-39 → angle 0-70.2 */}
        <path d={describeArc(0, 70.2)} fill="none" stroke="#EF4444" strokeWidth={strokeWidth} strokeLinecap="round" opacity={0.3} />
        {/* Amber zone: 40-69 → angle 72-124.2 */}
        <path d={describeArc(72, 124.2)} fill="none" stroke="#FBBF24" strokeWidth={strokeWidth} strokeLinecap="round" opacity={0.3} />
        {/* Green zone: 70-100 → angle 126-180 */}
        <path d={describeArc(126, 180)} fill="none" stroke="#22C55E" strokeWidth={strokeWidth} strokeLinecap="round" opacity={0.3} />

        {/* Active arc up to score */}
        <path
          d={describeArc(0, (gauge.score / 100) * 180)}
          fill="none"
          stroke={gauge.zone === 'green' ? '#22C55E' : gauge.zone === 'amber' ? '#FBBF24' : '#EF4444'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - r + 20}
          stroke="#E2E8F0"
          strokeWidth={2.5}
          strokeLinecap="round"
          transform={`rotate(${needleAngle} ${cx} ${cy})`}
        />
        <circle cx={cx} cy={cy} r={5} fill="#E2E8F0" />

        {/* Score text */}
        <text x={cx} y={cy - 15} textAnchor="middle" fill="#E2E8F0" fontSize="28" fontWeight="700">
          {gauge.score}
        </text>
      </svg>

      <p className="text-sm font-medium text-default mt-1">{gauge.label}</p>

      <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
        <TrendIcon className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">
          {gauge.trend > 0 ? '+' : ''}{gauge.trend}%
        </span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 mt-2 text-xs text-muted hover:text-default transition-colors"
      >
        {expanded ? 'Hide' : 'Details'}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="w-full mt-2 space-y-1.5 border-t border-default pt-2">
          {gauge.factors.map((f) => (
            <div key={f.label} className="flex items-center justify-between text-xs">
              <span className="text-muted">{f.label}</span>
              <span
                className={
                  f.impact === 'positive'
                    ? 'text-green-400 font-medium'
                    : f.impact === 'negative'
                    ? 'text-red-400 font-medium'
                    : 'text-default'
                }
              >
                {f.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
