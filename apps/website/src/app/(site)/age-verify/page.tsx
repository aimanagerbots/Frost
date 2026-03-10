import Link from "next/link";

export default function AgeVerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-[40px] leading-tight tracking-[-0.02em] text-text-default">
          You must be 21 or older
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          This website contains information about cannabis products and is only available
          to adults 21 years of age or older.
        </p>
        <Link
          href="/home"
          className="mt-8 inline-block text-sm text-accent-primary transition-colors hover:text-accent-primary-hover"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
