import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGateModal } from "@/components/layout/AgeGateModal";
import { CartDrawer } from "@/components/order/CartDrawer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AgeGateModal />
      <Header />
      <main style={{ paddingTop: 88 }}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
