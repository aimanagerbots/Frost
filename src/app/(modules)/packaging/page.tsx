import { Package } from 'lucide-react';

export default function PackagingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Package size={48} style={{ color: '#84CC16' }} />
      <h1 className="text-2xl font-bold text-text-bright">Packaging</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
