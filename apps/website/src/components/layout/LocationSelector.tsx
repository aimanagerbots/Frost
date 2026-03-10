'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOrderStore } from '@/stores/order-store';

/* ------------------------------------------------------------------ */
/*  Region quick-pick data                                             */
/* ------------------------------------------------------------------ */

const REGIONS = [
  { label: 'Seattle Metro', lat: 47.6062, lng: -122.3321, display: 'Seattle, WA' },
  { label: 'South Sound', lat: 47.2529, lng: -122.4443, display: 'Tacoma, WA' },
  { label: 'East WA', lat: 47.6588, lng: -117.426, display: 'Spokane, WA' },
  { label: 'Portland Metro', lat: 45.5152, lng: -122.6784, display: 'Portland, OR' },
] as const;

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function Navigation2Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 19 21 12 17 5 21 12 2" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  LocationSelector                                                   */
/* ------------------------------------------------------------------ */

export function LocationSelector() {
  const userLocation = useOrderStore((s) => s.userLocation);
  const setUserLocation = useOrderStore((s) => s.setUserLocation);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  /* ── Close on Escape ── */
  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  /* ── Focus input when dropdown opens ── */
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  /* ── Handlers ── */
  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
    setInputValue('');
  }, []);

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setUserLocation(null);
    },
    [setUserLocation],
  );

  const handleUseMyLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Current Location',
        });
        setOpen(false);
      },
      () => {
        /* silently fail */
      },
    );
  }, [setUserLocation]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        setUserLocation({
          lat: 47.6062,
          lng: -122.3321,
          label: inputValue.trim(),
        });
        setInputValue('');
        setOpen(false);
      }
    },
    [inputValue, setUserLocation],
  );

  const handleRegionPick = useCallback(
    (region: (typeof REGIONS)[number]) => {
      setUserLocation({
        lat: region.lat,
        lng: region.lng,
        label: region.display,
      });
      setOpen(false);
    },
    [setUserLocation],
  );

  /* ── Pill classes ── */
  const hasLocation = userLocation !== null;

  const pillClasses = [
    'flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors cursor-pointer select-none',
    'border bg-white/[0.04]',
    hasLocation
      ? 'border-[#5BB8E6]/30 text-text-default'
      : 'border-white/[0.08] text-text-muted hover:border-white/[0.15] hover:text-text-default',
  ].join(' ');

  return (
    <div ref={containerRef} className="relative">
      {/* ── Pill trigger ── */}
      <button
        type="button"
        onClick={handleToggle}
        className={pillClasses}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
        <span className="text-[11px] uppercase tracking-[0.04em] whitespace-nowrap">
          {hasLocation ? userLocation.label : 'Set location'}
        </span>
        {hasLocation && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-0.5 rounded-full p-0.5 hover:bg-white/[0.08] transition-colors"
            aria-label="Clear location"
          >
            <XIcon className="h-3 w-3" />
          </button>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/[0.08] bg-[#111] p-4 shadow-2xl z-50">
          {/* Address input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter city or zip code..."
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-text-default placeholder:text-text-muted/50 focus:border-[#5BB8E6]/50 focus:outline-none transition-colors"
          />

          {/* Use my location */}
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#5BB8E6] hover:bg-white/[0.04] transition-colors"
          >
            <Navigation2Icon className="h-4 w-4 shrink-0" />
            Use my location
          </button>

          {/* Quick picks */}
          <p className="mt-3 mb-2 text-[10px] uppercase tracking-wider text-text-muted">
            Quick select
          </p>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((region) => (
              <button
                key={region.label}
                type="button"
                onClick={() => handleRegionPick(region)}
                className="rounded-md border border-white/[0.06] px-2.5 py-1 text-xs text-text-muted hover:border-white/[0.12] hover:text-text-default transition-colors"
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationSelector;
