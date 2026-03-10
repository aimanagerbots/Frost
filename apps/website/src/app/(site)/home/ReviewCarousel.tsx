'use client';

import { useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';

interface Review {
  quote: string;
  name: string;
  location: string;
  rating: number;
}

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Duplicate reviews for seamless loop
  const doubled = [...reviews, ...reviews];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-base to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-base to-transparent" />

      {/* Sliding track */}
      <div
        ref={trackRef}
        className="flex gap-6 px-6"
        style={{
          animation: `marquee ${reviews.length * 5}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {doubled.map((review, i) => (
          <div
            key={i}
            className="w-[340px] shrink-0 rounded-xl border border-border-default bg-card p-6"
          >
            <Quote className="mb-4 h-6 w-6 text-accent-primary opacity-40" />
            <div className="mb-4 flex gap-0.5">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star
                  key={j}
                  className="h-4 w-4 fill-accent-primary text-accent-primary"
                />
              ))}
            </div>
            <p className="mb-6 text-sm leading-relaxed text-text-default font-sans">
              &ldquo;{review.quote}&rdquo;
            </p>
            <div>
              <p className="text-sm font-semibold text-text-default">{review.name}</p>
              <p className="text-xs text-text-muted">{review.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
