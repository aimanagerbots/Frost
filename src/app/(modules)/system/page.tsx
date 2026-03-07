import { Server } from 'lucide-react';

export default function SystemPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Server size={48} style={{ color: '#64748B' }} />
      <h1 className="text-2xl font-bold text-text-bright">System</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
