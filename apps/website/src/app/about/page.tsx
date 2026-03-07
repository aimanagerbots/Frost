import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        About Frost
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Our story, mission, and values. Learn how Frost is raising the bar for
        premium cannabis in Washington State through craft cultivation and
        rigorous quality standards.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
