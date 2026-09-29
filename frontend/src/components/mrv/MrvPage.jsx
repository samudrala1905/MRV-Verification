import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, ChevronRight, Search } from "lucide-react";
import { TABS } from "@/data/mockData";
import { useMrv } from "@/context/MrvContext";
import WorkflowTracker from "@/components/mrv/WorkflowTracker";
import { PrimaryActionProvider, usePrimaryActionApi } from "@/components/mrv/primaryAction";
import { StatusBadge } from "@/components/mrv/shared";
import { downloadFile } from "@/lib/mrvNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import Readiness from "@/pages/mrv/Readiness";
import EvidenceVault from "@/pages/mrv/EvidenceVault";
import CalculationReview from "@/pages/mrv/CalculationReview";
import DataFreeze from "@/pages/mrv/DataFreeze";
import Verifiers from "@/pages/mrv/Verifiers";
import Engagements from "@/pages/mrv/Engagements";
import ConflictCheck from "@/pages/mrv/ConflictCheck";
import Plan from "@/pages/mrv/Plan";
import SiteVisits from "@/pages/mrv/SiteVisits";
import Findings from "@/pages/mrv/Findings";
import Corrections from "@/pages/mrv/Corrections";
import Report from "@/pages/mrv/Report";

const TAB_COMPONENTS = {
  readiness: Readiness, evidence: EvidenceVault, calculation: CalculationReview,
  freeze: DataFreeze, verifiers: Verifiers, engagements: Engagements,
  conflict: ConflictCheck, plan: Plan, sitevisits: SiteVisits,
  findings: Findings, corrections: Corrections, report: Report,
};

const DOWNLOADS = [
  ["Verification Readiness Report", "readiness"],
  ["Evidence Manifest", "evidence"],
  ["Evidence Register CSV", "evidence-csv"],
  ["Frozen Dataset Manifest", "freeze"],
  ["Calculation Review Report", "calc"],
  ["Verification Plan", "plan"],
  ["Site Visit Report", "site"],
  ["Findings Register", "findings"],
  ["Corrections Register", "corrections"],
  ["Audit Trail", "audit"],
  ["Final Verification Report", "report"],
  ["Complete Verification Package", "package"],
];

function PrimaryButton() {
  const api = usePrimaryActionApi();
  const [, force] = useState(0);
  useEffect(() => api.subscribe(() => force((n) => n + 1)), [api]);
  const { label, fn } = api.ref.current;
  return (
    <Button data-testid="primary-action-btn" onClick={() => fn()} className="rounded-full bg-emerald-500 px-5 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">
      {label}
    </Button>
  );
}

function HeaderBar() {
  const { meta, engagement, audit, findings, corrections, evidence } = useMrv();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const buildDownload = (key) => {
    const stamp = new Date().toISOString();
    if (key === "evidence-csv") {
      const rows = [["Evidence ID", "Title", "Category", "Linked Activity", "Linked Calculation", "Source", "Period", "Hash", "Version", "Status"]];
      evidence.forEach((e) => rows.push([e.id, e.title, e.category, e.activity, e.calc, e.source, e.period, e.hash, e.version, e.status]));
      return { name: "evidence_register.csv", body: rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n"), type: "text/csv" };
    }
    const header = `SAURIENT — Independent Verification\nEngagement: ${meta.engagementId}\nPCF Project: ${meta.pcfProject}\nGenerated: ${stamp}\n(SIMULATED DEMO DOCUMENT)\n\n`;
    const bodies = {
      readiness: `VERIFICATION READINESS REPORT\nReadiness: ${meta.readiness}%\nEvidence coverage: 96%\nCalculation status: Complete`,
      evidence: `EVIDENCE MANIFEST\nTotal: ${evidence.length} shown / ${meta.evidenceItems} items\nAccepted: ${evidence.filter((e) => e.status === "ACCEPTED").length}`,
      freeze: `FROZEN DATASET MANIFEST\nFreeze ID: ${engagement.freezeInfo.id}\nHash: ${engagement.freezeInfo.hash}\nFrozen: ${engagement.freezeInfo.ts}`,
      calc: `CALCULATION REVIEW REPORT\nClaimed PCF: ${meta.claimedIntensity} kgCO2e/kg\nTotal: ${meta.claimedTotal} tCO2e`,
      plan: `VERIFICATION PLAN\nStatus: ${engagement.planApproved ? "APPROVED" : "DRAFT"}`,
      site: `SITE VISIT REPORT\nVIS-026-01 — Tema Processing Plant\nStatus: ${engagement.siteVisitComplete ? "COMPLETE" : "SCHEDULED"}`,
      findings: `FINDINGS REGISTER\n${findings.map((f) => `${f.id} | ${f.classification} | ${f.status}`).join("\n")}`,
      corrections: `CORRECTIONS REGISTER\n${corrections.map((c) => `${c.id} | ${c.finding} | ${c.status}`).join("\n")}`,
      audit: `AUDIT TRAIL\n${audit.map((a) => `${a.ts} | ${a.user} | ${a.action} | ${a.objectId}`).join("\n")}`,
      report: `FINAL VERIFICATION REPORT\nStatus: ${engagement.reportStatus}\nFinal version: ${engagement.finalVersion}`,
      package: `COMPLETE VERIFICATION PACKAGE\nIncludes readiness, evidence, freeze, calc, plan, site, findings, corrections, audit, report.`,
    };
    return { name: `${key}_${meta.engagementId}.txt`, body: header + (bodies[key] || ""), type: "text/plain" };
  };

  return (
    <div className="border-b border-slate-200 bg-white px-6 pt-5">
      {/* breadcrumb + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
          <span>MRV &amp; Verification</span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-slate-800">MRV &amp; Independent Verification</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600">{meta.facility}</div>
          <div className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600">{meta.reportingPeriod}</div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input data-testid="global-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search records"
              className="h-9 w-48 rounded-full border-slate-200 pl-9 text-sm" />
          </div>
          <StatusBadge status="SIMULATED" className="bg-emerald-100 text-emerald-700 border-emerald-200" />
        </div>
      </div>

      {/* title + actions */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">MRV &amp; Independent Verification</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Evidence, data freeze, findings and independent verification workflow</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-testid="download-menu-btn" variant="outline" className="rounded-full font-semibold">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Download</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {DOWNLOADS.map(([label, key]) => (
                <DropdownMenuItem key={key} data-testid={`download-${key}`} onClick={() => { const f = buildDownload(key); downloadFile(f.name, f.body, f.type); }}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <PrimaryButton />
        </div>
      </div>

      {q && <SearchResults q={q} onClose={() => setQ("")} navigate={navigate} />}
    </div>
  );
}

function SearchResults({ q, onClose, navigate }) {
  const { meta, evidence, findings, corrections } = useMrv();
  const pool = [
    { id: meta.engagementId, label: "Verification Engagement", to: "/mrv/engagements" },
    { id: meta.pcfProject, label: "PCF Project", to: "/pcf/report" },
    { id: meta.product, label: "Product", to: "/pcf/output" },
    { id: meta.batch, label: "Batch", to: "/pcf/output" },
    { id: "VER-026", label: "Verification Reference", to: "/mrv/report" },
    { id: "VIS-026-01", label: "Site Visit", to: "/mrv/sitevisits" },
    { id: meta.verifierOrg, label: "Verifier", to: "/mrv/verifiers" },
    ...evidence.map((e) => ({ id: e.id, label: `Evidence · ${e.title}`, to: "/mrv/evidence" })),
    ...findings.map((f) => ({ id: f.id, label: `Finding · ${f.area}`, to: "/mrv/findings" })),
    ...corrections.map((c) => ({ id: c.id, label: "Correction", to: "/mrv/corrections" })),
    { id: "ACT-0021", label: "Activity Record", to: "/pcf/inventory?rec=ACT-0021" },
    { id: "CALC-0038", label: "Calculation Line", to: "/pcf/calculation?rec=CALC-0038" },
  ];
  const res = pool.filter((r) => `${r.id} ${r.label}`.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  return (
    <div data-testid="search-results" className="absolute right-6 z-30 mt-1 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
      {res.length === 0 && <p className="p-3 text-sm text-slate-500">No records</p>}
      {res.map((r) => (
        <button key={r.id + r.label} data-testid={`search-result-${r.id}`} onClick={() => { onClose(); navigate(r.to); }}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-50">
          <span className="font-mono text-[13px] font-semibold text-emerald-700">{r.id}</span>
          <span className="text-xs text-slate-500">{r.label}</span>
        </button>
      ))}
    </div>
  );
}

function TabsNav({ active }) {
  const navigate = useNavigate();
  return (
    <div className="thin-scroll mt-4 flex gap-1 overflow-x-auto border-t border-slate-100 pt-1">
      {TABS.map((t) => (
        <button
          key={t.key}
          data-testid={`tab-${t.key}`}
          onClick={() => navigate(`/mrv/${t.key}`)}
          className={cn(
            "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
            active === t.key ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function MrvPage() {
  const { tab = "readiness" } = useParams();
  const navigate = useNavigate();
  const active = TAB_COMPONENTS[tab] ? tab : "readiness";
  const ActiveTab = TAB_COMPONENTS[active];

  return (
    <PrimaryActionProvider>
      <HeaderBar />
      <div className="bg-white px-6">
        <TabsNav active={active} />
      </div>
      <div className="space-y-5 p-6">
        <WorkflowTracker activeTab={active} onNavigate={(t) => navigate(`/mrv/${t}`)} />
        <ActiveTab />
      </div>
    </PrimaryActionProvider>
  );
}
