import Link from "next/link";

export default async function StrainDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-text-bright mb-4">
        Strain Detail
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Viewing strain: <span className="text-text-bright">{slug}</span>. This
        page will display genetics info, terpene wheel, effects, growing notes,
        and available products.
      </p>
      <Link href="/strains" className="text-accent-primary hover:underline">
        Back to Strain Library
      </Link>
    </main>
  );
}
