import { Leaf } from 'lucide-react';

export default function CultivationPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Leaf size={48} style={{ color: '#22C55E' }} />
      <h1 className="text-2xl font-bold text-text-bright">Cultivation</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
