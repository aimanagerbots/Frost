import Link from "next/link";

export default function AgeVerifyPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        21+ Age Verification
      </h1>
      <p className="text-lg text-text-muted mb-8">
        WSLCB-mandated age gate. Visitors must confirm they are 21 years of age
        or older before accessing product content on this site.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
