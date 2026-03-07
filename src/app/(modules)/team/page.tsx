import { UsersRound } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <UsersRound size={48} style={{ color: '#0D9488' }} />
      <h1 className="text-2xl font-bold text-text-bright">Team</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
