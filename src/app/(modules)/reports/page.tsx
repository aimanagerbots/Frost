import { PieChart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <PieChart size={48} style={{ color: '#475569' }} />
      <h1 className="text-2xl font-bold text-text-bright">Reports</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
