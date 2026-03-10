'use client';

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import {
  Map,
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
} from 'react-map-gl/maplibre';
import type { MapRef, LayerProps, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import type { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_CONFIG } from '@/lib/map-config';

/* ---------- types ---------- */

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  name: string;
  color?: string;
  size?: number;
  /** Arbitrary data attached to the pin for popup rendering */
  data?: Record<string, unknown>;
}

export interface FrostMapProps {
  /** Array of pins to display on the map */
  pins: MapPin[];
  /** Currently selected pin id */
  selectedId?: string | null;
  /** Currently hovered pin id */
  hoveredId?: string | null;
  /** Called when a pin is clicked */
  onPinClick?: (id: string, pin: MapPin) => void;
  /** Called when a pin is hovered/unhovered */
  onPinHover?: (id: string | null) => void;
  /** Fly to this location when it changes */
  flyTo?: { lat: number; lng: number; zoom?: number } | null;
  /** Custom popup renderer — receives the clicked pin */
  renderPopup?: (pin: MapPin, onClose: () => void) => ReactNode;
  /** Whether to cluster pins */
  cluster?: boolean;
  /** Default pin color (overridden by individual pin.color) */
  pinColor?: string;
  /** Cluster color */
  clusterColor?: string;
  /** Polygon fill layers (e.g. territory boundaries) */
  polygonLayers?: PolygonLayer[];
  /** Heatmap data source */
  heatmapData?: HeatmapPoint[];
  /** Show heatmap layer */
  showHeatmap?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Map bounds change callback */
  onBoundsChange?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
}

export interface PolygonLayer {
  id: string;
  coordinates: [number, number][][]; // [lng, lat][] per polygon ring
  fillColor: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  label?: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

/* ---------- PinSvg ---------- */

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
      style={{
        filter: glow ? `drop-shadow(0 0 6px ${color}66)` : undefined,
      }}
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

/* ---------- FrostMap component ---------- */

export function FrostMap({
  pins,
  selectedId = null,
  hoveredId = null,
  onPinClick,
  onPinHover,
  flyTo,
  renderPopup,
  cluster = true,
  pinColor = MAP_CONFIG.PIN_COLOR,
  clusterColor = MAP_CONFIG.CLUSTER_COLOR,
  polygonLayers = [],
  heatmapData = [],
  showHeatmap = false,
  className,
  onBoundsChange,
}: FrostMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupPin, setPopupPin] = useState<MapPin | null>(null);

  /* report viewport bounds */
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

  /* fly to location */
  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom ?? 11,
      duration: 1400,
      essential: true,
    });
  }, [flyTo]);

  /* convert pins to GeoJSON */
  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: pins.map((p) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [p.lng, p.lat],
        },
        properties: {
          id: p.id,
          name: p.name,
          color: p.color ?? pinColor,
        },
      })),
    }),
    [pins, pinColor],
  );

  /* heatmap geojson */
  const heatmapGeojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: heatmapData.map((h) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [h.lng, h.lat],
        },
        properties: { weight: h.weight },
      })),
    }),
    [heatmapData],
  );

  /* polygon geojson */
  const polygonGeojson = useMemo(() => {
    if (polygonLayers.length === 0) return null;
    return {
      type: 'FeatureCollection' as const,
      features: polygonLayers.map((pl) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: pl.coordinates,
        },
        properties: {
          id: pl.id,
          fillColor: pl.fillColor,
          fillOpacity: pl.fillOpacity ?? 0.15,
          strokeColor: pl.strokeColor ?? pl.fillColor,
          strokeWidth: pl.strokeWidth ?? 1.5,
          label: pl.label ?? '',
        },
      })),
    };
  }, [polygonLayers]);

  /* cluster layer styles */
  const clusterCircleLayer: LayerProps = useMemo(
    () => ({
      id: 'clusters',
      type: 'circle',
      source: 'pins',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          clusterColor,
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
        'circle-stroke-color': pinColor,
        'circle-opacity': 0.85,
      },
    }),
    [clusterColor, pinColor],
  );

  const clusterCountLayer: LayerProps = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'pins',
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

  const unclusteredPointLayer: LayerProps = useMemo(
    () => ({
      id: 'unclustered-point',
      type: 'circle',
      source: 'pins',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': ['get', 'color'],
        'circle-radius': 7,
        'circle-stroke-width': 2,
        'circle-stroke-color': ['concat', ['get', 'color'], '4D'],
        'circle-opacity': 0.9,
      },
    }),
    [],
  );

  /* polygon layers */
  const polygonFillLayer: LayerProps = {
    id: 'polygon-fill',
    type: 'fill',
    source: 'polygons',
    paint: {
      'fill-color': ['get', 'fillColor'],
      'fill-opacity': ['get', 'fillOpacity'],
    },
  };

  const polygonStrokeLayer: LayerProps = {
    id: 'polygon-stroke',
    type: 'line',
    source: 'polygons',
    paint: {
      'line-color': ['get', 'strokeColor'],
      'line-width': ['get', 'strokeWidth'],
      'line-opacity': 0.6,
      'line-dasharray': [2, 2],
    },
  };

  /* heatmap layer */
  const heatmapLayer: LayerProps = {
    id: 'heatmap',
    type: 'heatmap',
    source: 'heatmap',
    paint: {
      'heatmap-weight': ['get', 'weight'],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 10, 1.5],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0,0,0,0)',
        0.2,
        'rgba(91,184,230,0.2)',
        0.4,
        'rgba(91,184,230,0.4)',
        0.6,
        'rgba(245,158,11,0.6)',
        0.8,
        'rgba(239,68,68,0.7)',
        1,
        'rgba(239,68,68,0.9)',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 5, 30, 10, 20],
      'heatmap-opacity': 0.7,
    },
  };

  /* handle cluster click → zoom in */
  const handleClusterClick = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current;
    if (!map) return;

    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    });

    if (features.length === 0) return;

    const feature = features[0];
    if (feature.geometry.type !== 'Point') return;

    const clusterId = feature.properties?.cluster_id;
    const source = map.getSource('pins');

    if (source && 'getClusterExpansionZoom' in source && clusterId != null) {
      const geoSource = source as GeoJSONSource;
      geoSource.getClusterExpansionZoom(clusterId).then((zoom) => {
        const [lng, lat] =
          feature.geometry.type === 'Point'
            ? feature.geometry.coordinates
            : [0, 0];
        map.flyTo({
          center: [lng, lat],
          zoom,
          duration: 500,
        });
      });
    }
  }, []);

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
        if (id) {
          const pin = pins.find((p) => p.id === id);
          if (pin) {
            setPopupPin(pin);
            onPinClick?.(id, pin);
          }
        }
      }
    },
    [onPinClick, pins],
  );

  /* handle hover */
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
        if (id) onPinHover?.(id);
      } else {
        map.getCanvas().style.cursor = '';
        onPinHover?.(null);
      }
    },
    [onPinHover],
  );

  /* click on empty area → close popup */
  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters', 'unclustered-point'],
      });

      if (features.length === 0) {
        setPopupPin(null);
      }
    },
    [],
  );

  /* find selected/hovered pins for marker overlays */
  const selectedPin = pins.find((p) => p.id === selectedId);
  const hoveredPin =
    hoveredId && hoveredId !== selectedId
      ? pins.find((p) => p.id === hoveredId)
      : null;

  return (
    <div className={className ?? 'w-full h-full'}>
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

        {/* Polygon fills (territory boundaries, etc.) */}
        {polygonGeojson && (
          <Source id="polygons" type="geojson" data={polygonGeojson}>
            <Layer {...polygonFillLayer} />
            <Layer {...polygonStrokeLayer} />
          </Source>
        )}

        {/* Heatmap layer */}
        {showHeatmap && heatmapData.length > 0 && (
          <Source id="heatmap" type="geojson" data={heatmapGeojson}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        {/* Clustered pin source */}
        <Source
          id="pins"
          type="geojson"
          data={geojson}
          cluster={cluster}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterCircleLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

        {/* Selected pin overlay */}
        {selectedPin && (
          <Marker
            latitude={selectedPin.lat}
            longitude={selectedPin.lng}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupPin(selectedPin);
              onPinClick?.(selectedPin.id, selectedPin);
            }}
          >
            <PinSvg
              color={MAP_CONFIG.SELECTED_COLOR}
              size={32}
              glow={true}
            />
          </Marker>
        )}

        {/* Hovered pin overlay */}
        {hoveredPin && (
          <Marker
            latitude={hoveredPin.lat}
            longitude={hoveredPin.lng}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupPin(hoveredPin);
              onPinClick?.(hoveredPin.id, hoveredPin);
            }}
          >
            <PinSvg
              color={hoveredPin.color ?? MAP_CONFIG.HOVERED_COLOR}
              size={28}
              glow={true}
            />
          </Marker>
        )}

        {/* Popup */}
        {popupPin && renderPopup && (
          <Popup
            latitude={popupPin.lat}
            longitude={popupPin.lng}
            anchor="bottom"
            offset={[0, -40] as [number, number]}
            closeButton={false}
            closeOnClick={false}
            className="frost-map-popup"
          >
            {renderPopup(popupPin, () => setPopupPin(null))}
          </Popup>
        )}
      </Map>
    </div>
  );
}
