import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { RISK_ASSESSMENT, SAMPLING_PLAN, PROCEDURES, PLAN_SCHEDULE } from "@/data/mockData";
import { StatusBadge, Field, SectionCard } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OBJECTIVES = [
  ["Claim Being Verified", "2.84 kgCO2e/kg (284.0 tCO2e)"],
  ["Verification Scope", "Full cradle-to-gate PCF"],
  ["System Boundary", "Cradle-to-Gate"],
  ["Verification Criteria", "ISO 14064-3"],
  ["Methodology", "ISO 14067"],
  ["Verification Approach", "Recalculation + evidence testing"],
  ["Materiality Approach", "5% of total footprint"],
  ["Sampling Approach", "Risk-based judgemental sampling"],
];

export default function Plan() {
  const { meta, engagement, approvePlan } = useMrv();
  usePrimaryAction(engagement.planApproved ? "Plan Approved" : "Approve Verification Plan", () => { approvePlan(); toast.success("Verification plan approved"); });

  return (
    <div className="space-y-5">
      <SectionCard testid="plan-top" action={<StatusBadge status={engagement.planApproved ? "PLAN APPROVED" : "DRAFT"} />}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          <Field label="Engagement" value={meta.engagementId} mono />
          <Field label="Organisation" value={meta.organisation} />
          <Field label="Facility" value={meta.facility} />
          <Field label="Product" value={meta.product} />
          <Field label="Batch" value={meta.batch} mono />
          <Field label="Claim" value={`${meta.claimedIntensity} kg`} />
          <Field label="Reporting Period" value={meta.reportingPeriod} />
        </div>
      </SectionCard>

      <SectionCard title="Verification Objectives" testid="plan-objectives">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OBJECTIVES.map(([l, v]) => <Field key={l} label={l} value={v} />)}
        </div>
      </SectionCard>

      <SectionCard title="Risk Assessment" testid="plan-risk">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
              {["Area", "Inherent Risk", "Control Risk", "Impact", "Priority", "Planned Procedure"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
            </tr></thead>
            <tbody>
              {RISK_ASSESSMENT.map((r) => (
                <tr key={r.area} data-testid={`risk-row-${r.area.replace(/\s/g, "-").toLowerCase()}`} className="border-b border-slate-50">
                  <td className="py-3 pr-3 font-semibold text-slate-800">{r.area}</td>
                  <td className="py-3 pr-3"><StatusBadge status={r.inherent} /></td>
                  <td className="py-3 pr-3"><StatusBadge status={r.control} /></td>
                  <td className="py-3 pr-3"><StatusBadge status={r.impact} /></td>
                  <td className="py-3 pr-3"><StatusBadge status={r.priority} /></td>
                  <td className="py-3 pr-3 text-slate-500">{r.procedure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Sampling Plan" testid="plan-sampling">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
              {["Population", "Sample Size", "Selection", "Reason", "Evidence", "Verifier"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
            </tr></thead>
            <tbody>
              {SAMPLING_PLAN.map((s) => (
                <tr key={s.pop} className="border-b border-slate-50">
                  <td className="py-3 pr-3 font-semibold text-slate-800">{s.pop}</td>
                  <td className="py-3 pr-3 text-slate-600">{s.size}</td>
                  <td className="py-3 pr-3 text-slate-500">{s.selection}</td>
                  <td className="py-3 pr-3 text-slate-500">{s.reason}</td>
                  <td className="py-3 pr-3 font-mono text-xs text-emerald-700">{s.evidence}</td>
                  <td className="py-3 pr-3 text-slate-500">{s.verifier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Verification Procedures" testid="plan-procedures">
          <div className="flex flex-wrap gap-2">
            {PROCEDURES.map((p) => <span key={p} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">{p}</span>)}
          </div>
        </SectionCard>

        <SectionCard title="Plan Schedule" className="lg:col-span-2" testid="plan-schedule">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                {["Task", "Owner", "Start", "Due", "Status"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
              </tr></thead>
              <tbody>
                {PLAN_SCHEDULE.map((s) => (
                  <tr key={s.task} className="border-b border-slate-50">
                    <td className="py-3 pr-3 font-semibold text-slate-800">{s.task}</td>
                    <td className="py-3 pr-3 text-slate-500">{s.owner}</td>
                    <td className="py-3 pr-3 text-slate-500">{s.start}</td>
                    <td className="py-3 pr-3 text-slate-500">{s.due}</td>
                    <td className="py-3 pr-3"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-600" /><p className="font-bold text-emerald-800">{engagement.planApproved ? "PLAN APPROVED" : "Awaiting approval"}</p></div>
        <Button data-testid="plan-approve-btn" onClick={() => { approvePlan(); toast.success("Verification plan approved"); }} className="rounded-full bg-emerald-600 font-bold text-white hover:bg-emerald-700">Approve Verification Plan</Button>
      </div>
    </div>
  );
}
