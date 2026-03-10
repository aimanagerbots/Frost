/** Shared map configuration for all MapLibre maps in the Frost app */
export const MAP_CONFIG = {
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  initialViewState: {
    latitude: 47.4,
    longitude: -120.7,
    zoom: 6.5,
    pitch: 0,
    bearing: 0,
  },
  WA_BOUNDS: {
    north: 49.0,
    south: 45.5,
    east: -116.5,
    west: -124.8,
  },
  PIN_COLOR: '#5BB8E6',
  PIN_GLOW: 'rgba(91, 184, 230, 0.4)',
  CLUSTER_COLOR: '#3A9BD5',
  SELECTED_COLOR: '#FFFFFF',
  HOVERED_COLOR: '#7EC8F0',
} as const;

/**
 * Calculate the distance between two coordinates using the Haversine formula.
 * Returns distance in miles.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
