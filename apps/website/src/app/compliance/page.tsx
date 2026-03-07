import Link from "next/link";

export default function CompliancePage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Compliance
      </h1>
      <p className="text-lg text-text-muted mb-8">
        WSLCB regulatory information and compliance documentation. Frost
        operates under full compliance with Washington State Liquor and Cannabis
        Board regulations.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
