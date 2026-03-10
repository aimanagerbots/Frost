import { Suspense } from "react";
import { getMerchItems } from "@/mocks/merch";
import { MerchBrowseClient } from "@/components/merch/MerchBrowseClient";

export const metadata = { title: "Merch | Frost" };

export default function MerchPage() {
  const items = getMerchItems();
  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <Suspense fallback={null}>
          <MerchBrowseClient items={[...items]} />
        </Suspense>
      </div>
    </section>
  );
}
