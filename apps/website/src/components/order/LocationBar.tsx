'use client';

import { useState, useCallback } from 'react';
import { useOrderStore } from '@/stores/order-store';

export function LocationBar() {
  const { userLocation, setUserLocation } = useOrderStore();
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ label: string; lat: number; lng: number }>>([]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'My Location',
        });
        setIsSearching(false);
      },
      () => {
        setIsSearching(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, [setUserLocation]);

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=5&countrycodes=us`,
      );
      const data = await res.json();
      setSuggestions(
        data.map((r: { display_name: string; lat: string; lon: string }) => ({
          label: r.display_name.split(',').slice(0, 3).join(','),
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
        })),
      );
    } catch {
      // silently fail
    }
    setIsSearching(false);
  }, [searchInput]);

  const handleSelect = useCallback(
    (suggestion: { label: string; lat: number; lng: number }) => {
      setUserLocation(suggestion);
      setSuggestions([]);
      setSearchInput('');
    },
    [setUserLocation],
  );

  if (userLocation) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
        <svg className="w-4 h-4 text-[#5BB8E6] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span className="text-sm text-text-default font-sans truncate flex-1">
          Near {userLocation.label}
        </span>
        <button
          onClick={() => setUserLocation(null)}
          className="text-xs text-[#5BB8E6] font-sans font-medium hover:underline shrink-0"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter your address or zip code"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-text-default font-sans placeholder:text-text-muted focus:outline-none focus:border-[#5BB8E6]/40 focus:ring-1 focus:ring-[#5BB8E6]/20 transition-colors"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg text-sm text-text-default font-sans font-medium transition-colors disabled:opacity-50"
        >
          Search
        </button>
        <button
          onClick={handleUseMyLocation}
          disabled={isSearching}
          className="px-4 py-2.5 bg-[#5BB8E6]/10 hover:bg-[#5BB8E6]/20 border border-[#5BB8E6]/20 rounded-lg text-sm text-[#5BB8E6] font-sans font-medium transition-colors disabled:opacity-50 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
          </svg>
        </button>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="bg-[#0A0A0F] border border-white/[0.08] rounded-lg overflow-hidden shadow-xl">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-3 text-sm text-text-default font-sans hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
