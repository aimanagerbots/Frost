import { CalendarDays } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <CalendarDays size={48} style={{ color: '#3B82F6' }} />
      <h1 className="text-2xl font-bold text-text-bright">Calendar</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
