import { getAllStrains } from "@/mocks/strains";
import { StrainsPageClient } from "./StrainsPageClient";

export default function StrainsPage() {
  const strains = getAllStrains();

  return (
    <section className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <StrainsPageClient strains={strains} />
      </div>
    </section>
  );
}
