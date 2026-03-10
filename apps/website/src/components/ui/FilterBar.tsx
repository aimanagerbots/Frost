"use client";

interface FilterBarProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export function FilterBar({ options, active, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-sans font-medium transition-colors duration-200 ${
              isActive
                ? "bg-accent-primary text-text-on-dark"
                : "border border-border-default bg-transparent text-text-default hover:border-border-hover hover:text-accent-primary"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
