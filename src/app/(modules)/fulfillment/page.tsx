import { BoxSelect } from 'lucide-react';

export default function FulfillmentPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <BoxSelect size={48} style={{ color: '#14B8A6' }} />
      <h1 className="text-2xl font-bold text-text-bright">Fulfillment</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
