# Approvals

Accent color: #FBBF24

Human-in-the-loop review queue for AI agent actions. Users can approve, modify, or reject agent-generated emails, orders, schedule changes, price adjustments, and task assignments before they execute.

## Key Components
- ApprovalsPage — Main layout with metrics, filter row, pending queue cards with preview expansion, and history DataTable

## Data Shape
- ApprovalRequest — id, agentId, agentName, type, status, priority, title, description, preview, target, createdAt, reviewedAt, reviewedBy, modificationNotes
