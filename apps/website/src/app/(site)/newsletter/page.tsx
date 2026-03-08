'use client';

export default function NewsletterPage() {
  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-text-bright">
          Stay Frosty
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          Get product drops, strain spotlights, and dispensary updates delivered
          to your inbox. No spam, just the good stuff.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-0"
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            className="flex-1 rounded-full border border-border-default bg-elevated/50 px-6 py-3 text-sm text-text-default placeholder:text-text-muted outline-none transition-colors focus:border-accent-primary sm:rounded-r-none"
          />
          <button
            type="submit"
            className="rounded-full bg-accent-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-text-on-dark transition-colors hover:bg-accent-primary-hover sm:rounded-l-none"
          >
            Subscribe
          </button>
        </form>

        <p className="mt-6 text-xs text-text-muted">
          By subscribing you agree to our privacy policy. Unsubscribe anytime.
        </p>
      </div>
    </main>
  );
}
