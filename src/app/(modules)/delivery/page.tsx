import { Truck } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Truck size={48} style={{ color: '#0EA5E9' }} />
      <h1 className="text-2xl font-bold text-text-bright">Delivery</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
