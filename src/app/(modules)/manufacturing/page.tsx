import { Factory } from 'lucide-react';

export default function ManufacturingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Factory size={48} style={{ color: '#10B981' }} />
      <h1 className="text-2xl font-bold text-text-bright">Manufacturing</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
