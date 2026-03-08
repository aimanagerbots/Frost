import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGateModal } from "@/components/layout/AgeGateModal";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AgeGateModal />
      <Header />
      {children}
      <Footer />
    </>
  );
}
