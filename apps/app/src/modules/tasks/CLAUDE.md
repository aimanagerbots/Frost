# Tasks

Accent color: #8B5CF6

The Tasks module is the personal and team task manager where work orders, AI-generated tasks, meeting action items, and manual tasks all live. Supports both Kanban board (drag-and-drop) and list views with comprehensive filtering.

## Key Components
- TasksPage — Main layout with view toggle (board/list), filters, and drawer
- TaskBoard — Kanban board using KanbanBase with 4 columns (To Do, In Progress, Done, Blocked)
- TaskCard — Compact card with priority badge, assignee, due date, source icon
- TaskDrawer — Full task detail panel with status, description, tags, timestamps
- TaskFilters — Filter row for status, priority, assignee, source, module

## Data Shape
- Task — id, title, description, status, priority, assignee, dueDate, source, module, tags
- TaskFilter — status, priority, assignee, module, source, search
- TaskBoard — columns with task IDs per status
