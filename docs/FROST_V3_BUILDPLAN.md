# Frost V3 Build Plan

Created: 2026-03-07

## Overview

V3 restructures the platform around the A/I/R (Active/Inactive/Recovery) pipeline system, overhauls CRM KPIs, and expands marketing capabilities. Five implementation phases.

---

## Phase 1: Pipeline + CRM KPI Overhaul (Current)

### A/I/R Pipeline System
15-cell matrix: 3 statuses x 5 phases driving CRM behavior, AI prioritization, and dashboard KPIs.

**Active Pipeline (A1-A5)**
- A1 Onboarding: New accounts, first 3 orders
- A2 Growing: Increasing order frequency/basket
- A3 Stable: Consistent ordering pattern
- A4 Declining: Order frequency or basket shrinking
- A5 Critical: At risk of going inactive

**Inactive Pipeline (I1-I5)**
- I1 Recently Lapsed: No order in 14-30 days
- I2 Cooling: No order in 31-60 days
- I3 Dormant: No order in 61-90 days
- I4 Disengaged: No order in 91-180 days
- I5 Lost: No order in 180+ days

**Recovery Pipeline (R1-R5)**
- R1 Re-engaged: First order after lapse
- R2 Rebuilding: 2nd-3rd order post-recovery
- R3 Stabilizing: Approaching previous run rate
- R4 Strengthening: Meeting or exceeding previous metrics
- R5 Graduated: Returns to Active pipeline

### CRM KPI Framework
7 health categories with 8-factor weighted health score:

1. **Order Frequency** (weight: 20%) - Orders per month vs historical average
2. **Basket Composition** (weight: 15%) - SKU count, category diversity
3. **Sell-Through Rate** (weight: 15%) - VMI velocity percentage
4. **Revenue Trend** (weight: 15%) - 30-day vs prior 30-day
5. **Payment Health** (weight: 10%) - Avg days to pay, reliability score
6. **Relationship Score** (weight: 15%) - Interaction recency, NPS proxy
7. **Competitive Position** (weight: 10%) - Share of wallet estimate

### Deliverables
- Pipeline types on Account model (pipelineStatus, pipelinePhase, pipelineHistory)
- Pipeline module (/pipeline) with 3x5 funnel visualization
- CRM Dashboard rebuilt with pipeline-aware KPI charts
- Pipeline badge on Account Detail header
- Pipeline transition items in AI briefing

---

## Phase 2: Sidebar Restructure

Reorganize 29 modules into cleaner navigation groups:

**MAIN**: Dashboard, Tasks, Calendar
**SALES & CRM**: CRM, Pipeline, Orders, VMI, Competitor Intel
**OPERATIONS**: Cultivation, Manufacturing, Packaging, Inventory, Fulfillment, Delivery
**MARKETING**: Content, Product Planning
**LAB / QUALITY**: COA Manager
**AI & KNOWLEDGE**: Agent Hub, Approvals, Council, Insights, Memory
**WORKSPACE**: Projects, Meetings, Docs, Team
**FINANCE**: Finance, Reports
**ADMIN**: Settings, System

---

## Phase 3: Marketing Expansion

- Campaign builder with A/B testing
- Content calendar integration
- Vendor day scheduling and ROI tracking
- Brand asset management
- Social media integration

---

## Phase 4: AI Enhancement

- Pipeline-aware AI briefings
- Automated playbook triggers based on pipeline transitions
- Predictive churn scoring using pipeline velocity
- Recovery playbook recommendations
- Cross-module AI council integration

---

## Phase 5: Analytics & Reporting Overhaul

- Pipeline analytics dashboard
- Cohort analysis by pipeline phase
- Recovery success metrics
- Revenue attribution by pipeline stage
- Executive summary reports

---

## Module Accent Colors (unchanged)
Dashboard #667EEA, CRM #F59E0B, Pipeline #F59E0B, Tasks #8B5CF6, Calendar #3B82F6,
Agents #06B6D4, Orders #F59E0B, VMI #EF4444, Content #EC4899,
Competitors #F97316, Cultivation #22C55E, Manufacturing #10B981,
Packaging #84CC16, Inventory #8B5CF6, Fulfillment #14B8A6,
Delivery #0EA5E9, COA #9333EA, Approvals #FBBF24, Council #6366F1,
Memory #8B5CF6, Insights #06B6D4, Projects #7C3AED, Products #DB2777,
Meetings #2563EB, Docs #64748B, Team #0D9488, Finance #059669,
Reports #475569, Settings #94A3B8, System #64748B
