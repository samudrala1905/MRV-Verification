import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitBranch, ArrowRight, Lock } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { Kpi, StatusBadge, Field, SectionCard, RefLink } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const WF = ["Finding", "Company Response", "Correction", "Recalculate", "V1.1", "Verifier Review", "Accept / Reject", "Close Finding"];

export default function Corrections() {
  const navigate = useNavigate();
  const { meta, corrections, findings, submitCorrection, decideCorrection, role, verifiedIntensity } = useMrv();
  const [sel, setSel] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ finding: "FND-026-003", newQty: "119400", reason: "", pcfImpact: "0.02" });
  usePrimaryAction("Submit Corrections", () => setAddOpen(true));

  const canVerify = role === "Verifier";
  const canSubmit = role === "Company Operator" || role === "Carbon Manager";

  const counts = {
    required: corrections.filter((c) => c.status === "SUBMITTED" || c.status === "REQUIRED").length,
    submitted: corrections.filter((c) => c.status === "SUBMITTED").length,
    accepted: corrections.filter((c) => c.status === "ACCEPTED").length,
    rejected: corrections.filter((c) => c.status === "REJECTED").length,
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi testid="kpi-corrections-required" label="Corrections Required" value={counts.required} tone={counts.required ? "amber" : "green"} />
        <Kpi testid="kpi-corrections-submitted" label="Submitted" value={counts.submitted} />
        <Kpi testid="kpi-corrections-accepted" label="Accepted" value={counts.accepted} tone="green" />
        <Kpi testid="kpi-corrections-rejected" label="Rejected" value={counts.rejected} tone="red" />
        <Kpi testid="kpi-recalc-required" label="Recalculation Req." value={counts.accepted ? "Yes" : "Pending"} />
      </div>

      <SectionCard title="Corrections" testid="corrections-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
              {["Correction ID", "Finding", "Affected Record", "Original", "Proposed", "PCF Impact", "Submitted By", "Status"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
            </tr></thead>
            <tbody>
              {corrections.map((c) => (
                <tr key={c.id} data-testid={`correction-row-${c.id}`} onClick={() => setSel(c)} className="cursor-pointer border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 pr-3"><RefLink id={c.id} onClick={() => setSel(c)} /></td>
                  <td className="py-3 pr-3 font-mono text-xs text-emerald-700">{c.finding}</td>
                  <td className="py-3 pr-3 text-slate-600">{c.record}</td>
                  <td className="py-3 pr-3 text-slate-500">{c.origQty.toLocaleString()} {c.origUnit}</td>
                  <td className="py-3 pr-3 text-slate-700">{Number(c.newQty).toLocaleString()} {c.newUnit}</td>
                  <td className="py-3 pr-3 font-semibold text-slate-800">+{c.pcfImpact} kg</td>
                  <td className="py-3 pr-3 text-slate-500">{c.submittedBy}</td>
                  <td className="py-3 pr-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Version Control" testid="version-control">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 text-center">
              <p className="font-mono text-lg font-extrabold text-slate-700">V1.0</p>
              <div className="mt-1 flex items-center justify-center gap-1"><Lock className="h-3 w-3 text-slate-400" /><StatusBadge status="SUBMITTED" /></div>
              <p className="mt-1 text-[11px] font-bold uppercase text-slate-400">Frozen</p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300" />
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center">
              <p className="font-mono text-lg font-extrabold text-emerald-700">V1.1</p>
              <StatusBadge status={counts.accepted ? "ACCEPTED" : "PENDING"} />
              <p className="mt-1 text-[11px] font-bold uppercase text-emerald-600">{counts.accepted ? "Corrected" : "Pending review"}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">The frozen V1.0 snapshot is never modified. Corrections create a new calculation version (V1.1) for verifier review.</p>
        </SectionCard>

        <SectionCard title="Correction Workflow" testid="correction-workflow">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {WF.map((w, i) => (
              <React.Fragment key={w}>
                <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-600">{w}</span>
                {i < WF.length - 1 && <ArrowRight className="h-3 w-3 text-slate-300" />}
              </React.Fragment>
            ))}
          </div>
        </SectionCard>
      </div>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {sel && (
            <>
              <SheetHeader><SheetTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-emerald-600" /> {sel.id}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4">
                <Field label="Finding" value={<RefLink id={sel.finding} onClick={() => navigate("/mrv/findings")} />} />
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                  <p className="col-span-2 text-xs font-bold uppercase tracking-wide text-slate-400">Original Data</p>
                  <Field label="Activity Quantity" value={`${sel.origQty.toLocaleString()} ${sel.origUnit}`} />
                  <Field label="Emission Factor" value={sel.origEf} />
                  <Field label="Factor Version" value={sel.origEfVersion} />
                  <Field label="Calculated CO2e" value={`${sel.origCo2e} tCO2e`} />
                  <Field label="Evidence" value={sel.evidence} mono />
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-emerald-50 p-4">
                  <p className="col-span-2 text-xs font-bold uppercase tracking-wide text-emerald-600">Proposed Correction</p>
                  <Field label="New Quantity" value={`${Number(sel.newQty).toLocaleString()} ${sel.newUnit}`} />
                  <Field label="New Emission Factor" value={sel.newEf} />
                  <Field label="New Evidence" value={sel.newEvidence} />
                  <Field label="Submitted By" value={sel.submittedBy} />
                  <div className="col-span-2"><Field label="Reason" value={sel.reason} /></div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Impact Preview</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-xs text-slate-400">Original PCF</p><p className="font-bold text-slate-700">{meta.claimedIntensity}</p></div>
                    <div><p className="text-xs text-slate-400">Corrected PCF</p><p className="font-bold text-emerald-700">{(meta.claimedIntensity + sel.pcfImpact).toFixed(2)}</p></div>
                    <div><p className="text-xs text-slate-400">Difference</p><p className="font-bold text-amber-600">+{sel.pcfImpact}</p></div>
                  </div>
                  <p className="mt-2 text-center text-xs text-slate-500">Materiality: {(sel.pcfImpact / meta.claimedIntensity * 100).toFixed(2)}% of claim — below 5% threshold (not material).</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button data-testid="correction-accept" disabled={!canVerify || sel.status === "ACCEPTED"} onClick={() => { decideCorrection(sel.id, "ACCEPTED"); toast.success("Correction accepted — V1.1 created"); setSel(null); }} className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Accept Correction</Button>
                  <Button data-testid="correction-reject" disabled={!canVerify} onClick={() => { decideCorrection(sel.id, "REJECTED"); toast("Correction rejected"); setSel(null); }} variant="outline" className="rounded-full text-red-600">Reject Correction</Button>
                  <Button data-testid="correction-info" disabled={!canVerify} onClick={() => toast("More information requested")} variant="outline" className="rounded-full">Request More Info</Button>
                  <Button data-testid="correction-view-recalc" onClick={() => navigate("/pcf/calculation?rec=CALC-0048")} variant="ghost" className="rounded-full text-slate-600">View Recalculation</Button>
                </div>
                {!canVerify && <p className="text-xs text-amber-600">Only a Verifier can accept or reject corrections.</p>}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Submit Correction</DialogTitle></DialogHeader>
          {!canSubmit && <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700">Corrections are submitted by the company (Operator / Carbon Manager).</p>}
          <div className="space-y-3">
            <div><Label>Finding</Label>
              <Select value={form.finding} onValueChange={(v) => setForm({ ...form, finding: v })}>
                <SelectTrigger data-testid="correction-finding" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{findings.filter((f) => f.status !== "CLOSED").map((f) => <SelectItem key={f.id} value={f.id}>{f.id} — {f.area}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>New Quantity</Label><Input data-testid="correction-qty" value={form.newQty} onChange={(e) => setForm({ ...form, newQty: e.target.value })} className="mt-1" /></div>
              <div><Label>PCF Impact (kg)</Label><Input data-testid="correction-impact" value={form.pcfImpact} onChange={(e) => setForm({ ...form, pcfImpact: e.target.value })} className="mt-1" /></div>
            </div>
            <div><Label>Reason</Label><Textarea data-testid="correction-reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="mt-1" placeholder="Reason for correction…" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button data-testid="correction-submit" disabled={!canSubmit} onClick={() => {
              submitCorrection({ finding: form.finding, record: "ACT-0032 / CALC-0048", origQty: 118000, origUnit: "kg", origEf: "1.42 kgCO2e/kg", origEfVersion: "Ecoinvent 3.9", origCo2e: 137.42, evidence: "EVD-00176", newQty: form.newQty, newUnit: "kg", newEf: "1.42 kgCO2e/kg", newEvidence: "EVD-00176 (v2)", reason: form.reason, pcfImpact: Number(form.pcfImpact) || 0 });
              toast.success("Correction submitted"); setAddOpen(false);
            }} className="rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">Submit Correction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
