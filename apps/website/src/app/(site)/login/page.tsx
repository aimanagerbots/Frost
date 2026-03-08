import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Login
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Dispensary portal access. Log in to manage orders, view invoices, track
        deliveries, and access your Frost wholesale account.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
