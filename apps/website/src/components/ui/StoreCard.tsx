interface StoreAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface StoreCardProps {
  name: string;
  address: StoreAddress;
  hours?: string;
  categoriesCarried: string[];
}

export function StoreCard({
  name,
  address,
  hours,
  categoriesCarried,
}: StoreCardProps) {
  return (
    <div className="rounded-xl border border-[#5BB8E6]/40 bg-card p-6 space-y-3 shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)] transition-shadow duration-300 hover:shadow-[0_0_20px_4px_rgba(91,184,230,0.6),0_0_40px_8px_rgba(91,184,230,0.3)]">
      <h3 className="font-display text-xl text-text-default">{name}</h3>

      <div className="text-sm text-text-muted font-sans leading-relaxed">
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state} {address.zip}
        </p>
      </div>

      {hours && (
        <p className="text-xs text-text-muted font-sans">{hours}</p>
      )}

      <div className="flex flex-wrap gap-1.5 pt-1">
        {categoriesCarried.map((category) => (
          <span
            key={category}
            className="text-xs rounded-full px-2.5 py-0.5 bg-elevated text-text-muted font-sans"
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
}
