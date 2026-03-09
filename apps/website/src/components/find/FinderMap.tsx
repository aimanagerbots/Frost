'use client';

import { useCallback, useEffect, useRef, useMemo } from 'react';
import {
  Map,
  Source,
  Layer,
  Marker,
  NavigationControl,
} from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import type { LayerProps } from 'react-map-gl/maplibre';
import type { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_CONFIG } from '@/lib/map-config';
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';

/* ---------- types ---------- */

interface Dispensary {
  id: string;
  lat: number;
  lng: number;
  name: string;
  slug: string;
}

interface FinderMapProps {
  dispensaries: Dispensary[];
  selectedId: string | null;
  hoveredId: string | null;
  onPinClick: (id: string) => void;
  onPinHover: (id: string | null) => void;
  flyTo?: { lat: number; lng: number; zoom?: number } | null;
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
  flyTo,
}: FinderMapProps) {
  const mapRef = useRef<MapRef>(null);

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

  /* unclustered point layer (base dots, hidden when selected/hovered by Marker overlay) */
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

  /* handle click on unclustered point */
  const handlePointClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point'],
      });

      if (features.length > 0) {
        const id = features[0].properties?.id;
        if (id) onPinClick(id);
      }
    },
    [onPinClick],
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

  /* find selected/hovered dispensary for Marker overlay */
  const selectedDispensary = dispensaries.find((d) => d.id === selectedId);
  const hoveredDispensary =
    hoveredId && hoveredId !== selectedId
      ? dispensaries.find((d) => d.id === hoveredId)
      : null;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-[rgba(91,184,230,0.15)] shadow-[0_0_30px_rgba(91,184,230,0.08)]">
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
          handleClusterClick(e);
          handlePointClick(e);
        }}
        onMouseMove={handleMouseMove}
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
              onPinClick(hoveredDispensary.id);
            }}
          >
            <PinSvg color={MAP_CONFIG.HOVERED_COLOR} size={28} glow={true} />
          </Marker>
        )}
      </Map>
    </div>
  );
}
