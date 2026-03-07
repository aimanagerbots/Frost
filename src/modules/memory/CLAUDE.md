# Memory

Accent color: #8B5CF6

AI knowledge base and pattern recognition module. Displays what the AI has learned across all modules, organized into three memory layers (System Identity, Structured Facts, Semantic Search). Users can browse facts by category, filter by confidence and verification status, and explore discovered patterns with supporting evidence.

## Key Components
- MemoryPage — Main page with layers overview, searchable facts browser, and patterns section

## Data Shape
- MemoryFact — Individual knowledge items with content, source, confidence, category, verification
- MemoryPattern — Discovered patterns with title, description, confidence, and evidence array
- MemoryLayer — Three-tier memory architecture (system-identity, structured-facts, semantic-search)
