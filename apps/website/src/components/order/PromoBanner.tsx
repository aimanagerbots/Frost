'use client';

interface PromoBannerProps {
  text: string;
  icon?: React.ReactNode;
}

export function PromoBanner({ text, icon }: PromoBannerProps) {
  const handleClick = () => {
    const el = document.getElementById('store-finder');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/[0.02] border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-pointer"
    >
      {icon ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#5BB8E6]"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )}
      <span className="text-sm font-display uppercase tracking-[0.06em] text-[#5BB8E6]">
        {text}
      </span>
    </button>
  );
}
