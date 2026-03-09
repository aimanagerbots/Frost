import { Suspense } from "react";
import { getAllProducts } from "@/mocks/products";
import { getAllDispensaries } from "@/mocks/dispensaries";
import { OrderBrowseClient } from "./OrderBrowseClient";

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-black min-h-screen" />}>
      <OrderBrowseClient
        products={getAllProducts()}
        dispensaries={getAllDispensaries()}
      />
    </Suspense>
  );
}
