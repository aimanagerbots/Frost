import { Lightbulb } from 'lucide-react';

export default function ProductPlanningPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Lightbulb size={48} style={{ color: '#DB2777' }} />
      <h1 className="text-2xl font-bold text-text-bright">Product Planning</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
