'use client';

import { FileText, Share2, AlertTriangle, Clock, Building2 } from 'lucide-react';
import { DrawerPanel, StatusBadge } from '@/components';
import { COAResultsDisplay } from './COAResults';
import type { COASubmission, COAStatus } from '../types';

const ACCENT = '#9333EA';

const statusVariant = (s: COAStatus) => {
  const map: Record<COAStatus, 'info' | 'warning' | 'success' | 'danger' | 'muted'> = {
    submitted: 'info',
    'in-testing': 'warning',
    passed: 'success',
    failed: 'danger',
    remediation: 'muted',
  };
  return map[s];
};

const labContact: Record<string, string> = {
  'Confidence Analytics': '(206) 555-0100',
  'Steep Hill': '(206) 555-0200',
  'Green Leaf Labs': '(206) 555-0300',
};

interface COADrawerProps {
  submission: COASubmission | null;
  open: boolean;
  onClose: () => void;
}

export function COADrawer({ submission, open, onClose }: COADrawerProps) {
  if (!submission) return null;

  const isPassed = submission.status === 'passed';
  const isFailed = submission.status === 'failed';
  const isRemediation = submission.status === 'remediation';
  const isPending = submission.status === 'submitted' || submission.status === 'in-testing';

  return (
    <DrawerPanel open={open} onClose={onClose} title={`Batch ${submission.batchNumber}`} width="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-default">{submission.productName}</h3>
              <p className="text-sm text-text-muted">{submission.strainName} — {submission.category}</p>
            </div>
            <StatusBadge
              label={submission.status.replace(/-/g, ' ')}
              variant={statusVariant(submission.status)}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {submission.labName}
            </span>
            <span>Submitted: {submission.submittedDate}</span>
            <span>Expected: {submission.expectedReturn}</span>
          </div>
        </div>

        {/* Passed: full results */}
        {isPassed && submission.results && (
          <>
            <COAResultsDisplay results={submission.results} />
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: ACCENT }}
              >
                <FileText className="h-4 w-4" />
                View COA PDF
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-default px-4 py-2 text-sm font-medium text-text-default hover:bg-elevated transition-colors">
                <Share2 className="h-4 w-4" />
                Share with Account
              </button>
            </div>
          </>
        )}

        {/* Failed: results with red highlights */}
        {isFailed && submission.results && (
          <>
            <COAResultsDisplay results={submission.results} highlightFailures />
            {submission.remediationNotes && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <h4 className="text-sm font-medium text-red-400">Failure Details</h4>
                </div>
                <p className="text-sm text-text-default">{submission.remediationNotes}</p>
              </div>
            )}
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 hover:bg-red-700"
            >
              Create Remediation Task
            </button>
          </>
        )}

        {/* Remediation */}
        {isRemediation && (
          <>
            {submission.results && (
              <COAResultsDisplay results={submission.results} highlightFailures />
            )}
            {submission.remediationNotes && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <h4 className="text-sm font-medium text-amber-400">Remediation In Progress</h4>
                </div>
                <p className="text-sm text-text-default">{submission.remediationNotes}</p>
              </div>
            )}
          </>
        )}

        {/* Pending: expected return + lab info */}
        {isPending && (
          <div className="space-y-4">
            <div className="rounded-xl border border-default bg-elevated p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: ACCENT }} />
                <h4 className="text-sm font-medium text-text-default">Awaiting Results</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Expected Return</span>
                  <p className="text-text-default font-medium">{submission.expectedReturn}</p>
                </div>
                <div>
                  <span className="text-text-muted">Lab Contact</span>
                  <p className="text-text-default font-medium">{labContact[submission.labName] ?? 'N/A'}</p>
                </div>
              </div>
            </div>
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: ACCENT }}
            >
              Check Status
            </button>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
