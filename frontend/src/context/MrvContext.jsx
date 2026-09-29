import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  ENGAGEMENT_META, EVIDENCE, INITIAL_FINDINGS, INITIAL_CORRECTIONS,
  INITIAL_AUDIT, CONFLICT_ITEMS,
} from "@/data/mockData";

const MrvContext = createContext(null);
export const useMrv = () => useContext(MrvContext);

let auditSeq = 43;
const nowStamp = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export function MrvProvider({ children }) {
  const [role, setRole] = useState("Verifier");
  const [evidence, setEvidence] = useState(EVIDENCE);
  const [findings, setFindings] = useState(INITIAL_FINDINGS);
  const [corrections, setCorrections] = useState(INITIAL_CORRECTIONS);
  const [audit, setAudit] = useState(INITIAL_AUDIT);

  // conflict answers seeded to NO / N/A (independence confirmed)
  const [conflictAnswers, setConflictAnswers] = useState(
    CONFLICT_ITEMS.map((q) => ({ q, answer: "NO", explanation: "", reviewer: "Ir. Anneke de Vries", date: "2026-04-22" }))
  );

  const [engagement, setEngagement] = useState({
    status: "IN REVIEW",
    readinessComplete: false,   // 2 blockers remain
    evidenceReviewComplete: false,
    calcReviewComplete: false,
    frozen: true,               // dataset already frozen in demo
    freezeInfo: {
      id: "FRZ-2026-026", ts: "2026-04-18 14:00", by: "K. Adjei",
      reason: "Immutable verification snapshot for independent verification.",
      hash: "sha256:9f2c7ae4…b1d0", boundaryVersion: "B-V1", efDataset: "DEFRA 2025.1",
    },
    verifierAssigned: true,
    conflictResult: "NO CONFLICT",
    conflictComplete: true,
    planApproved: true,
    siteVisitComplete: false,
    technicalReviewStatus: "PENDING", // PENDING | APPROVED | RETURNED
    reportStatus: "DRAFT",            // DRAFT | TECHNICAL REVIEW | READY FOR RELEASE | VERIFIED
    released: false,
    passportIssued: false,
    passportStatus: "DRAFT",
    finalVersion: "V1.0",
  });

  const patchEngagement = useCallback((patch) => setEngagement((e) => ({ ...e, ...patch })), []);

  const addAudit = useCallback((entry) => {
    setAudit((a) => [{
      id: `AUD-${String(auditSeq++).padStart(4, "0")}`,
      user: role, role, org: role === "Verifier" || role === "Technical Reviewer" ? ENGAGEMENT_META.verifierOrg : ENGAGEMENT_META.organisation,
      prev: "—", next: "—", ts: nowStamp(), comment: "", evidence: "—", finding: "—", calcVersion: "V1.0",
      ...entry,
    }, ...a]);
  }, [role]);

  // ---- verified result (dynamic from accepted corrections) ----
  const acceptedDelta = useMemo(
    () => corrections.filter((c) => c.status === "ACCEPTED").reduce((s, c) => s + (c.pcfImpact || 0), 0),
    [corrections]
  );
  const hasAcceptedCorrection = acceptedDelta !== 0 || corrections.some((c) => c.status === "ACCEPTED");
  const verifiedIntensity = useMemo(
    () => Math.round((ENGAGEMENT_META.claimedIntensity + acceptedDelta) * 100) / 100,
    [acceptedDelta]
  );
  const verifiedTotal = useMemo(() => Math.round(verifiedIntensity * 100 * 10) / 10, [verifiedIntensity]);
  const finalVersion = hasAcceptedCorrection ? "V1.1" : "V1.0";

  // ---- workflow stage statuses ----
  const openFindings = findings.filter((f) => f.status !== "CLOSED");
  const materialOpen = openFindings.filter((f) => f.classification === "Potential Misstatement" || f.classification === "Material Issue");
  const correctionsRequired = corrections.filter((c) => c.status === "SUBMITTED" || c.status === "REQUIRED");
  const pendingEvidence = evidence.filter((e) => e.status === "PENDING");

  const stageStatus = useMemo(() => ({
    readiness: engagement.readinessComplete ? "complete" : "action",
    evidence: engagement.evidenceReviewComplete ? "complete" : (pendingEvidence.length ? "action" : "complete"),
    calculation: engagement.calcReviewComplete ? "complete" : "action",
    freeze: engagement.frozen ? "complete" : "pending",
    verifier: engagement.verifierAssigned ? "complete" : "pending",
    conflict: engagement.conflictComplete ? (engagement.conflictResult === "BLOCKING CONFLICT" ? "blocked" : "complete") : "pending",
    plan: engagement.planApproved ? "complete" : "pending",
    sitevisit: engagement.siteVisitComplete ? "complete" : "action",
    findings: openFindings.length ? "action" : "complete",
    corrections: correctionsRequired.length ? "action" : (corrections.length ? "complete" : "pending"),
    technical: engagement.technicalReviewStatus === "APPROVED" ? "complete" : "pending",
    verified: engagement.released ? "complete" : "pending",
  }), [engagement, openFindings.length, pendingEvidence.length, correctionsRequired.length, corrections.length]);

  // ---- final verification gate ----
  const gate = useMemo(() => ([
    { key: "readiness", label: "Readiness complete", ok: engagement.readinessComplete },
    { key: "evidence", label: "Evidence review complete", ok: engagement.evidenceReviewComplete },
    { key: "calculation", label: "Calculation review complete", ok: engagement.calcReviewComplete },
    { key: "freeze", label: "Dataset frozen", ok: engagement.frozen },
    { key: "verifier", label: "Verifier assigned", ok: engagement.verifierAssigned },
    { key: "conflict", label: "Conflict check passed", ok: engagement.conflictComplete && engagement.conflictResult !== "BLOCKING CONFLICT" },
    { key: "plan", label: "Verification plan approved", ok: engagement.planApproved },
    { key: "sitevisit", label: "Site / remote review complete", ok: engagement.siteVisitComplete },
    { key: "findings", label: "All material findings resolved", ok: materialOpen.length === 0 },
    { key: "corrections", label: "Required corrections accepted", ok: correctionsRequired.length === 0 },
    { key: "version", label: "Final calculation version established", ok: engagement.calcReviewComplete },
    { key: "technical", label: "Technical review approved", ok: engagement.technicalReviewStatus === "APPROVED" },
    { key: "report", label: "Verification report complete", ok: engagement.reportStatus === "READY FOR RELEASE" || engagement.released },
  ]), [engagement, materialOpen.length, correctionsRequired.length]);

  const canRelease = gate.every((g) => g.ok);

  // ---------- ACTIONS ----------
  const resolveBlockers = useCallback(() => {
    setEvidence((ev) => ev.map((e) => e.status === "PENDING" ? { ...e, status: "ACCEPTED", reviewer: role, reviewDate: nowStamp().slice(0, 10), comment: e.comment || "Cleared during readiness resolution." } : e));
    patchEngagement({ readinessComplete: true, evidenceReviewComplete: true, status: "EVIDENCE REVIEW" });
    addAudit({ objectType: "Readiness", objectId: "VER-026", action: "Blockers resolved", prev: "ACTION REQUIRED", next: "READY", comment: "Outstanding evidence blockers cleared." });
  }, [role, patchEngagement, addAudit]);

  const reviewEvidence = useCallback((id, decision, comment) => {
    setEvidence((ev) => ev.map((e) => e.id === id ? { ...e, status: decision, reviewer: role, reviewDate: nowStamp().slice(0, 10), comment: comment || e.comment } : e));
    addAudit({ objectType: "Evidence", objectId: id, action: `Evidence ${decision.toLowerCase()}`, prev: "PENDING", next: decision, evidence: id, comment });
  }, [role, addAudit]);

  const completeEvidenceReview = useCallback(() => {
    patchEngagement({ evidenceReviewComplete: true, status: "EVIDENCE REVIEW" });
    addAudit({ objectType: "Evidence", objectId: "VER-026", action: "Evidence review completed", next: "COMPLETE" });
  }, [patchEngagement, addAudit]);

  const completeCalcReview = useCallback(() => {
    patchEngagement({ calcReviewComplete: true, status: "IN REVIEW" });
    addAudit({ objectType: "Calculation", objectId: "V1.0", action: "Calculation review completed", next: "COMPLETE", calcVersion: finalVersion });
  }, [patchEngagement, addAudit, finalVersion]);

  const freezeDataset = useCallback((reason) => {
    patchEngagement({ frozen: true, status: "DATA FROZEN", freezeInfo: { ...engagement.freezeInfo, reason: reason || engagement.freezeInfo.reason, ts: nowStamp(), by: role } });
    addAudit({ objectType: "Data Freeze", objectId: "FRZ-2026-026", action: "Dataset frozen", prev: "OPEN", next: "FROZEN", comment: reason });
  }, [patchEngagement, addAudit, engagement.freezeInfo, role]);

  const assignVerifier = useCallback(() => {
    patchEngagement({ verifierAssigned: true, status: "VERIFIER ASSIGNED" });
    addAudit({ objectType: "Verifier", objectId: "VER-026", action: "Verifier assigned", next: ENGAGEMENT_META.verifierOrg });
  }, [patchEngagement, addAudit]);

  const setConflictAnswer = useCallback((idx, patch) => {
    setConflictAnswers((a) => a.map((x, i) => i === idx ? { ...x, ...patch } : x));
  }, []);

  const completeConflictCheck = useCallback(() => {
    const anyYes = conflictAnswers.some((a) => a.answer === "YES");
    const result = anyYes ? "POTENTIAL CONFLICT" : "NO CONFLICT";
    patchEngagement({ conflictComplete: true, conflictResult: result, status: result === "NO CONFLICT" ? "CONFLICT CLEARED" : engagement.status });
    addAudit({ objectType: "Conflict Check", objectId: "CFL-026", action: "Conflict check completed", next: result });
  }, [conflictAnswers, patchEngagement, addAudit, engagement.status]);

  const approvePlan = useCallback(() => {
    patchEngagement({ planApproved: true, status: "PLANNED" });
    addAudit({ objectType: "Plan", objectId: "PLAN-026", action: "Plan approved", prev: "DRAFT", next: "APPROVED" });
  }, [patchEngagement, addAudit]);

  const completeSiteVisit = useCallback(() => {
    patchEngagement({ siteVisitComplete: true });
    addAudit({ objectType: "Site Visit", objectId: "VIS-026-01", action: "Site visit completed", prev: "IN PROGRESS", next: "COMPLETE" });
  }, [patchEngagement, addAudit]);

  const raiseFinding = useCallback((data) => {
    const num = String(findings.length + 1).padStart(3, "0");
    const f = {
      id: `FND-026-${num}`, status: "OPEN", createdBy: role, createdAt: nowStamp().slice(0, 10),
      requirement: "ISO 14064-3", materiality: data.classification === "Potential Misstatement" ? "Potentially material." : "Minor.",
      comment: "", response: "", correction: "", attachments: [],
      impact: "TBD", owner: "Carbon Manager", ...data,
    };
    setFindings((arr) => [f, ...arr]);
    patchEngagement({ status: "FINDINGS OPEN" });
    addAudit({ objectType: "Finding", objectId: f.id, action: "Finding raised", next: "OPEN", finding: f.id });
    return f.id;
  }, [findings.length, role, patchEngagement, addAudit]);

  const updateFinding = useCallback((id, patch, actionLabel) => {
    setFindings((arr) => arr.map((f) => f.id === id ? { ...f, ...patch } : f));
    if (actionLabel) addAudit({ objectType: "Finding", objectId: id, action: actionLabel, next: patch.status || "—", finding: id });
  }, [addAudit]);

  const submitCorrection = useCallback((data) => {
    const num = String(corrections.length + 1).padStart(3, "0");
    const c = { id: `COR-026-${num}`, status: "SUBMITTED", submittedBy: role, pcfImpact: data.pcfImpact || 0, ...data };
    setCorrections((arr) => [c, ...arr]);
    if (data.finding) updateFinding(data.finding, { correction: c.id, status: "CORRECTION REQUIRED" });
    patchEngagement({ status: "CORRECTION REQUIRED" });
    addAudit({ objectType: "Correction", objectId: c.id, action: "Correction submitted", next: "SUBMITTED", finding: data.finding, calcVersion: "V1.1" });
    return c.id;
  }, [corrections.length, role, updateFinding, patchEngagement, addAudit]);

  const decideCorrection = useCallback((id, decision) => {
    setCorrections((arr) => arr.map((c) => c.id === id ? { ...c, status: decision } : c));
    const c = corrections.find((x) => x.id === id);
    if (decision === "ACCEPTED") {
      patchEngagement({ finalVersion: "V1.1" });
      if (c?.finding) updateFinding(c.finding, { status: "CLOSED", response: "Correction accepted." });
      addAudit({ objectType: "Correction", objectId: id, action: "Correction accepted", next: "ACCEPTED", finding: c?.finding, calcVersion: "V1.1" });
      addAudit({ objectType: "Calculation", objectId: "V1.1", action: "Calculation version created", prev: "V1.0", next: "V1.1", calcVersion: "V1.1" });
    } else {
      addAudit({ objectType: "Correction", objectId: id, action: "Correction rejected", next: "REJECTED", finding: c?.finding });
    }
  }, [corrections, patchEngagement, updateFinding, addAudit]);

  const approveTechnicalReview = useCallback(() => {
    patchEngagement({ technicalReviewStatus: "APPROVED", reportStatus: "READY FOR RELEASE", status: "TECHNICAL REVIEW" });
    addAudit({ objectType: "Technical Review", objectId: "TR-026", action: "Technical review approved", prev: "PENDING", next: "APPROVED", calcVersion: finalVersion });
  }, [patchEngagement, addAudit, finalVersion]);

  const returnTechnicalReview = useCallback(() => {
    patchEngagement({ technicalReviewStatus: "RETURNED", reportStatus: "DRAFT" });
    addAudit({ objectType: "Technical Review", objectId: "TR-026", action: "Returned to lead verifier", next: "RETURNED" });
  }, [patchEngagement, addAudit]);

  const releaseVerified = useCallback(() => {
    patchEngagement({ released: true, reportStatus: "VERIFIED", status: "VERIFIED", passportStatus: "VERIFIED DATA ATTACHED" });
    addAudit({ objectType: "Verification", objectId: "VER-026", action: "Verification released", prev: "TECHNICAL REVIEW", next: "VERIFIED", calcVersion: finalVersion, comment: `Verified PCF ${verifiedIntensity} kgCO2e/kg` });
  }, [patchEngagement, addAudit, finalVersion, verifiedIntensity]);

  const issuePassport = useCallback(() => {
    patchEngagement({ passportIssued: true, passportStatus: "ISSUED" });
    addAudit({ objectType: "Carbon Passport", objectId: "CP-GH-2026-001", action: "Carbon Passport issued", next: "ISSUED", calcVersion: finalVersion });
  }, [patchEngagement, addAudit, finalVersion]);

  const value = {
    meta: ENGAGEMENT_META, role, setRole,
    evidence, findings, corrections, audit, conflictAnswers,
    engagement, stageStatus, gate, canRelease,
    verifiedIntensity, verifiedTotal, finalVersion, hasAcceptedCorrection,
    openFindings, materialOpen, correctionsRequired, pendingEvidence,
    // actions
    resolveBlockers, reviewEvidence, completeEvidenceReview, completeCalcReview,
    freezeDataset, assignVerifier, setConflictAnswer, completeConflictCheck,
    approvePlan, completeSiteVisit, raiseFinding, updateFinding,
    submitCorrection, decideCorrection, approveTechnicalReview, returnTechnicalReview,
    releaseVerified, issuePassport, addAudit,
  };

  return <MrvContext.Provider value={value}>{children}</MrvContext.Provider>;
}
