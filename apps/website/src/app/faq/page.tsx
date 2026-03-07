import Link from "next/link";

export default function FaqPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        FAQ
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Answers to commonly asked questions about Frost products, ordering,
        dispensary partnerships, and Washington State cannabis regulations.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
