import { Megaphone } from 'lucide-react';

export default function ContentPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Megaphone size={48} style={{ color: '#EC4899' }} />
      <h1 className="text-2xl font-bold text-text-bright">Content</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
