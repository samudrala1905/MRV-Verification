import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { Kpi, StatusBadge, Field, SectionCard } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ConflictCheck() {
  const { meta, engagement, conflictAnswers, setConflictAnswer, completeConflictCheck } = useMrv();
  usePrimaryAction("Complete Conflict Check", () => { completeConflictCheck(); toast.success("Conflict check completed"); });

  const anyYes = conflictAnswers.some((a) => a.answer === "YES");
  const result = engagement.conflictComplete ? engagement.conflictResult : (anyYes ? "POTENTIAL CONFLICT" : "NO CONFLICT IDENTIFIED");

  return (
    <div className="space-y-5">
      <SectionCard testid="conflict-header">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Field label="Engagement" value={meta.engagementId} mono />
            <Field label="Verifier" value={meta.verifierOrg} />
          </div>
          <StatusBadge status={result} className="text-sm" />
        </div>
      </SectionCard>

      <SectionCard title="Conflict Checklist" testid="conflict-checklist">
        <div className="space-y-3">
          {conflictAnswers.map((a, i) => (
            <div key={a.q} data-testid={`conflict-item-${i}`} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-slate-800">{a.q}</p>
                <div className="flex gap-1.5">
                  {["YES", "NO", "N/A"].map((opt) => (
                    <button key={opt} data-testid={`conflict-${i}-${opt.replace("/", "")}`} onClick={() => setConflictAnswer(i, { answer: opt })}
                      className={cn("rounded-full border px-3 py-1 text-xs font-bold",
                        a.answer === opt ? (opt === "YES" ? "border-red-400 bg-red-500 text-white" : "border-emerald-400 bg-emerald-500 text-white") : "border-slate-200 bg-white text-slate-500")}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {a.answer === "YES" && (
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Input placeholder="Risk level" className="text-sm" data-testid={`conflict-${i}-risk`} onChange={(e) => setConflictAnswer(i, { risk: e.target.value })} />
                  <Input placeholder="Mitigation" className="text-sm" data-testid={`conflict-${i}-mitigation`} onChange={(e) => setConflictAnswer(i, { mitigation: e.target.value })} />
                  <Input placeholder="Approval required by" className="text-sm" data-testid={`conflict-${i}-approval`} onChange={(e) => setConflictAnswer(i, { approval: e.target.value })} />
                </div>
              )}
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Input value={a.explanation} onChange={(e) => setConflictAnswer(i, { explanation: e.target.value })} placeholder="Explanation" className="text-sm" data-testid={`conflict-${i}-explanation`} />
                <div className="flex items-center gap-4 text-xs text-slate-400"><span>Reviewer: {a.reviewer}</span><span>{a.date}</span></div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Conflict Declaration" className="lg:col-span-2" testid="conflict-declaration">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Verifier" value={meta.verifierOrg} />
            <Field label="Date" value="2026-04-22" />
            <Field label="Digital Approval Record" value="SIG-CFL-026 · signed" mono />
            <Field label="Supporting Document" value="EVD-00132" mono />
          </div>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            The verification team declares that it has assessed all independence risks in relation to {meta.organisation} and confirms it can perform this engagement objectively and impartially in accordance with ISO 14064-3.
          </p>
        </SectionCard>

        <div className={cn("rounded-2xl border p-5", result.includes("NO CONFLICT") ? "border-emerald-200 bg-emerald-50" : result.includes("BLOCKING") ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50")}>
          <ShieldCheck className={cn("h-8 w-8", result.includes("NO CONFLICT") ? "text-emerald-600" : result.includes("BLOCKING") ? "text-red-600" : "text-amber-600")} />
          <p className="mt-3 text-lg font-extrabold text-slate-800">{result}</p>
          <p className="mt-1 text-sm text-slate-600">
            {result.includes("NO CONFLICT") ? "Independence confirmed — engagement may proceed." : "An unresolved blocking independence issue prevents the engagement from progressing."}
          </p>
          <Button data-testid="conflict-complete-btn" onClick={() => { completeConflictCheck(); toast.success("Conflict check completed"); }} className="mt-4 w-full rounded-full bg-emerald-600 font-bold text-white hover:bg-emerald-700">Complete Conflict Check</Button>
        </div>
      </div>
    </div>
  );
}
