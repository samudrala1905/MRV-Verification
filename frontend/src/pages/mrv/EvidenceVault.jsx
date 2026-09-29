import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck2, Link2, MessageSquarePlus, Check, X, HelpCircle } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { EVIDENCE_CATEGORIES } from "@/data/mockData";
import { Kpi, StatusBadge, Field, SectionCard, RefLink } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { refRoute } from "@/lib/mrvNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EvidenceVault() {
  const navigate = useNavigate();
  const { meta, evidence, reviewEvidence, role, addAudit } = useMrv();
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [comment, setComment] = useState("");
  usePrimaryAction("Add Evidence", () => setAddOpen(true));

  const canReview = role === "Verifier";
  const rows = evidence.filter((e) => cat === "All" || e.category === cat);
  const counts = {
    total: meta.evidenceItems, accepted: evidence.filter((e) => e.status === "ACCEPTED").length,
    pending: evidence.filter((e) => e.status === "PENDING").length, rejected: evidence.filter((e) => e.status === "REJECTED").length,
  };

  const doReview = (id, decision) => {
    if (!canReview) { toast.error("Only a Verifier can review evidence."); return; }
    reviewEvidence(id, decision, comment);
    toast.success(`Evidence ${id} ${decision.toLowerCase()}`);
    setComment(""); setSel(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi testid="kpi-evidence-items" label="Evidence Items" value={counts.total} />
        <Kpi testid="kpi-evidence-accepted" label="Accepted" value={169 + counts.accepted - 3} tone="green" />
        <Kpi testid="kpi-evidence-pending" label="Pending Review" value={counts.pending} tone="amber" />
        <Kpi testid="kpi-evidence-rejected" label="Rejected / Missing" value={counts.rejected} tone="red" />
      </div>

      <div className="flex flex-wrap gap-2">
        {EVIDENCE_CATEGORIES.map((c) => (
          <button key={c} data-testid={`evidence-filter-${c.toLowerCase().replace(/[^a-z]+/g, "-")}`} onClick={() => setCat(c)}
            className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              cat === c ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300")}>
            {c}
          </button>
        ))}
      </div>

      <SectionCard title={`Evidence (${rows.length})`} testid="evidence-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                {["Evidence ID", "Document / Dataset", "Category", "Linked Activity", "Linked Calc", "Source", "Period", "Hash", "Ver", "Status", "Actions"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} data-testid={`evidence-row-${e.id}`} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 pr-3"><RefLink id={e.id} onClick={() => setSel(e)} /></td>
                  <td className="py-3 pr-3 font-semibold text-slate-800">{e.title}</td>
                  <td className="py-3 pr-3 text-slate-500">{e.category}</td>
                  <td className="py-3 pr-3">{e.activity !== "—" ? <RefLink id={e.activity} onClick={() => navigate(refRoute(e.activity))} /> : "—"}</td>
                  <td className="py-3 pr-3">{e.calc !== "—" ? <RefLink id={e.calc} onClick={() => navigate(refRoute(e.calc))} /> : "—"}</td>
                  <td className="py-3 pr-3 text-slate-500">{e.source}</td>
                  <td className="py-3 pr-3 text-slate-500">{e.period}</td>
                  <td className="py-3 pr-3 font-mono text-xs text-slate-400">{e.hash}</td>
                  <td className="py-3 pr-3 text-slate-500">{e.version}</td>
                  <td className="py-3 pr-3"><StatusBadge status={e.status} /></td>
                  <td className="py-3 pr-3">
                    <Button size="sm" variant="ghost" data-testid={`evidence-view-${e.id}`} onClick={() => setSel(e)} className="h-7 text-xs text-emerald-700">Open</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* detail drawer */}
      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {sel && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-emerald-600" /> {sel.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                <div>
                  <p className="text-lg font-bold text-slate-900">{sel.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{sel.desc}</p>
                  <div className="mt-2"><StatusBadge status={sel.status} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category" value={sel.category} />
                  <Field label="Original Source" value={sel.source} />
                  <Field label="Source System" value={sel.sourceSystem} />
                  <Field label="Linked Facility" value={meta.facility} />
                  <Field label="Linked Product" value={meta.product} />
                  <Field label="Linked Batch" value={meta.batch} />
                  <Field label="Linked Activity" value={sel.activity} mono />
                  <Field label="Linked Calculation" value={sel.calc} mono />
                  <Field label="Reporting Period" value={sel.period} />
                  <Field label="Version" value={sel.version} />
                  <Field label="Uploaded By" value={sel.uploadedBy} />
                  <Field label="Uploaded At" value={sel.uploadedAt} />
                  <Field label="Document Hash" value={sel.hash} mono />
                  <Field label="Reviewer" value={sel.reviewer} />
                  <Field label="Review Date" value={sel.reviewDate} />
                </div>
                {sel.comment && <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><span className="font-semibold">Reviewer comments: </span>{sel.comment}</div>}

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Provenance chain</p>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {sel.provenance.map((p, i) => (
                      <React.Fragment key={i}>
                        <span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">{p}</span>
                        {i < sel.provenance.length - 1 && <span className="text-slate-300">↓</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wide text-slate-400">Add comment</Label>
                  <Textarea data-testid="evidence-comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Reviewer comment…" className="mt-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button data-testid="evidence-accept" onClick={() => doReview(sel.id, "ACCEPTED")} disabled={!canReview} className="rounded-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700"><Check className="mr-1 h-4 w-4" /> Accept</Button>
                  <Button data-testid="evidence-reject" onClick={() => doReview(sel.id, "REJECTED")} disabled={!canReview} variant="outline" className="rounded-full font-semibold text-red-600"><X className="mr-1 h-4 w-4" /> Reject</Button>
                  <Button data-testid="evidence-clarify" onClick={() => doReview(sel.id, "PENDING")} disabled={!canReview} variant="outline" className="rounded-full font-semibold"><HelpCircle className="mr-1 h-4 w-4" /> Request Clarification</Button>
                  <Button data-testid="evidence-link" onClick={() => navigate(refRoute(sel.activity) || "/pcf/inventory")} variant="ghost" className="rounded-full text-slate-600"><Link2 className="mr-1 h-4 w-4" /> Link to Activity</Button>
                  <Button data-testid="evidence-view-calc" onClick={() => navigate(refRoute(sel.calc) || "/pcf/calculation")} variant="ghost" className="rounded-full text-slate-600">View Calculation</Button>
                </div>
                {!canReview && <p className="text-xs font-medium text-amber-600">Switch demo role to “Verifier” to review evidence.</p>}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* add evidence modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><MessageSquarePlus className="h-5 w-5 text-emerald-600" /> Add Evidence</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input data-testid="add-evidence-title" placeholder="e.g. Utility invoice April" className="mt-1" /></div>
            <div><Label>Category</Label>
              <Select defaultValue="Meter Data"><SelectTrigger data-testid="add-evidence-category" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{EVIDENCE_CATEGORIES.filter((c) => c !== "All").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Linked Activity</Label><Input data-testid="add-evidence-activity" placeholder="ACT-0021" className="mt-1" /></div>
            <div><Label>Description</Label><Textarea data-testid="add-evidence-desc" placeholder="Describe the evidence…" className="mt-1" /></div>
            <p className="text-xs text-slate-500">A SHA-256 hash and version record are generated automatically. Evidence is never silently deleted — all changes are audit-logged.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button data-testid="add-evidence-submit" onClick={() => { addAudit({ objectType: "Evidence", objectId: "EVD-NEW", action: "Evidence uploaded", next: "PENDING" }); toast.success("Evidence added (pending review)"); setAddOpen(false); }} className="rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">Upload Evidence</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
