export type MeetingType = 'sales-call' | 'standup' | 'account-review' | 'planning' | 'training';
export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled';

export interface MeetingActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export interface Meeting {
  [key: string]: unknown;
  id: string;
  title: string;
  type: MeetingType;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  accountId?: string;
  status: MeetingStatus;
  notes?: string;
  actionItems: MeetingActionItem[];
  recordingUrl?: string;
}

export interface MeetingFilter {
  type?: MeetingType;
  status?: MeetingStatus;
  search?: string;
}
