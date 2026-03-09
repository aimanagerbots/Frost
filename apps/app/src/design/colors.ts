/**
 * Frost Design System — Color Constants
 *
 * Single source of truth for all accent colors used across modules.
 * To change the app-wide accent, update ACCENT here — every module picks it up.
 */

/** Primary Frost blue accent — used for headers, active states, charts, etc. */
export const ACCENT = '#5BB8E6';

/** Softer blue for backgrounds and fills (20% opacity of ACCENT) */
export const ACCENT_BG = '#5BB8E620';

/** Diverse colors for charts and data visualization that need multiple series */
export const CHART_ACCENT_COLORS = [
  '#5BB8E6', // Frost blue
  '#22C55E', // Flower green
  '#F59E0B', // Concentrate amber
  '#8B5CF6', // Edible purple
  '#F97316', // Preroll orange
  '#14B8A6', // Beverage teal
];

/** Product category colors — matches CSS tokens --accent-[category] */
export const CATEGORY_COLORS = {
  flower: '#22C55E',
  concentrate: '#F59E0B',
  vape: '#3B82F6',
  preroll: '#F97316',
  edible: '#8B5CF6',
  beverage: '#14B8A6',
} as const;

/** Strain type colors — matches CSS tokens --strain-[type] */
export const STRAIN_COLORS = {
  indica: '#8B5CF6',
  sativa: '#F97316',
  hybrid: '#22C55E',
  cbd: '#5BB8E6',
} as const;
