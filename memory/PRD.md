# SAURIENT Carbon Passport Platform — MRV & Independent Verification

## Original Problem Statement
Enhancement to the existing Saurient Carbon Passport Platform: build the complete inner-page workflow for **MRV & Independent Verification** — 12 connected tabs sharing one verification engagement (VER-026) for a PCF claim that originates in Carbon Accounting. Must be a fully clickable enterprise demo (no dead buttons), keep the existing visual language (dark navy sidebar, light workspace, Saurient green), and never duplicate/disconnect PCF data. Verified result feeds Carbon Passport issuance.

## Architecture
- **Pure frontend mock** (React 19 + react-router 7). All state in `MrvContext` (in-memory, resets on refresh — per user choice).
- Existing template shell recreated to match reference screenshot (Sidebar + global Topbar with demo role switcher).
- Shadcn/UI components; Tailwind; `sonner` toasts; lucide-react icons; Plus Jakarta Sans font; Saurient-green primary token.
- No backend used (stock hello-world FastAPI untouched).

### Key files
- `src/context/MrvContext.jsx` — single source of truth: engagement state, evidence, findings, corrections, audit trail, workflow stage statuses, final verification **gate** + `canRelease`, dynamic `verifiedIntensity`/`verifiedTotal`, all actions.
- `src/components/mrv/MrvPage.jsx` — `/mrv/:tab` routing, header (breadcrumb/filters/SIMULATED badge), dynamic **Primary action**, Download menu (12 exports), global search.
- `src/components/mrv/WorkflowTracker.jsx` — 12-stage tracker (✓/○/!/×), clickable → tab.
- `src/pages/mrv/*.jsx` — 12 tabs.
- `src/pages/CrossModule.jsx` — deep-link targets (Home, Organisation, Data, PCF Inventory/Calculation/Report/etc., Carbon Passport w/ QR).
- `src/data/mockData.js` — realistic demo data.

## User Personas / Roles (demo role switcher)
Company Operator, Carbon Manager, Verifier (default), Technical Reviewer, Organisation Admin, Public Viewer — Verifier-only actions disabled for other roles.

## Core Requirements (static)
- 12 functional tabs: Readiness, Evidence Vault, Calculation Review, Data Freeze, Verifiers, Engagements, Conflict Check, Plan, Site Visits, Findings, Corrections, Report.
- Immutable data freeze; corrections create V1.1 (never overwrite frozen V1.0); technical review gate; traceability; audit trail; verified handoff → PCF → Carbon Passport.

## Implemented (2026-06-29)
- All 12 tabs fully clickable: KPIs, tables, filters, drawers, modals, checklists, calc tree, timelines, version control, gate.
- End-to-end gate flow enabling **Release Verified Result**; dynamic verified PCF (2.84 → 2.86 after accepted correction), V1.1 as final version.
- Cross-module deep links + Carbon Passport issuance with QR + public verification link.
- Download menu (incl. Evidence Register CSV), global search, audit trail drawer, role-based gating.
- Tested via testing_agent: **100% frontend, no bugs**.

## Backlog (P1/P2 — not requested, future)
- P2: persist state to backend/MongoDB so refresh survives.
- P2: real PDF export of verification report; real file uploads for evidence.
- P2: multi-engagement list / more products.

## Next Tasks
- Await user feedback; optionally add persistence or PDF export.
