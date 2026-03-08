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

/** Blue shades for charts and data visualization that need multiple series */
export const CHART_ACCENT_COLORS = [
  '#5BB8E6', // Primary
  '#4A8DB8', // Darker
  '#3D7A9E', // Darkest
  '#7ECBF0', // Lighter
  '#A3DCF5', // Lightest
];
