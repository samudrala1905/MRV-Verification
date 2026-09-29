import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flag, ChevronRight } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { Kpi, StatusBadge, Field, SectionCard, RefLink } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { refRoute } from "@/lib/mrvNav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Open", "Clarification", "Observation", "Non-conformity", "Potential Misstatement", "Material Issue", "Closed"];
const CLASSES = ["Clarification", "Observation", "Non-conformity", "Potential Misstatement", "Material Issue"];

export default function Findings() {
  const navigate = useNavigate();
  const { findings, raiseFinding, updateFinding, role } = useMrv();
  const [filter, setFilter] = useState("All");
  const [sel, setSel] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ classification: "Clarification", area: "", desc: "", activity: "", calc: "" });
  const [resp, setResp] = useState("");
  usePrimaryAction("Raise Finding", () => setAddOpen(true));

  const canVerify = role === "Verifier";
  const canRespond = role === "Company Operator" || role === "Carbon Manager";

  const rows = findings.filter((f) => {
    if (filter === "All") return true;
    if (filter === "Open") return f.status !== "CLOSED";
    if (filter === "Closed") return f.status === "CLOSED";
    return f.classification === filter;
  });

  const counts = {
    open: findings.filter((f) => f.status !== "CLOSED").length,
    material: findings.filter((f) => (f.classification === "Potential Misstatement" || f.classification === "Material Issue") && f.status !== "CLOSED").length,
    minor: findings.filter((f) => f.status !== "CLOSED" && f.classification !== "Potential Misstatement" && f.classification !== "Material Issue").length,
    closed: findings.filter((f) => f.status === "CLOSED").length,
  };

  const act = (id, patch, label) => { updateFinding(id, patch, label); toast.success(label); if (patch.status) setSel(null); };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi testid="kpi-open-findings" label="Open Findings" value={counts.open} tone={counts.open ? "amber" : "green"} />
        <Kpi testid="kpi-material-findings" label="Potentially Material" value={counts.material} tone={counts.material ? "red" : "green"} />
        <Kpi testid="kpi-minor-findings" label="Minor" value={counts.minor} />
        <Kpi testid="kpi-closed-findings" label="Closed" value={counts.closed} tone="green" />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} data-testid={`findings-filter-${f.replace(/\s/g, "-").toLowerCase()}`} onClick={() => setFilter(f)}
            className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold", filter === f ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300")}>{f}</button>
        ))}
      </div>

      <SectionCard title={`Findings (${rows.length})`} testid="findings-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
              {["Finding ID", "Classification", "Area", "Description", "Activity", "Calc", "Impact", "Owner", "Due", "Status"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id} data-testid={`finding-row-${f.id}`} onClick={() => setSel(f)} className="cursor-pointer border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 pr-3"><RefLink id={f.id} onClick={() => setSel(f)} /></td>
                  <td className="py-3 pr-3"><StatusBadge status={f.classification} /></td>
                  <td className="py-3 pr-3 text-slate-600">{f.area}</td>
                  <td className="py-3 pr-3 max-w-xs truncate text-slate-600">{f.desc}</td>
                  <td className="py-3 pr-3 font-mono text-xs text-emerald-700">{f.activity}</td>
                  <td className="py-3 pr-3 font-mono text-xs text-emerald-700">{f.calc}</td>
                  <td className="py-3 pr-3 text-slate-500">{f.impact}</td>
                  <td className="py-3 pr-3 text-slate-500">{f.owner}</td>
                  <td className="py-3 pr-3 text-slate-500">{f.due}</td>
                  <td className="py-3 pr-3"><StatusBadge status={f.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {sel && (
            <>
              <SheetHeader><SheetTitle className="flex items-center gap-2"><Flag className="h-5 w-5 text-red-500" /> {sel.id}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2"><StatusBadge status={sel.classification} /><StatusBadge status={sel.status} /></div>
                <p className="text-sm text-slate-700">{sel.desc}</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Created By" value={sel.createdBy} />
                  <Field label="Created At" value={sel.createdAt} />
                  <Field label="Applicable Requirement" value={sel.requirement} />
                  <Field label="Affected Activity" value={sel.activity} mono />
                  <Field label="Affected Calculation" value={sel.calc} mono />
                  <Field label="Potential CO2e Impact" value={sel.impact} />
                  <Field label="Materiality Assessment" value={sel.materiality} />
                  <Field label="Due Date" value={sel.due} />
                </div>
                {sel.attachments?.length > 0 && (
                  <div><p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Affected Evidence</p>
                    <div className="flex flex-wrap gap-2">{sel.attachments.map((a) => <RefLink key={a} id={a} onClick={() => navigate("/mrv/evidence")} />)}</div></div>
                )}
                <div className="rounded-lg bg-slate-50 p-3 text-sm"><span className="font-semibold text-slate-600">Verifier comment: </span><span className="text-slate-600">{sel.comment || "—"}</span></div>
                {sel.response && <div className="rounded-lg bg-emerald-50 p-3 text-sm"><span className="font-semibold text-emerald-700">Company response: </span>{sel.response}</div>}

                {canRespond && sel.status !== "CLOSED" && (
                  <div><Label>Company Response</Label><Textarea data-testid="finding-response" value={resp} onChange={(e) => setResp(e.target.value)} className="mt-1" placeholder="Provide response…" />
                    <Button data-testid="finding-submit-response" onClick={() => { act(sel.id, { response: resp }, "Response submitted"); setResp(""); }} className="mt-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Submit Response</Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <Button data-testid="finding-clarify" disabled={!canVerify} onClick={() => act(sel.id, {}, "Clarification requested")} variant="outline" className="rounded-full text-xs">Request Clarification</Button>
                  <Button data-testid="finding-assign" disabled={!canVerify} onClick={() => act(sel.id, { owner: "Carbon Manager" }, "Owner assigned")} variant="outline" className="rounded-full text-xs">Assign Owner</Button>
                  <Button data-testid="finding-escalate" disabled={!canVerify} onClick={() => act(sel.id, { classification: "Material Issue" }, "Finding escalated")} variant="outline" className="rounded-full text-xs">Escalate</Button>
                  <Button data-testid="finding-require-correction" disabled={!canVerify} onClick={() => { navigate("/mrv/corrections"); setSel(null); toast("Require correction — see Corrections tab"); }} variant="outline" className="rounded-full text-xs text-amber-600">Require Correction</Button>
                  <Button data-testid="finding-accept" disabled={!canVerify} onClick={() => act(sel.id, { status: "CLOSED", response: sel.response || "Accepted." }, "Response accepted")} variant="outline" className="rounded-full text-xs text-emerald-700">Accept Response</Button>
                  <Button data-testid="finding-close" disabled={!canVerify} onClick={() => act(sel.id, { status: "CLOSED" }, "Finding closed")} className="rounded-full bg-slate-900 text-xs text-white">Close Finding</Button>
                </div>
                {!canVerify && !canRespond && <p className="text-xs text-amber-600">Switch role to Verifier or Carbon Manager to act on findings.</p>}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Raise Finding</DialogTitle></DialogHeader>
          {!canVerify && <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700">Only a Verifier can raise findings — switch demo role to Verifier.</p>}
          <div className="space-y-3">
            <div><Label>Classification</Label>
              <Select value={form.classification} onValueChange={(v) => setForm({ ...form, classification: v })}>
                <SelectTrigger data-testid="finding-classification" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Area</Label><Input data-testid="finding-area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="mt-1" /></div>
            <div><Label>Description</Label><Textarea data-testid="finding-desc" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Affected Activity</Label><Input data-testid="finding-activity" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} placeholder="ACT-0032" className="mt-1" /></div>
              <div><Label>Affected Calculation</Label><Input data-testid="finding-calc" value={form.calc} onChange={(e) => setForm({ ...form, calc: e.target.value })} placeholder="CALC-0048" className="mt-1" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button data-testid="finding-raise-submit" disabled={!canVerify} onClick={() => { raiseFinding({ ...form, activity: form.activity || "—", calc: form.calc || "—" }); toast.success("Finding raised"); setAddOpen(false); setForm({ classification: "Clarification", area: "", desc: "", activity: "", calc: "" }); }} className="rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">Raise Finding</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
