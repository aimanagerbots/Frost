export interface ApprovalRequest {
  id: string;
  agentId: string;
  agentName: string;
  type: 'email' | 'order' | 'schedule-change' | 'price-adjustment' | 'task-assignment';
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  priority: 'urgent' | 'normal' | 'low';
  title: string;
  description: string;
  preview: string;
  target: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  modificationNotes?: string;
}
