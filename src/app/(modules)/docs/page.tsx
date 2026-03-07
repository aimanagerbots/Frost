import { FileText } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <FileText size={48} style={{ color: '#64748B' }} />
      <h1 className="text-2xl font-bold text-text-bright">Docs</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
