import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Terms of Service
      </h1>
      <p className="text-lg text-text-muted mb-8">
        The terms and conditions governing your use of the Frost website and
        services. Please read carefully before using our platform.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
