import { DollarSign } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <DollarSign size={48} style={{ color: '#059669' }} />
      <h1 className="text-2xl font-bold text-text-bright">Finance</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
