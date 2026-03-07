import { FolderKanban } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <FolderKanban size={48} style={{ color: '#7C3AED' }} />
      <h1 className="text-2xl font-bold text-text-bright">Projects</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
