import Link from "next/link";

interface CTAButtonProps {
  variant: "primary" | "outline";
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CTAButton({
  variant,
  href,
  onClick,
  children,
  className = "",
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm uppercase tracking-widest font-sans font-medium transition-colors duration-200";

  const variants = {
    primary:
      "bg-accent-primary text-text-on-dark hover:bg-accent-primary-hover",
    outline:
      "border border-accent-primary text-accent-primary bg-transparent hover:bg-accent-primary hover:text-text-on-dark",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
