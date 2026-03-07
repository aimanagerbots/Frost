import { Users } from 'lucide-react';

export default function CRMPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Users size={48} style={{ color: '#F59E0B' }} />
      <h1 className="text-2xl font-bold text-text-bright">CRM</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
