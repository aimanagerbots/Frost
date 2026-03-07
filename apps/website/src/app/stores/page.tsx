import Link from "next/link";

export default function StoresPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Store Locator
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Find dispensary partners that carry Frost products near you. Search by
        location or browse our full list of licensed retail partners across
        Washington State.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
