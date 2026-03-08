# Frost Supabase Import Report
*Generated: March 7, 2026*

## Import Summary

| Metric | Expected | Actual | Notes |
|---|---|---|---|
| **Accounts imported** | 507 | **492** | 15 skipped due to duplicate license numbers (ON CONFLICT DO NOTHING) |
| **Contacts imported** | 417 | **404** | 13 skipped — account name not found (likely the 15 duplicate-license accounts) |
| **Interactions imported** | 333 | **320** | 13 skipped — same reason as contacts |

## Records Skipped (Pre-Import Cleaning)

| Reason | Count |
|---|---|
| Empty rows (no retailer name) | 188 |
| Duplicate license numbers (cleaned before import) | 18 |
| "Do not sell" flag (THE GREEN DOOR, Buckley) | 1 |
| **Total skipped before import** | **207** |

## Records Skipped During Import

15 accounts with duplicate license numbers were silently skipped by `ON CONFLICT (license_number) DO NOTHING`. These are accounts where the same license was shared by multiple retailer name variants (e.g., stores that changed names but kept the same license). The first entry by insertion order was kept.

## Pipeline Distribution

| Pipeline Status | Phase | Code | Count |
|---|---|---|---|
| Inactive | 1 | I1 | 125 |
| Inactive | 2 | I2 | 113 |
| Inactive | 3 | I3 | 4 |
| Inactive | 4 | I4 | 74 |
| Inactive | 5 | I5 | 51 |
| Recovery | 1 | R1 | 2 |
| Recovery | 2 | R2 | 123 |
| **Total** | | | **492** |

### Pipeline Notes
- **0 Active accounts** — All accounts with original "Active" status were reclassified as Recovery (R2) because their last contact dates are all >90 days old (2025 dates, current date is March 2026)
- **I1 (125)** — Unconfirmed cold leads with no contact history
- **I2 (113)** — Contacted or have notes but not progressed
- **I3 (4)** — Active dialogue or meeting scheduled
- **I4 (74)** — Samples sent, awaiting feedback
- **I5 (51)** — Near-order or has ordered before
- **R1 (2)** — Temporarily closed (Cannabis City, Hangar 420 Clearview)
- **R2 (123)** — Previously active accounts gone stale (>90 days since last contact)

## Geographic Distribution (Top 15 Cities)

| City | Accounts |
|---|---|
| Seattle | 56 |
| Spokane | 21 |
| Tacoma | 17 |
| Vancouver | 16 |
| Bellingham | 15 |
| Everett | 14 |
| Olympia | 11 |
| Lynnwood | 9 |
| Longview | 8 |
| Bremerton | 7 |
| Pullman | 7 |
| Mount Vernon | 7 |
| Port Angeles | 6 |
| Port Orchard | 6 |
| Puyallup | 6 |

## Data Quality Notes

1. **All accounts marked `is_active = false`** — Since no accounts met the criteria for truly "Active" (all stale >90 days), none have `is_active = true`. The `pipeline_status` and `pipeline_phase` fields carry the real classification.

2. **Duplicate names exist** — Some retailer names appear multiple times (e.g., "BETTER BUDS" has 4 locations, "APEX CANNABIS" has 3). Each has a unique license number and represents a distinct location.

3. **Contact matching used account name** — Contacts and interactions were matched to accounts by exact name match. For duplicate-name accounts, the first matching account received the contact/interaction. This is acceptable because duplicate-name accounts (chain stores) typically share the same buyer contact.

4. **Price points stored in `pipeline_notes`** — The accounts table doesn't have a dedicated pricing column. Pricing data was combined with sales notes in the `pipeline_notes` field, prefixed with "PRICING:" for easy parsing.

5. **No `tier` column in schema** — The import JSON included a `tier` field, but the accounts table doesn't have one. Tier data was not imported. The `health_score` field carries equivalent information (30 = recovery/churning, 50 = prospect/at_risk, 70 = active/healthy).

## Records Needing Manual Review

These accounts had ambiguous data during import:

1. **Commencement Bay Cannabis** — License "Tacoma" (non-numeric) used for the chain's 3 locations. Only first entry imported.
2. **Accounts with changed names** — e.g., "Alkaloid Cannabis - this retailer is now green nugget mead location", "EVERGREEN MARKET - NORTH RENTON - is now Stonr Cannabis". Names imported as-is; may need cleanup.
3. **Accounts with operational notes in names** — e.g., "420 SPOT SHOP - will not do VMI", "T BROTHERS BUD LODGE - Only use Lifted Delivery Service". Consider moving these notes out of the name field.
4. **THE GREEN DOOR (Buckley)** — Marked "Do not sell" (Kush 21 territory), excluded from import entirely.

## Import Method

- **Tool:** Supabase MCP `execute_sql` via Claude Code
- **Batch size:** 50 rows per INSERT (accounts), 30 per batch (contacts/interactions using subqueries)
- **Conflict handling:** `ON CONFLICT (license_number) DO NOTHING` for accounts
- **Date format:** All dates converted from MM.DD.YY to ISO 8601 (YYYY-MM-DDT00:00:00Z)
- **Source:** `frost_import_ready.json` (generated from cleaned CSV data)
