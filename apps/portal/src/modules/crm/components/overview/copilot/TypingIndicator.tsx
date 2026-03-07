'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/20 text-xs font-bold text-[#F59E0B]">
        AI
      </div>
      <div className="flex items-center gap-1.5 rounded-xl bg-card border border-default px-4 py-3">
        <span className="typing-dot h-2 w-2 rounded-full bg-[#F59E0B]" style={{ animationDelay: '0ms' }} />
        <span className="typing-dot h-2 w-2 rounded-full bg-[#F59E0B]" style={{ animationDelay: '150ms' }} />
        <span className="typing-dot h-2 w-2 rounded-full bg-[#F59E0B]" style={{ animationDelay: '300ms' }} />
        <style>{`
          @keyframes typingBounce {
            0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-4px); }
          }
          .typing-dot {
            animation: typingBounce 1.4s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
