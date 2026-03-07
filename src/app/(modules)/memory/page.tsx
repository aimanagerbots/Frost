import { Brain } from 'lucide-react';

export default function MemoryPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Brain size={48} style={{ color: '#8B5CF6' }} />
      <h1 className="text-2xl font-bold text-text-bright">Memory</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
