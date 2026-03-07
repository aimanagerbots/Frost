# Council

Accent color: #6366F1

AI-powered knowledge base and multi-agent decision engine. Users can browse categorized knowledge entries (compliance, SOPs, playbooks) and run council sessions where multiple AI agents provide perspectives on strategic questions, synthesized into actionable recommendations.

## Key Components
- CouncilPage — Main layout with knowledge base grid and council sessions
- KnowledgeCard — Individual knowledge entry card with category badge, preview, metadata
- SessionCard — Expandable council session showing agent perspectives and synthesis

## Data Shape
- KnowledgeEntry — id, title, category, content, lastUpdated, updatedBy, referencedCount
- CouncilSession — id, question, agents (AgentPerspective[]), synthesis, timestamp, status
- AgentPerspective — name, perspective
