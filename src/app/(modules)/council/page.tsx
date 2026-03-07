import { BookOpen } from 'lucide-react';

export default function CouncilPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <BookOpen size={48} style={{ color: '#6366F1' }} />
      <h1 className="text-2xl font-bold text-text-bright">Council</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
