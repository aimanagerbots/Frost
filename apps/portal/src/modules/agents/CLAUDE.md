# Agent Hub

Accent color: #06B6D4

Central hub for managing AI agents that automate operational tasks across the platform. Users can view agent status, review recent actions, approve pending items, and chat with agents for insights.

## Key Components
- AgentHubPage — Main layout with metrics, agent directory grid, chat drawer, and actions feed

## Data Shape
- Agent — id, name, specialty, description, avatar, status, capabilities, actionsToday, approvalRate
- AgentAction — id, agentId, agentName, type, description, status, target, timestamp, result
- AgentConversation — id, agentId, messages (role, content, timestamp, references)
