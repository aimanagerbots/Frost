type StrainVariant = "indica" | "sativa" | "hybrid" | "cbd";
type CategoryVariant =
  | "flower"
  | "concentrate"
  | "vape"
  | "preroll"
  | "edible"
  | "beverage";

type BadgeVariant = StrainVariant | CategoryVariant;

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  indica: "bg-strain-indica/10 text-strain-indica",
  sativa: "bg-strain-sativa/10 text-strain-sativa",
  hybrid: "bg-strain-hybrid/10 text-strain-hybrid",
  cbd: "bg-strain-cbd/10 text-strain-cbd",
  flower: "bg-accent-flower/10 text-accent-flower",
  concentrate: "bg-accent-concentrate/10 text-accent-concentrate",
  vape: "bg-accent-vape/10 text-accent-vape",
  preroll: "bg-accent-preroll/10 text-accent-preroll",
  edible: "bg-accent-edible/10 text-accent-edible",
  beverage: "bg-accent-beverage/10 text-accent-beverage",
};

export function Badge({ label, variant, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block text-xs uppercase tracking-wider rounded-full px-3 py-1 font-sans font-medium ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
