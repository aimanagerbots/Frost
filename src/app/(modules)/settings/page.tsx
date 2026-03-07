import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
      <Settings size={48} style={{ color: '#94A3B8' }} />
      <h1 className="text-2xl font-bold text-text-bright">Settings</h1>
      <p className="text-text-muted">Coming soon</p>
    </div>
  );
}
