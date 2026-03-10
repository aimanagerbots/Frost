import { cookies } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGateModal } from "@/components/layout/AgeGateModal";
import { CartDrawer } from "@/components/order/CartDrawer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = (await cookies()).get('site-auth')?.value === 'true';

  return (
    <>
      <AgeGateModal isAuthed={isAuthed} />
      <Header />
      <main style={{ paddingTop: 88 }}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
