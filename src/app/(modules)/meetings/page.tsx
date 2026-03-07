import { Video } from 'lucide-react';

export default function MeetingsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Video size={48} style={{ color: '#2563EB' }} />
      <h1 className="text-2xl font-bold text-text-bright">Meetings</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
