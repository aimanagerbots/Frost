import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <LayoutDashboard size={48} style={{ color: '#667EEA' }} />
      <h1 className="text-2xl font-bold text-text-bright">Dashboard</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
