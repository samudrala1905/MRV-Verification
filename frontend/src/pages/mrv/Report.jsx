import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ShieldCheck, XCircle, CheckCircle2, Eye, Download, ScrollText, History, BadgeCheck } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { Kpi, StatusBadge, Field, SectionCard } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { downloadFile } from "@/lib/mrvNav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SECTIONS = [
  "Organisation Information", "Facility Information", "Verification Subject", "Carbon Claim",
  "Reporting Period", "Product and Batch", "Functional / Declared Unit", "System Boundary",
  "Verification Criteria", "Methodology", "Verification Scope", "Verification Approach",
  "Materiality Approach", "Evidence Reviewed", "Calculation Review", "Sampling Activities",
  "Site Visit", "Findings", "Corrections", "Remaining Limitations", "Final Calculation Version",
  "Final Verified Carbon Result", "Verification Conclusion / Opinion", "Lead Verifier",
  "Technical Reviewer", "Verification Organisation", "Verification Date", "Verification Reference",
  "Supporting Evidence Manifest",
];

export default function Report() {
  const navigate = useNavigate();
  const m = useMrv();
  const { meta, engagement, gate, canRelease, verifiedIntensity, verifiedTotal, finalVersion,
    approveTechnicalReview, returnTechnicalReview, releaseVerified, issuePassport, findings, audit } = m;
  const [auditOpen, setAuditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  usePrimaryAction(
    engagement.released ? "Verification Released"
      : engagement.technicalReviewStatus !== "APPROVED" ? "Complete Technical Review" : "Finalise Verification",
    () => {
      if (engagement.released) { toast("Already released"); return; }
      if (engagement.technicalReviewStatus !== "APPROVED") { approveTechnicalReview(); toast.success("Technical review approved"); }
      else if (canRelease) { releaseVerified(); toast.success("Verified result released"); }
      else toast.error("Verification cannot be released — blocking items remain");
    }
  );

  const blocking = gate.filter((g) => !g.ok);
  const reportStatus = engagement.released ? "VERIFIED" : engagement.reportStatus;
  const closedFindings = findings.filter((f) => f.status === "CLOSED").length;

  const download = () => {
    const body = `INDEPENDENT VERIFICATION REPORT (SIMULATED)\nEngagement: ${meta.engagementId}\nOrganisation: ${meta.organisation}\nFacility: ${meta.facility}\nProduct: ${meta.product} (${meta.batch})\nPCF Project: ${meta.pcfProject}\nFinal Calculation Version: ${finalVersion}\n\nVerified Total Footprint: ${verifiedTotal} tCO2e\nVerified PCF Intensity: ${verifiedIntensity} kgCO2e/kg\nBoundary: ${meta.boundary}\nVerification Status: ${reportStatus}\nLead Verifier: ${meta.leadVerifier}\nTechnical Reviewer: ${meta.technicalReviewer}\nVerification Organisation: ${meta.verifierOrg}\nVerification Reference: VER-026/2026\n`;
    downloadFile(`verification_report_${meta.engagementId}.txt`, body);
  };

  return (
    <div className="space-y-5">
      <SectionCard testid="report-header">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><FileText className="h-6 w-6" /></span>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Independent Verification Report</h3>
              <p className="text-sm text-slate-500">{meta.engagementId} · {meta.organisation} · {meta.facility}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {["DRAFT", "TECHNICAL REVIEW", "READY FOR RELEASE", "VERIFIED"].map((s) => (
              <span key={s} className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase",
                reportStatus === s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>{s}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Product" value={meta.product} />
          <Field label="Batch" value={meta.batch} mono />
          <Field label="PCF Project" value={meta.pcfProject} mono />
          <Field label="Verified Version" value={finalVersion} />
          <Field label="Boundary" value={meta.boundary} />
          <Field label="Report Status" value={<StatusBadge status={reportStatus} />} />
        </div>
      </SectionCard>

      {/* Technical Review panel */}
      <SectionCard title="Technical Review" testid="technical-review"
        action={<StatusBadge status={engagement.technicalReviewStatus} />}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Technical Reviewer" value={meta.technicalReviewer} />
          <Field label="Review Date" value={engagement.technicalReviewStatus === "APPROVED" ? "2026-06-03" : "—"} />
          <Field label="Calculation Version Reviewed" value={finalVersion} />
          <Field label="Findings Reviewed" value={`${findings.length} (${closedFindings} closed)`} />
          <Field label="Corrections Reviewed" value={m.corrections.length} />
          <Field label="Evidence Package Reviewed" value="Yes" />
          <Field label="Independence Confirmed" value="Yes" />
          <Field label="Outstanding Issues" value={m.materialOpen.length} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button data-testid="tr-additional" variant="outline" onClick={() => toast("Additional review requested")} className="rounded-full">Request Additional Review</Button>
          <Button data-testid="tr-return" variant="outline" onClick={() => { returnTechnicalReview(); toast("Returned to lead verifier"); }} className="rounded-full text-amber-600">Return to Lead Verifier</Button>
          <Button data-testid="tr-approve" onClick={() => { approveTechnicalReview(); toast.success("Technical review approved"); }} disabled={engagement.technicalReviewStatus === "APPROVED"} className="rounded-full bg-emerald-600 font-bold text-white hover:bg-emerald-700">Approve Technical Review</Button>
        </div>
      </SectionCard>

      {/* Final verification gate */}
      <SectionCard title="Final Verification Gate" testid="verification-gate">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {gate.map((g) => (
            <div key={g.key} data-testid={`gate-${g.key}`} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm", g.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
              {g.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}<span className="font-medium">{g.label}</span>
            </div>
          ))}
        </div>
        {!canRelease && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <b>VERIFICATION CANNOT BE RELEASED.</b> Blocking: {blocking.map((b) => b.label).join(", ")}.
          </div>
        )}
      </SectionCard>

      {/* Final result + KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi testid="kpi-verified-total" label="Verified Total Footprint" value={`${verifiedTotal} tCO2e`} tone="green" />
        <Kpi testid="kpi-verified-intensity" label="Verified PCF Intensity" value={`${verifiedIntensity} kgCO2e/kg`} tone="green" />
        <Kpi testid="kpi-final-version" label="Final Calculation Version" value={finalVersion} hint={finalVersion === "V1.1" ? "corrected & accepted" : "as submitted"} />
        <Kpi testid="kpi-verification-status" label="Verification Status" value={reportStatus} tone={engagement.released ? "green" : "amber"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Report Sections" className="lg:col-span-2" testid="report-sections">
          <ol className="grid gap-1.5 sm:grid-cols-2">
            {SECTIONS.map((s, i) => (
              <li key={s} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">{i + 1}</span>{s}
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Report Actions" testid="report-actions">
          <div className="space-y-2">
            <Button data-testid="report-preview" onClick={() => setPreviewOpen(true)} variant="outline" className="w-full justify-start rounded-full"><Eye className="mr-2 h-4 w-4" /> Preview Report</Button>
            <Button data-testid="report-download" onClick={download} variant="outline" className="w-full justify-start rounded-full"><Download className="mr-2 h-4 w-4" /> Download Verification Report</Button>
            <Button data-testid="report-manifest" onClick={() => downloadFile("evidence_manifest.txt", "Evidence manifest — 186 items")} variant="outline" className="w-full justify-start rounded-full"><ScrollText className="mr-2 h-4 w-4" /> Download Evidence Manifest</Button>
            <Button data-testid="report-audit" onClick={() => setAuditOpen(true)} variant="outline" className="w-full justify-start rounded-full"><History className="mr-2 h-4 w-4" /> View Audit Trail</Button>
            <Button data-testid="report-release" onClick={() => { if (canRelease) { releaseVerified(); toast.success("Verified result released"); } else toast.error("Blocking items remain"); }}
              disabled={!canRelease || engagement.released}
              className="w-full justify-start rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white disabled:opacity-60">
              <ShieldCheck className="mr-2 h-4 w-4" /> Release Verified Result
            </Button>
          </div>
        </SectionCard>
      </div>

      {/* Verified handoff + passport */}
      {engagement.released && (
        <div className="space-y-5">
          <SectionCard title="Verified Result Handoff → PCF" testid="verified-handoff">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <Field label="PCF Project" value={meta.pcfProject} mono />
              <Field label="Verification Status" value={<StatusBadge status="VERIFIED" />} />
              <Field label="Verification Engagement" value={meta.engagementId} mono />
              <Field label="Verified Version" value={finalVersion} />
              <Field label="Verification Date" value={new Date().toISOString().slice(0, 10)} />
              <Field label="Verification Reference" value="VER-026/2026" mono />
            </div>
            <Button data-testid="view-pcf-btn" onClick={() => navigate("/pcf/report")} variant="ghost" className="mt-3 rounded-full text-emerald-700">View updated PCF report →</Button>
          </SectionCard>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-lg font-extrabold text-emerald-800">{engagement.passportIssued ? "Carbon Passport Issued" : "Carbon Passport Unlocked"}</p>
                <p className="text-sm text-emerald-700">Passport status: {engagement.passportStatus}. Only the accepted verified result feeds passport issuance.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button data-testid="issue-passport-btn" onClick={() => { issuePassport(); toast.success("Carbon Passport issued"); }} disabled={engagement.passportIssued} className="rounded-full bg-emerald-600 font-bold text-white hover:bg-emerald-700">Issue Carbon Passport</Button>
              <Button data-testid="open-passport-btn" onClick={() => navigate("/passport")} variant="outline" className="rounded-full">Open Carbon Passports</Button>
            </div>
          </div>
        </div>
      )}

      {/* preview drawer */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader><SheetTitle>Report Preview — {meta.engagementId}</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-center text-lg font-extrabold text-slate-900">INDEPENDENT VERIFICATION REPORT</p>
              <p className="mt-1 text-center text-xs text-slate-400">SIMULATED DEMO DOCUMENT</p>
            </div>
            <Field label="Verification Conclusion / Opinion" value={engagement.released ? `Based on the procedures performed, nothing has come to our attention that causes us to believe the PCF of ${verifiedIntensity} kgCO2e/kg (${verifiedTotal} tCO2e, ${meta.boundary}, ${finalVersion}) is materially misstated.` : "Draft — pending release."} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Verified Total" value={`${verifiedTotal} tCO2e`} />
              <Field label="Verified Intensity" value={`${verifiedIntensity} kgCO2e/kg`} />
              <Field label="Final Version" value={finalVersion} />
              <Field label="Lead Verifier" value={meta.leadVerifier} />
              <Field label="Technical Reviewer" value={meta.technicalReviewer} />
              <Field label="Verification Organisation" value={meta.verifierOrg} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* audit trail drawer */}
      <Sheet open={auditOpen} onOpenChange={setAuditOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader><SheetTitle>Audit Trail</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-3">
            {audit.map((a) => (
              <div key={a.id} data-testid={`audit-${a.id}`} className="border-l-2 border-emerald-300 pl-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">{a.action}</p>
                  <span className="text-xs text-slate-400">{a.ts}</span>
                </div>
                <p className="text-xs text-slate-500">{a.objectType} · {a.objectId} · {a.user} ({a.role}) · {a.prev} → {a.next}</p>
                {a.comment && <p className="text-xs text-slate-400">{a.comment}</p>}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
