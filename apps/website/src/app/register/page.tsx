import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Dispensary Registration
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Licensed dispensary signup. Register your retail location to access
        wholesale ordering, VMI integration, and the Frost dispensary portal.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
