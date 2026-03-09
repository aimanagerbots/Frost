'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, label: string) => void;
}

interface GeoResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* debounced geocode search */
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      setError(null);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const encoded = encodeURIComponent(value.trim());
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=us&viewbox=-125.0,49.5,-116.0,45.0&bounded=0&limit=6`,
            {
              headers: { 'Accept-Language': 'en' },
            },
          );

          if (!res.ok) throw new Error('Geocoding request failed');

          const data: GeoResult[] = await res.json();
          setResults(data);
          setIsOpen(data.length > 0);
        } catch {
          setError('Search failed. Try again.');
          setResults([]);
          setIsOpen(false);
        } finally {
          setIsLoading(false);
        }
      }, 400);
    },
    [],
  );

  /* select a result from the dropdown */
  const handleSelectResult = useCallback(
    (result: GeoResult) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      const label = result.display_name.split(',').slice(0, 2).join(',').trim();

      setQuery(label);
      setIsOpen(false);
      setResults([]);
      onLocationSelect(lat, lng, label);
    },
    [onLocationSelect],
  );

  /* use browser geolocation */
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setQuery('My Location');
        setGeoLoading(false);
        onLocationSelect(latitude, longitude, 'My Location');
      },
      (err) => {
        setGeoLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable. Try searching by address instead.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('Could not get your location.');
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, [onLocationSelect]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex gap-2">
        {/* search input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Search city or address..."
            className="w-full bg-[#0A0A0F] border border-white/[0.08] rounded-lg px-4 py-3 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#5BB8E6]/50 focus:border-[#5BB8E6]/50 transition-all"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-[#5BB8E6]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* geolocation button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={geoLoading}
          title="Use my location"
          className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#0A0A0F] border border-white/[0.08] rounded-lg text-white/60 hover:text-[#5BB8E6] hover:border-[#5BB8E6]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {geoLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-[#5BB8E6]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <circle cx="12" cy="12" r="8" opacity="0.3" />
            </svg>
          )}
        </button>
      </div>

      {/* error message */}
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}

      {/* results dropdown */}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-[#0A0A0F] border border-white/[0.08] rounded-lg shadow-xl overflow-hidden">
          {results.map((result) => {
            const parts = result.display_name.split(',');
            const primary = parts.slice(0, 2).join(',').trim();
            const secondary = parts.slice(2, 4).join(',').trim();

            return (
              <li key={result.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-b-0"
                >
                  <span className="block text-sm text-white/90">{primary}</span>
                  {secondary && (
                    <span className="block text-xs text-white/40 mt-0.5">
                      {secondary}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
