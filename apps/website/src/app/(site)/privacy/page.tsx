import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Privacy Policy
      </h1>
      <p className="text-lg text-text-muted mb-8">
        How Frost collects, uses, and protects your personal information. We are
        committed to transparency and compliance with all applicable privacy
        regulations.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
