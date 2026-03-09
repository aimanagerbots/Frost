import { Suspense } from "react";
import { getAllProducts } from "@/mocks/products";
import { getAllDispensaries } from "@/mocks/dispensaries";
import FindPageClient from "./FindPageClient";

export default function FindPage() {
  return (
    <main className="flex flex-col" style={{ height: 'calc(100vh - 57px)', marginTop: '57px' }}>
      <Suspense fallback={<div className="flex-1 bg-black" />}>
        <FindPageClient
          products={getAllProducts()}
          dispensaries={getAllDispensaries()}
        />
      </Suspense>
    </main>
  );
}
