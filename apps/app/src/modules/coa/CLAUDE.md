# COA Manager Module

Accent color: #9333EA

Manages Certificate of Analysis submissions for lab testing compliance. Tracks submissions through: Submitted → In Testing → Passed/Failed → Remediation. Displays full cannabinoid profiles, terpene charts, and contaminant test results for passed submissions.

## Key Components
- COAManagerPage — Main page with metrics, testing pipeline, submissions DataTable
- COADrawer — Full COA detail with conditional rendering by status
- COAResults — Cannabinoid bars, terpene bar chart (Recharts), contaminant table

## Data Shape
- COASubmission, COAResults, COAMetrics, TerpeneEntry, ContaminantEntry (src/modules/coa/types/)
- Mock data in src/mocks/coa.ts (20 submissions, 3 labs, realistic cannabinoid data)
- TanStack Query hooks in src/modules/coa/hooks/ (3 hooks)
