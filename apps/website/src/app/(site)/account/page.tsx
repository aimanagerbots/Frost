import { AccountPageClient } from '@/components/account/AccountPageClient';

export const metadata = { title: 'My Account | Frost' };

export default function AccountPage() {
  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <AccountPageClient />
      </div>
    </section>
  );
}
