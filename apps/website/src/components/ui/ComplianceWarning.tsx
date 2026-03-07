import { AlertTriangle } from "lucide-react";
import { COMPLIANCE_TEXT } from "@/lib/constants";

interface ComplianceWarningProps {
  variant: "footer" | "product";
}

export function ComplianceWarning({ variant }: ComplianceWarningProps) {
  if (variant === "footer") {
    return (
      <p className="text-xs text-text-muted leading-relaxed max-w-prose">
        {COMPLIANCE_TEXT}
      </p>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border-default bg-card p-4">
      <AlertTriangle className="h-5 w-5 shrink-0 text-accent-primary mt-0.5" />
      <p className="text-sm text-text-muted leading-relaxed">
        {COMPLIANCE_TEXT}
      </p>
    </div>
  );
}
