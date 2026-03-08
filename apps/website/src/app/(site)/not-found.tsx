import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-lg text-text-muted mb-8">
        The page you are looking for does not exist or has been moved. It might
        have gone up in smoke.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
