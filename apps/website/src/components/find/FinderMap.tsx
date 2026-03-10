'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  Map,
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
} from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import type { LayerProps } from 'react-map-gl/maplibre';
import type { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_CONFIG } from '@/lib/map-config';
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';

/* ---------- types ---------- */

interface MapDispensary {
  id: string;
  lat: number;
  lng: number;
  name: string;
  slug: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  hours?: string;
  phone?: string;
  featuredDeal?: string;
  distance?: number;
  categoriesCarried?: string[];
}

interface FinderMapProps {
  dispensaries: MapDispensary[];
  selectedId: string | null;
  hoveredId: string | null;
  onPinClick: (id: string) => void;
  onPinHover: (id: string | null) => void;
  onNavigate: (slug: string) => void;
  flyTo?: { lat: number; lng: number; zoom?: number } | null;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

/* ---------- cluster layer styles ---------- */

const clusterCircleLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'dispensaries',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      MAP_CONFIG.CLUSTER_COLOR,
      10,
      '#2D8BC4',
      30,
      '#1F7AB3',
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      18,
      10,
      24,
      30,
      32,
    ],
    'circle-stroke-width': 2,
    'circle-stroke-color': MAP_CONFIG.PIN_COLOR,
    'circle-opacity': 0.85,
  },
};

const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'dispensaries',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 13,
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
  },
  paint: {
    'text-color': '#ffffff',
  },
};

/* ---------- pin SVG ---------- */

function PinSvg({
  color,
  size,
  glow,
}: {
  color: string;
  size: number;
  glow: boolean;
}) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 24 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: glow ? `drop-shadow(0 0 6px ${MAP_CONFIG.PIN_GLOW})` : undefined }}
    >
      <path
        d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 21 12 21s12-12.75 12-21c0-6.627-5.373-12-12-12z"
        fill={color}
      />
      <circle cx="12" cy="12" r="5" fill="#000000" opacity="0.3" />
      <circle cx="12" cy="12" r="3.5" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

/* ---------- component ---------- */

export default function FinderMap({
  dispensaries,
  selectedId,
  hoveredId,
  onPinClick,
  onPinHover,
  onNavigate,
  flyTo,
  onBoundsChange,
}: FinderMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupStore, setPopupStore] = useState<MapDispensary | null>(null);

  /* report viewport bounds after movement or initial load */
  const reportBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map || !onBoundsChange) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    onBoundsChange({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    });
  }, [onBoundsChange]);

  /* fly to location when flyTo changes */
  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom ?? 11,
      duration: 1400,
      essential: true,
    });
  }, [flyTo]);

  /* convert dispensaries to GeoJSON */
  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: dispensaries.map((d) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [d.lng, d.lat],
        },
        properties: {
          id: d.id,
          name: d.name,
          slug: d.slug,
        },
      })),
    }),
    [dispensaries],
  );

  /* handle cluster click → zoom in */
  const handleClusterClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });

      if (features.length === 0) return;

      const feature = features[0];
      if (feature.geometry.type !== 'Point') return;

      const clusterId = feature.properties?.cluster_id;
      const source = map.getSource('dispensaries');

      if (source && 'getClusterExpansionZoom' in source && clusterId != null) {
        const geoSource = source as GeoJSONSource;
        geoSource.getClusterExpansionZoom(clusterId).then((zoom) => {
          const [lng, lat] = feature.geometry.type === 'Point'
            ? feature.geometry.coordinates
            : [0, 0];
          map.flyTo({
            center: [lng, lat],
            zoom,
            duration: 500,
          });
        });
      }
    },
    [],
  );

  /* unclustered point layer */
  const unclusteredPointLayer: LayerProps = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'dispensaries',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': MAP_CONFIG.PIN_COLOR,
      'circle-radius': 7,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(91, 184, 230, 0.3)',
      'circle-opacity': 0.9,
    },
  };

  /* handle click on unclustered point — show popup */
  const handlePointClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point'],
      });

      if (features.length > 0) {
        const id = features[0].properties?.id;
        if (id) {
          const store = dispensaries.find((d) => d.id === id);
          if (store) {
            setPopupStore(store);
            onPinClick(id);
          }
        }
      }
    },
    [onPinClick, dispensaries],
  );

  /* handle hover on unclustered point */
  const handleMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point'],
      });

      if (features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        const id = features[0].properties?.id;
        if (id) onPinHover(id);
      } else {
        map.getCanvas().style.cursor = '';
        onPinHover(null);
      }
    },
    [onPinHover],
  );

  /* click on empty map area → close popup */
  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters', 'unclustered-point'],
      });

      if (features.length === 0) {
        setPopupStore(null);
      }
    },
    [],
  );

  /* find selected/hovered dispensary for Marker overlay */
  const selectedDispensary = dispensaries.find((d) => d.id === selectedId);
  const hoveredDispensary =
    hoveredId && hoveredId !== selectedId
      ? dispensaries.find((d) => d.id === hoveredId)
      : null;

  return (
    <div className="w-full h-full">
      <Map
        ref={mapRef}
        initialViewState={MAP_CONFIG.initialViewState}
        mapStyle={MAP_CONFIG.style}
        style={{ width: '100%', height: '100%' }}
        maxBounds={[
          [MAP_CONFIG.WA_BOUNDS.west - 1, MAP_CONFIG.WA_BOUNDS.south - 0.5],
          [MAP_CONFIG.WA_BOUNDS.east + 1, MAP_CONFIG.WA_BOUNDS.north + 0.5],
        ]}
        onClick={(e) => {
          handleMapClick(e);
          handleClusterClick(e);
          handlePointClick(e);
        }}
        onMouseMove={handleMouseMove}
        onMoveEnd={reportBounds}
        onLoad={reportBounds}
        interactiveLayerIds={['clusters', 'unclustered-point']}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Source
          id="dispensaries"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterCircleLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

        {/* selected pin overlay */}
        {selectedDispensary && (
          <Marker
            latitude={selectedDispensary.lat}
            longitude={selectedDispensary.lng}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              const store = dispensaries.find((d) => d.id === selectedDispensary.id);
              if (store) setPopupStore(store);
              onPinClick(selectedDispensary.id);
            }}
          >
            <PinSvg color={MAP_CONFIG.SELECTED_COLOR} size={32} glow={true} />
          </Marker>
        )}

        {/* hovered pin overlay */}
        {hoveredDispensary && (
          <Marker
            latitude={hoveredDispensary.lat}
            longitude={hoveredDispensary.lng}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              const store = dispensaries.find((d) => d.id === hoveredDispensary.id);
              if (store) setPopupStore(store);
              onPinClick(hoveredDispensary.id);
            }}
          >
            <PinSvg color={MAP_CONFIG.HOVERED_COLOR} size={28} glow={true} />
          </Marker>
        )}

        {/* ═══ POPUP BADGE ═══ */}
        {popupStore && (
          <Popup
            latitude={popupStore.lat}
            longitude={popupStore.lng}
            anchor="bottom"
            offset={[0, -40] as [number, number]}
            closeButton={false}
            closeOnClick={false}
            className="frost-map-popup"
          >
            <div className="bg-[#0A0A12] border border-white/[0.12] rounded-2xl p-4 min-w-[260px] max-w-[300px] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              {/* Close button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupStore(null);
                }}
                className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white/70 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>

              {/* Store name */}
              <h3 className="text-sm font-semibold text-white/90 pr-6 leading-tight">
                {popupStore.name}
              </h3>

              {/* Address */}
              {popupStore.address && (
                <p className="text-xs text-white/35 mt-1.5 leading-relaxed">
                  {popupStore.address.street && <span className="block">{popupStore.address.street}</span>}
                  {[popupStore.address.city, popupStore.address.state].filter(Boolean).join(', ')}
                  {popupStore.address.zip ? ` ${popupStore.address.zip}` : ''}
                </p>
              )}

              {/* Hours */}
              {popupStore.hours && (
                <div className="flex items-center gap-1.5 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 flex-shrink-0"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  <span className="text-[11px] text-white/30">{popupStore.hours}</span>
                </div>
              )}

              {/* Phone */}
              {popupStore.phone && (
                <div className="flex items-center gap-1.5 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <span className="text-[11px] text-white/30">{popupStore.phone}</span>
                </div>
              )}

              {/* Distance badge */}
              {popupStore.distance != null && (
                <div className="mt-2.5">
                  <span className="text-[11px] font-semibold text-[#5BB8E6] bg-[#5BB8E6]/10 px-2 py-0.5 rounded-md">
                    {popupStore.distance < 10
                      ? popupStore.distance.toFixed(1)
                      : Math.round(popupStore.distance)}{' '}
                    mi away
                  </span>
                </div>
              )}

              {/* Featured deal */}
              {popupStore.featuredDeal && (
                <div className="mt-2.5 bg-emerald-500/8 border border-emerald-500/15 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0"><path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" /><path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z" /></svg>
                  <span className="text-[11px] text-emerald-400/80">{popupStore.featuredDeal}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const addr = [popupStore.address?.street, popupStore.address?.city, popupStore.address?.state, popupStore.address?.zip]
                      .filter(Boolean)
                      .join(', ');
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`,
                      '_blank',
                      'noopener',
                    );
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                  Directions
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupStore(null);
                    onNavigate(popupStore.slug);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#5BB8E6]/15 border border-[#5BB8E6]/25 text-xs font-medium text-[#5BB8E6] hover:bg-[#5BB8E6]/25 transition-all"
                >
                  View Store
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
