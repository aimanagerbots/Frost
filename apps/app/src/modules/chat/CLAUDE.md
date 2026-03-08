# Chat Module

Accent color: #06B6D4

Two-tab chat interface: AI Chat (conversational AI assistant with 5 demo conversations) and Team Chat (internal team messaging with channels, DMs, and auto-translation between English and Spanish speakers).

## Key Components
- ChatPageWrapper — Tab bar switching between AI Chat and Team Chat
- ChatPage (original) — AI assistant chat interface with sidebar + message area
- TeamChatPage — Three-panel layout: sidebar + thread + context panel
- TeamChatSidebar — 280px left panel with channels list and DM list
- TeamChatThread — Center panel with message list and input
- TeamChatMessage — Individual message with translation toggle
- TeamChatContextPanel — 280px collapsible right panel (channel info or user profile)
- MemberAvatar — Initials-based avatar with online status dot

## Data Shape
- ChatMessage, ChatConversation, ChatSuggestion (AI Chat types)
- TeamMember, TeamChannel, TeamDM, TeamChatMessage (Team Chat types in types/team-chat.ts)
- Mock data in src/mocks/chat.ts (AI) and src/mocks/team-chat.ts (Team)
- Zustand store in store.ts (tab state, active view, context panel, translation toggles)
