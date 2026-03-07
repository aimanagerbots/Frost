import { ShieldCheck } from 'lucide-react';

export default function ApprovalsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <ShieldCheck size={48} style={{ color: '#FBBF24' }} />
      <h1 className="text-2xl font-bold text-text-bright">Approvals</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
