// Saurient Carbon Passport — MRV & Independent Verification demo data
// Single source of truth for the verification engagement VER-026

export const ENGAGEMENT_META = {
  organisation: "Asante Cocoa Cooperative",
  facility: "Tema Processing Plant",
  country: "Ghana",
  reportingPeriod: "FY 2026",
  product: "Refined Cocoa Butter",
  productCode: "CCB-001",
  batch: "CB-2026-001",
  pcfProject: "PCF-GH-2026-001",
  submittedVersion: "V1.0",
  productionQuantity: "100,000 kg",
  productionQuantityKg: 100000,
  boundary: "Cradle-to-Gate",
  claimedTotal: 284.0, // tCO2e
  claimedIntensity: 2.84, // kgCO2e/kg
  dataQuality: 92,
  engagementId: "VER-026",
  evidenceItems: 186,
  acceptedEvidence: 179,
  readiness: 91,
  activityRecords: 48,
  verifierOrg: "Meridian Assurance Ltd",
  leadVerifier: "Dr. Kofi Mensah",
  technicalReviewer: "Ir. Anneke de Vries",
};

export const WORKFLOW_STAGES = [
  { key: "readiness", label: "READINESS", tab: "readiness" },
  { key: "evidence", label: "EVIDENCE", tab: "evidence" },
  { key: "calculation", label: "CALCULATION REVIEW", tab: "calculation" },
  { key: "freeze", label: "DATA FREEZE", tab: "freeze" },
  { key: "verifier", label: "VERIFIER", tab: "verifiers" },
  { key: "conflict", label: "CONFLICT CHECK", tab: "conflict" },
  { key: "plan", label: "PLAN", tab: "plan" },
  { key: "sitevisit", label: "SITE VISIT", tab: "sitevisits" },
  { key: "findings", label: "FINDINGS", tab: "findings" },
  { key: "corrections", label: "CORRECTIONS", tab: "corrections" },
  { key: "technical", label: "TECHNICAL REVIEW", tab: "report" },
  { key: "verified", label: "VERIFIED", tab: "report" },
];

export const TABS = [
  { key: "readiness", label: "Readiness", primary: "Resolve Blockers" },
  { key: "evidence", label: "Evidence Vault", primary: "Add Evidence" },
  { key: "calculation", label: "Calculation Review", primary: "Complete Review" },
  { key: "freeze", label: "Data Freeze", primary: "Freeze Dataset" },
  { key: "verifiers", label: "Verifiers", primary: "Assign Verifier" },
  { key: "engagements", label: "Engagements", primary: "Open Engagement" },
  { key: "conflict", label: "Conflict Check", primary: "Complete Conflict Check" },
  { key: "plan", label: "Plan", primary: "Approve Verification Plan" },
  { key: "sitevisits", label: "Site Visits", primary: "Complete Site Visit" },
  { key: "findings", label: "Findings", primary: "Raise Finding" },
  { key: "corrections", label: "Corrections", primary: "Submit Corrections" },
  { key: "report", label: "Report", primary: "Finalise Verification" },
];

export const ROLES = [
  "Company Operator",
  "Carbon Manager",
  "Verifier",
  "Technical Reviewer",
  "Organisation Admin",
  "Public Viewer",
];

export const READINESS_CHECKS = [
  { req: "Organisation Identity", source: "Organisation Module", status: "PASSED", link: "/organisation" },
  { req: "Facility Boundary", source: "Organisation Module", status: "PASSED", link: "/pcf/boundary" },
  { req: "Product Definition", source: "PCF", status: "PASSED", link: "/pcf/output" },
  { req: "Functional Unit", source: "PCF", status: "PASSED", link: "/pcf/output" },
  { req: "System Boundary", source: "PCF", status: "PASSED", link: "/pcf/boundary" },
  { req: "Activity Inventory", source: "PCF", status: "PASSED", link: "/pcf/inventory" },
  { req: "Emission Factors", source: "Calculation Engine", status: "PASSED", link: "/pcf/calculation" },
  { req: "Allocation", source: "PCF", status: "PASSED", link: "/pcf/allocation" },
  { req: "Logistics", source: "PCF", status: "PASSED", link: "/pcf/logistics" },
  { req: "Calculation", source: "PCF", status: "PASSED", link: "/pcf/calculation" },
  { req: "Data Quality", source: "PCF", status: "PASSED", link: "/pcf/calculation" },
  { req: "Evidence Coverage", source: "Evidence Vault", status: "WARNING", issue: "2 evidence issues", link: "mrv:evidence" },
  { req: "Internal Approval", source: "Approval Workflow", status: "PENDING", issue: "Awaiting sign-off", link: null },
];

export const EVIDENCE_CATEGORIES = [
  "All", "Meter Data", "Utility Bills", "Fuel", "Supplier Data", "Production",
  "ERP", "Logistics", "Emission Factors", "Allocation", "Methodology",
  "Photos", "Certificates", "Site Visit", "Other",
];

export const EVIDENCE = [
  { id: "EVD-00184", title: "Electricity Meter Export", desc: "Half-hourly kWh export from main incomer for March 2026.", category: "Meter Data", activity: "ACT-0021", calc: "CALC-0038", source: "Schneider PAS800", sourceSystem: "PAS800 SCADA", period: "March 2026", uploadedBy: "System", uploadedAt: "2026-04-02 08:14", hash: "a91f…3e77", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-09", comment: "Reconciles to inventory ACT-0021.", provenance: ["PAS800", "Raw Meter Record", "Evidence Object", "Activity Record ACT-0021", "Calculation Line CALC-0038", "PCF Result"] },
  { id: "EVD-00183", title: "Utility Invoice — ECG", desc: "Electricity Company of Ghana invoice, Q1 2026.", category: "Utility Bills", activity: "ACT-0021", calc: "CALC-0038", source: "ECG Billing", sourceSystem: "Utility Portal", period: "Q1 2026", uploadedBy: "A. Owusu", uploadedAt: "2026-04-03 10:20", hash: "77bc…1a02", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-09", comment: "Cross-checked with meter export.", provenance: ["ECG Invoice", "Evidence Object", "Activity Record ACT-0021", "Calculation Line CALC-0038", "PCF Result"] },
  { id: "EVD-00180", title: "Diesel Fuel Log — Generators", desc: "Fuel dispensing log for standby generators.", category: "Fuel", activity: "ACT-0024", calc: "CALC-0041", source: "Fuel Register", sourceSystem: "ERP", period: "FY 2026", uploadedBy: "A. Owusu", uploadedAt: "2026-04-04 09:00", hash: "2ed4…9f31", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-10", comment: "", provenance: ["Fuel Register", "Evidence Object", "Activity Record ACT-0024", "Emission Factor EF-DIESEL", "PCF Calculation"] },
  { id: "EVD-00176", title: "Cocoa Bean Supplier Declaration", desc: "Supplier declaration for raw cocoa mass volumes.", category: "Supplier Data", activity: "ACT-0032", calc: "CALC-0048", source: "Supplier Declaration", sourceSystem: "Supplier Portal", period: "FY 2026", uploadedBy: "K. Adjei", uploadedAt: "2026-04-05 14:35", hash: "9a11…44cd", version: "V1", status: "PENDING", reviewer: "", reviewDate: "", comment: "Volume support incomplete — see FND-026-003.", provenance: ["Supplier Declaration", "Evidence Object", "Supplier Activity ACT-0032", "Emission Factor EF-COCOA", "PCF Calculation"] },
  { id: "EVD-00172", title: "Production Batch Record CB-2026-001", desc: "Batch production record, output 100,000 kg.", category: "Production", activity: "ACT-0001", calc: "CALC-0002", source: "MES", sourceSystem: "ERP", period: "FY 2026", uploadedBy: "System", uploadedAt: "2026-04-02 07:50", hash: "cc73…8810", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-08", comment: "", provenance: ["MES", "Batch Record", "Evidence Object", "Activity Record ACT-0001", "PCF Result"] },
  { id: "EVD-00168", title: "ERP Material Movement Export", desc: "Goods receipt / issue export for reporting period.", category: "ERP", activity: "ACT-0032", calc: "CALC-0048", source: "SAP", sourceSystem: "ERP", period: "FY 2026", uploadedBy: "System", uploadedAt: "2026-04-02 07:52", hash: "5b90…7712", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-08", comment: "", provenance: ["SAP", "Material Movement", "Evidence Object", "Activity Record ACT-0032", "PCF Calculation"] },
  { id: "EVD-00160", title: "Outbound Logistics Manifest", desc: "Road freight manifest, Tema to Tema Port.", category: "Logistics", activity: "ACT-0040", calc: "CALC-0055", source: "3PL Manifest", sourceSystem: "TMS", period: "FY 2026", uploadedBy: "K. Adjei", uploadedAt: "2026-04-06 11:10", hash: "e401…22aa", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-10", comment: "", provenance: ["TMS", "Freight Manifest", "Evidence Object", "Activity Record ACT-0040", "PCF Calculation"] },
  { id: "EVD-00155", title: "Emission Factor Dataset — DEFRA 2025", desc: "Reference emission factor dataset used in calculation.", category: "Emission Factors", activity: "—", calc: "CALC-0038", source: "DEFRA 2025", sourceSystem: "Factor Library", period: "2025", uploadedBy: "System", uploadedAt: "2026-04-01 09:00", hash: "aa00…ff19", version: "2025.1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-08", comment: "Version verified against source.", provenance: ["DEFRA 2025", "Factor Library", "Evidence Object", "Calculation Line"] },
  { id: "EVD-00150", title: "Allocation Basis Workpaper", desc: "Mass-based allocation basis between co-products.", category: "Allocation", activity: "—", calc: "CALC-0060", source: "Carbon Manager", sourceSystem: "PCF", period: "FY 2026", uploadedBy: "K. Adjei", uploadedAt: "2026-04-05 16:00", hash: "1298…6b40", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-11", comment: "", provenance: ["PCF Allocation", "Workpaper", "Evidence Object", "Calculation Line"] },
  { id: "EVD-00145", title: "Methodology Statement — ISO 14067", desc: "Applied methodology and boundary statement.", category: "Methodology", activity: "—", calc: "—", source: "Carbon Manager", sourceSystem: "PCF", period: "FY 2026", uploadedBy: "K. Adjei", uploadedAt: "2026-04-01 12:00", hash: "7f0a…d3c1", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-08", comment: "", provenance: ["PCF Methodology", "Evidence Object"] },
  { id: "EVD-00140", title: "Meter Serial Photograph", desc: "Photo of main incomer meter serial plate.", category: "Photos", activity: "ACT-0021", calc: "—", source: "Site Visit", sourceSystem: "Field", period: "FY 2026", uploadedBy: "Dr. Kofi Mensah", uploadedAt: "2026-05-12 10:30", hash: "3c22…0a55", version: "V1", status: "ACCEPTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-05-12", comment: "Serial confirmed on site.", provenance: ["Site Visit", "Photograph", "Evidence Object", "Activity Record ACT-0021"] },
  { id: "EVD-00132", title: "ISO 14064-3 Recognition Certificate", desc: "Verifier body recognition certificate.", category: "Certificates", activity: "—", calc: "—", source: "Meridian Assurance", sourceSystem: "External", period: "2024–2027", uploadedBy: "System", uploadedAt: "2026-03-20 09:00", hash: "bd77…9911", version: "V1", status: "ACCEPTED", reviewer: "Org Admin", reviewDate: "2026-03-21", comment: "", provenance: ["Verifier Body", "Certificate", "Evidence Object"] },
  { id: "EVD-00120", title: "Site Visit Closing Note", desc: "Signed closing meeting note.", category: "Site Visit", activity: "—", calc: "—", source: "Site Visit", sourceSystem: "Field", period: "FY 2026", uploadedBy: "Dr. Kofi Mensah", uploadedAt: "2026-05-12 16:00", hash: "0912…7ac3", version: "V1", status: "PENDING", reviewer: "", reviewDate: "", comment: "", provenance: ["Site Visit", "Note", "Evidence Object"] },
  { id: "EVD-00101", title: "Raw Material Weighbridge Ticket", desc: "Weighbridge ticket, incomplete counter-signature.", category: "Supplier Data", activity: "ACT-0032", calc: "CALC-0048", source: "Weighbridge", sourceSystem: "ERP", period: "FY 2026", uploadedBy: "K. Adjei", uploadedAt: "2026-04-07 08:00", hash: "44de…1b20", version: "V1", status: "REJECTED", reviewer: "Dr. Kofi Mensah", reviewDate: "2026-04-12", comment: "Missing counter-signature — resubmission required.", provenance: ["Weighbridge", "Ticket", "Evidence Object", "Activity Record ACT-0032"] },
];

export const CALC_LINES = [
  { id: "CALC-0002", category: "Production", scope: "Scope 1", activity: "Batch output CB-2026-001", qty: 100000, unit: "kg", ef: "—", efSource: "—", allocation: "100%", co2e: 0, evidence: "EVD-00172", status: "ACCEPTED", comment: "Functional unit basis." },
  { id: "CALC-0038", category: "Electricity", scope: "Scope 2", activity: "Grid electricity", qty: 125400, unit: "kWh", ef: "0.412 kgCO2e/kWh", efSource: "DEFRA 2025", allocation: "82%", co2e: 42.36, evidence: "EVD-00184", status: "ACCEPTED", comment: "" },
  { id: "CALC-0041", category: "Fuel", scope: "Scope 1", activity: "Diesel — generators", qty: 8200, unit: "L", ef: "2.68 kgCO2e/L", efSource: "DEFRA 2025", allocation: "100%", co2e: 21.98, evidence: "EVD-00180", status: "ACCEPTED", comment: "" },
  { id: "CALC-0044", category: "Process Emissions", scope: "Scope 1", activity: "Roasting process", qty: 100000, unit: "kg", ef: "0.061 kgCO2e/kg", efSource: "IPCC 2019", allocation: "100%", co2e: 6.10, evidence: "EVD-00172", status: "ACCEPTED", comment: "" },
  { id: "CALC-0048", category: "Raw Materials", scope: "Scope 3", activity: "Cocoa mass input", qty: 118000, unit: "kg", ef: "1.42 kgCO2e/kg", efSource: "Ecoinvent 3.9", allocation: "82%", co2e: 137.42, evidence: "EVD-00176", status: "QUERY", comment: "Supplier volume support incomplete — see FND-026-003." },
  { id: "CALC-0050", category: "Packaging", scope: "Scope 3", activity: "HDPE drums", qty: 4200, unit: "kg", ef: "1.90 kgCO2e/kg", efSource: "Ecoinvent 3.9", allocation: "100%", co2e: 7.98, evidence: "EVD-00168", status: "ACCEPTED", comment: "" },
  { id: "CALC-0055", category: "Logistics", scope: "Scope 3", activity: "Road freight Tema→Port", qty: 32000, unit: "t·km", ef: "0.11 kgCO2e/t·km", efSource: "GLEC 2024", allocation: "100%", co2e: 3.52, evidence: "EVD-00160", status: "ACCEPTED", comment: "" },
  { id: "CALC-0058", category: "Waste", scope: "Scope 3", activity: "Process waste to landfill", qty: 2600, unit: "kg", ef: "0.58 kgCO2e/kg", efSource: "DEFRA 2025", allocation: "100%", co2e: 1.51, evidence: "EVD-00168", status: "ACCEPTED", comment: "" },
  { id: "CALC-0060", category: "Other", scope: "Scope 3", activity: "Water & effluent", qty: 5400, unit: "m³", ef: "0.34 kgCO2e/m³", efSource: "DEFRA 2025", allocation: "82%", co2e: 1.51, evidence: "EVD-00150", status: "QUERY", comment: "Allocation basis to be confirmed." },
  { id: "CALC-0062", category: "Electricity", scope: "Scope 2", activity: "Grid electricity — utilities", qty: 178000, unit: "kWh", ef: "0.412 kgCO2e/kWh", efSource: "DEFRA 2025", allocation: "82%", co2e: 60.12, evidence: "EVD-00183", status: "ACCEPTED", comment: "" },
];

export const CHECK_ENGINE = [
  { name: "Unit consistency", status: "PASS" },
  { name: "Emission factor validity", status: "PASS" },
  { name: "Emission factor version", status: "PASS" },
  { name: "Boundary consistency", status: "PASS" },
  { name: "Duplicate activities", status: "PASS" },
  { name: "Missing activities", status: "PASS" },
  { name: "Allocation reconciliation", status: "FAIL", detail: "Water & effluent allocation basis (CALC-0060) unconfirmed." },
  { name: "Production quantity", status: "PASS" },
  { name: "Logistics methodology", status: "PASS" },
  { name: "Scope classification", status: "PASS" },
  { name: "PCF intensity reconciliation", status: "FAIL", detail: "Raw material support incomplete (CALC-0048) — see FND-026-003." },
  { name: "Calculation version integrity", status: "PASS" },
];

export const VERIFIER_ORGS = [
  { org: "Meridian Assurance Ltd", country: "United Kingdom", scope: "PCF / GHG · ISO 14064-3, ISO 14067", ref: "UKAS 0042 (documentary)", validity: "2024 – 2027", personnel: 6, engagements: 3, status: "ACTIVE", address: "14 Kingsway, London, WC2B 6LH", website: "meridian-assurance.example", contact: "verify@meridian-assurance.example", sector: "Food & Agriculture, Manufacturing", body: "UKAS (reference on file)", cert: "MA-14064-2024-042", from: "2024-01-01", until: "2027-12-31", certDoc: "EVD-00132" },
  { org: "GreenLedger Verify BV", country: "Netherlands", scope: "PCF / GHG · ISO 14067", ref: "RvA C-590 (documentary)", validity: "2023 – 2026", personnel: 4, engagements: 1, status: "ACTIVE", address: "Zuidas 200, Amsterdam", website: "greenledger.example", contact: "info@greenledger.example", sector: "Food & Agriculture", body: "RvA (reference on file)", cert: "GL-14067-2023-118", from: "2023-06-01", until: "2026-05-31", certDoc: "—" },
];

export const VERIFIER_TEAM = [
  { name: "Dr. Kofi Mensah", role: "Lead Verifier", qual: "PhD Env. Eng., ISO 14064-3 Lead", sector: "12 yrs food processing", engagements: 3, independence: "CONFIRMED" },
  { name: "Ir. Anneke de Vries", role: "Technical Reviewer", qual: "MSc, GHG Technical Reviewer", sector: "15 yrs LCA / PCF", engagements: 5, independence: "CONFIRMED" },
  { name: "Samuel Boateng", role: "Sector Specialist", qual: "Cocoa value-chain specialist", sector: "9 yrs cocoa sector", engagements: 2, independence: "CONFIRMED" },
  { name: "Lucia Fernández", role: "Supporting Reviewer", qual: "GHG Analyst", sector: "4 yrs manufacturing", engagements: 4, independence: "CONFIRMED" },
];

export const CONFLICT_ITEMS = [
  "Financial Relationship?",
  "Consulting Relationship?",
  "Previous Involvement in PCF Calculation?",
  "Shared Ownership?",
  "Management Relationship?",
  "Personal Conflict?",
  "Recent Advisory Work?",
  "Commercial Dependency?",
  "Other Independence Risk?",
];

export const RISK_ASSESSMENT = [
  { area: "Raw Materials", inherent: "HIGH", control: "MEDIUM", impact: "HIGH", priority: "HIGH", procedure: "Recalculation + supplier confirmation" },
  { area: "Electricity", inherent: "MEDIUM", control: "LOW", impact: "MEDIUM", priority: "MEDIUM", procedure: "Meter reconciliation" },
  { area: "Diesel", inherent: "MEDIUM", control: "MEDIUM", impact: "MEDIUM", priority: "MEDIUM", procedure: "Source data testing" },
  { area: "Allocation", inherent: "HIGH", control: "MEDIUM", impact: "HIGH", priority: "HIGH", procedure: "Analytical review of basis" },
  { area: "Logistics", inherent: "MEDIUM", control: "LOW", impact: "MEDIUM", priority: "MEDIUM", procedure: "Manifest cross-check" },
  { area: "Packaging", inherent: "LOW", control: "LOW", impact: "LOW", priority: "LOW", procedure: "Document review" },
];

export const SAMPLING_PLAN = [
  { pop: "Electricity meter records", size: "125,400 readings", selection: "Judgemental + monthly strata", reason: "Material Scope 2 driver", evidence: "EVD-00184, EVD-00183", verifier: "Dr. Kofi Mensah" },
  { pop: "Diesel fuel logs", size: "42 dispensing events", selection: "Random 12", reason: "Scope 1 completeness", evidence: "EVD-00180", verifier: "Samuel Boateng" },
  { pop: "Supplier declarations", size: "18 suppliers", selection: "Top 5 by volume", reason: "Highest inherent risk", evidence: "EVD-00176", verifier: "Samuel Boateng" },
  { pop: "Logistics manifests", size: "96 shipments", selection: "Random 10", reason: "Scope 3 logistics", evidence: "EVD-00160", verifier: "Lucia Fernández" },
];

export const PROCEDURES = [
  "Document Review", "Evidence Inspection", "Analytical Review", "Recalculation",
  "Source Data Testing", "Interviews", "Remote Inspection", "Physical Site Inspection",
  "Cross-check", "Supplier Confirmation",
];

export const PLAN_SCHEDULE = [
  { task: "Evidence package review", owner: "Dr. Kofi Mensah", start: "2026-04-08", due: "2026-04-22", status: "COMPLETE" },
  { task: "Calculation recalculation", owner: "Ir. Anneke de Vries", start: "2026-04-20", due: "2026-05-02", status: "IN PROGRESS" },
  { task: "Site visit — Tema", owner: "Dr. Kofi Mensah", start: "2026-05-12", due: "2026-05-12", status: "PLANNED" },
  { task: "Findings & corrections", owner: "Verification Team", start: "2026-05-13", due: "2026-05-27", status: "PLANNED" },
  { task: "Technical review", owner: "Ir. Anneke de Vries", start: "2026-05-28", due: "2026-06-03", status: "PLANNED" },
];

export const SITE_AGENDA = [
  "Opening Meeting", "Facility Boundary Review", "Production Process Inspection",
  "Meter Inspection", "Fuel Records", "Utility Records", "ERP Reconciliation",
  "Production Reconciliation", "Evidence Sampling", "Personnel Interviews", "Closing Meeting",
];

export const SITE_CHECKLIST = [
  "Facility boundary confirmed", "Production line confirmed", "Equipment identified",
  "Meter identity confirmed", "Meter serial number checked", "PAS800/device checked",
  "Fuel storage checked", "Production records checked", "ERP records reconciled",
  "Raw material records reviewed", "Supplier evidence reviewed", "Logistics evidence reviewed",
  "Photographic evidence collected",
];

export const SITE_OBSERVATIONS = [
  { id: "OBS-026-01", area: "Meter Inspection", desc: "Main incomer serial plate confirmed and photographed.", activity: "ACT-0021", evidence: "EVD-00140", verifier: "Dr. Kofi Mensah", severity: "INFO", followUp: "No" },
  { id: "OBS-026-02", area: "Raw material records", desc: "Weighbridge counter-signature missing on one ticket.", activity: "ACT-0032", evidence: "EVD-00101", verifier: "Samuel Boateng", severity: "MEDIUM", followUp: "Yes" },
];

export const INITIAL_FINDINGS = [
  {
    id: "FND-026-003", classification: "Potential Misstatement", area: "Supplier Data",
    desc: "Supplier evidence does not sufficiently support reported raw material activity.",
    activity: "ACT-0032", calc: "CALC-0048", impact: "±3.5 tCO2e", owner: "Carbon Manager",
    due: "2026-05-24", status: "OPEN", createdBy: "Dr. Kofi Mensah", createdAt: "2026-05-13",
    requirement: "ISO 14064-3 §3.6 — sufficient appropriate evidence",
    materiality: "Potentially material (>1% of total footprint).",
    comment: "Volume reconciliation between weighbridge and declaration incomplete.",
    response: "", correction: "", attachments: ["EVD-00176", "EVD-00101"],
  },
  {
    id: "FND-026-002", classification: "Non-conformity", area: "Allocation",
    desc: "Water & effluent allocation basis not documented in workpaper.",
    activity: "—", calc: "CALC-0060", impact: "<0.5 tCO2e", owner: "Carbon Manager",
    due: "2026-05-22", status: "OPEN", createdBy: "Ir. Anneke de Vries", createdAt: "2026-05-13",
    requirement: "ISO 14067 §6.4 — allocation",
    materiality: "Minor.", comment: "Allocation basis to be evidenced.",
    response: "", correction: "", attachments: ["EVD-00150"],
  },
  {
    id: "FND-026-001", classification: "Clarification", area: "Logistics",
    desc: "Confirm freight distance basis (great-circle vs actual road distance).",
    activity: "ACT-0040", calc: "CALC-0055", impact: "Negligible", owner: "Carbon Manager",
    due: "2026-05-20", status: "OPEN", createdBy: "Lucia Fernández", createdAt: "2026-05-13",
    requirement: "GLEC Framework 2024", materiality: "Minor.",
    comment: "Distance basis clarification requested.", response: "", correction: "",
    attachments: ["EVD-00160"],
  },
  {
    id: "FND-025-014", classification: "Observation", area: "Evidence",
    desc: "Closing note pending upload — administrative.", activity: "—", calc: "—",
    impact: "None", owner: "Verifier", due: "2026-05-14", status: "CLOSED",
    createdBy: "Dr. Kofi Mensah", createdAt: "2026-05-12", requirement: "—",
    materiality: "None.", comment: "Uploaded and accepted.", response: "Uploaded.",
    correction: "", attachments: ["EVD-00120"],
  },
];

export const INITIAL_CORRECTIONS = [
  {
    id: "COR-026-001", finding: "FND-026-003", record: "ACT-0032 / CALC-0048",
    origQty: 118000, origUnit: "kg", origEf: "1.42 kgCO2e/kg", origEfVersion: "Ecoinvent 3.9",
    origCo2e: 137.42, evidence: "EVD-00176",
    newQty: 119400, newUnit: "kg", newEf: "1.42 kgCO2e/kg", newEvidence: "EVD-00176 (v2), EVD-00101 (v2)",
    reason: "Corrected cocoa mass volume after weighbridge reconciliation; additional counter-signed ticket provided.",
    submittedBy: "Carbon Manager", pcfImpact: 0.02, status: "SUBMITTED",
  },
];

// Audit trail seed (most recent first)
export const INITIAL_AUDIT = [
  { id: "AUD-0042", objectType: "Finding", objectId: "FND-026-003", user: "Dr. Kofi Mensah", role: "Verifier", org: "Meridian Assurance Ltd", action: "Finding raised", prev: "—", next: "OPEN", ts: "2026-05-13 15:22", comment: "Potential misstatement on supplier data.", evidence: "EVD-00176", finding: "FND-026-003", calcVersion: "V1.0" },
  { id: "AUD-0041", objectType: "Site Visit", objectId: "VIS-026-01", user: "Dr. Kofi Mensah", role: "Verifier", org: "Meridian Assurance Ltd", action: "Site visit conducted", prev: "PLANNED", next: "IN PROGRESS", ts: "2026-05-12 09:00", comment: "On-site verification, Tema.", evidence: "EVD-00140", finding: "—", calcVersion: "V1.0" },
  { id: "AUD-0040", objectType: "Plan", objectId: "PLAN-026", user: "Ir. Anneke de Vries", role: "Technical Reviewer", org: "Meridian Assurance Ltd", action: "Plan approved", prev: "DRAFT", next: "APPROVED", ts: "2026-04-24 11:00", comment: "Verification plan approved.", evidence: "—", finding: "—", calcVersion: "V1.0" },
  { id: "AUD-0039", objectType: "Conflict Check", objectId: "CFL-026", user: "Ir. Anneke de Vries", role: "Technical Reviewer", org: "Meridian Assurance Ltd", action: "Conflict check completed", prev: "PENDING", next: "NO CONFLICT", ts: "2026-04-22 16:30", comment: "Independence confirmed.", evidence: "—", finding: "—", calcVersion: "V1.0" },
  { id: "AUD-0038", objectType: "Verifier", objectId: "VER-026", user: "Org Admin", role: "Organisation Admin", action: "Verifier assigned", prev: "—", next: "Meridian Assurance Ltd", ts: "2026-04-21 09:15", comment: "Meridian Assurance assigned as verifier.", evidence: "—", finding: "—", calcVersion: "V1.0" },
  { id: "AUD-0037", objectType: "Data Freeze", objectId: "FRZ-2026-026", user: "K. Adjei", role: "Carbon Manager", org: "Asante Cocoa Cooperative", action: "Dataset frozen", prev: "OPEN", next: "FROZEN", ts: "2026-04-18 14:00", comment: "Immutable verification snapshot created.", evidence: "—", finding: "—", calcVersion: "V1.0" },
  { id: "AUD-0036", objectType: "Evidence", objectId: "EVD-00184", user: "Dr. Kofi Mensah", role: "Verifier", org: "Meridian Assurance Ltd", action: "Evidence accepted", prev: "PENDING", next: "ACCEPTED", ts: "2026-04-09 10:05", comment: "Meter export reconciled.", evidence: "EVD-00184", finding: "—", calcVersion: "V1.0" },
];
