import { Sparkles } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Sparkles size={48} style={{ color: '#06B6D4' }} />
      <h1 className="text-2xl font-bold text-text-bright">Insights</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
