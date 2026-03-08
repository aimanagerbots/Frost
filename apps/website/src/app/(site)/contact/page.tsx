import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Contact
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Get in touch with the Frost team. Whether you have questions about our
        products, partnership opportunities, or general inquiries, we would love
        to hear from you.
      </p>
      <Link href="/" className="text-accent-primary hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
