import { BarChart3 } from 'lucide-react';

export default function VMIPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <BarChart3 size={48} style={{ color: '#EF4444' }} />
      <h1 className="text-2xl font-bold text-text-bright">VMI</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
