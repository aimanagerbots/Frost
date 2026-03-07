export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-text-bright mb-4">
          Frost
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mb-8">
          Craft cannabis cultivated with care. Premium flower, prerolls,
          concentrates, and more — available at dispensaries across Washington.
        </p>
        <div className="flex gap-4">
          <a
            href="/products"
            className="px-6 py-3 bg-accent-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Explore Products
          </a>
          <a
            href="/find"
            className="px-6 py-3 border border-border-default rounded-xl font-medium hover:bg-card-hover transition-colors"
          >
            Find Near You
          </a>
        </div>
      </section>
    </main>
  );
}
