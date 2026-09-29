import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, Paperclip, Flag, Plus } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { SITE_AGENDA, SITE_CHECKLIST, SITE_OBSERVATIONS } from "@/data/mockData";
import { Kpi, StatusBadge, Field, SectionCard, RefLink } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SiteVisits() {
  const navigate = useNavigate();
  const { meta, engagement, completeSiteVisit, raiseFinding, addAudit } = useMrv();
  const [checks, setChecks] = useState(() => SITE_CHECKLIST.reduce((a, c, i) => ({ ...a, [c]: i < 9 }), {}));
  const [obs, setObs] = useState(SITE_OBSERVATIONS);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ area: "", desc: "", activity: "" });
  usePrimaryAction(engagement.siteVisitComplete ? "Site Visit Complete" : "Complete Site Visit", () => { completeSiteVisit(); toast.success("Site visit completed"); });

  const done = Object.values(checks).filter(Boolean).length;

  const addObservation = () => {
    const o = { id: `OBS-026-${String(obs.length + 1).padStart(2, "0")}`, area: form.area || "General", desc: form.desc, activity: form.activity || "—", evidence: "—", verifier: meta.leadVerifier, severity: "MEDIUM", followUp: "Yes" };
    setObs((a) => [...a, o]);
    addAudit({ objectType: "Observation", objectId: o.id, action: "Observation added", next: "OPEN" });
    toast.success("Observation added"); setAddOpen(false); setForm({ area: "", desc: "", activity: "" });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi testid="kpi-scheduled-visits" label="Scheduled Visits" value={1} />
        <Kpi testid="kpi-completed-visits" label="Completed Visits" value={engagement.siteVisitComplete ? 1 : 0} tone={engagement.siteVisitComplete ? "green" : "amber"} />
        <Kpi testid="kpi-open-observations" label="Open Observations" value={obs.filter((o) => o.followUp === "Yes").length} tone="amber" />
        <Kpi testid="kpi-evidence-collected" label="Evidence Collected" value={2} />
      </div>

      <SectionCard testid="visit-card" action={<StatusBadge status={engagement.siteVisitComplete ? "COMPLETE" : "IN PROGRESS"} />}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><MapPin className="h-5 w-5" /></span>
          <div><p className="font-mono text-sm font-bold text-emerald-700">VIS-026-01</p><p className="font-bold text-slate-900">{meta.facility}</p></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Visit Type" value="On-site" />
          <Field label="Date" value="2026-05-12" />
          <Field label="Verification Team" value="Dr. Kofi Mensah, S. Boateng" />
          <Field label="Facility Contacts" value="K. Adjei (Carbon Manager)" />
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Site Visit Agenda" testid="visit-agenda">
          <ol className="space-y-2 text-sm">
            {SITE_AGENDA.map((a, i) => (
              <li key={a} className="flex items-center gap-3 text-slate-700"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{i + 1}</span>{a}</li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title={`Site Visit Checklist (${done}/${SITE_CHECKLIST.length})`} testid="visit-checklist">
          <div className="space-y-2">
            {SITE_CHECKLIST.map((c) => (
              <label key={c} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                <Checkbox data-testid={`visit-check-${c.replace(/\s/g, "-").toLowerCase()}`} checked={!!checks[c]} onCheckedChange={(v) => setChecks((s) => ({ ...s, [c]: !!v }))} />{c}
              </label>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Observation Records" testid="visit-observations"
        action={<Button size="sm" variant="outline" data-testid="add-observation-btn" onClick={() => setAddOpen(true)} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> Add Observation</Button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
              {["Obs ID", "Area", "Description", "Activity", "Evidence", "Verifier", "Severity", "Follow-up"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
            </tr></thead>
            <tbody>
              {obs.map((o) => (
                <tr key={o.id} data-testid={`observation-row-${o.id}`} className="border-b border-slate-50">
                  <td className="py-3 pr-3 font-mono text-xs font-semibold text-emerald-700">{o.id}</td>
                  <td className="py-3 pr-3 text-slate-600">{o.area}</td>
                  <td className="py-3 pr-3 text-slate-600">{o.desc}</td>
                  <td className="py-3 pr-3">{o.activity !== "—" ? <RefLink id={o.activity} onClick={() => navigate("/pcf/inventory?rec=" + o.activity)} /> : "—"}</td>
                  <td className="py-3 pr-3">{o.evidence !== "—" ? <RefLink id={o.evidence} onClick={() => navigate("/mrv/evidence")} /> : "—"}</td>
                  <td className="py-3 pr-3 text-slate-500">{o.verifier}</td>
                  <td className="py-3 pr-3"><StatusBadge status={o.severity} /></td>
                  <td className="py-3 pr-3">
                    {o.followUp === "Yes"
                      ? <Button size="sm" variant="ghost" data-testid={`obs-finding-${o.id}`} onClick={() => { raiseFinding({ classification: "Observation", area: o.area, desc: o.desc, activity: o.activity, calc: "—" }); toast.success("Finding created"); navigate("/mrv/findings"); }} className="h-7 text-xs text-red-600"><Flag className="mr-1 h-3 w-3" /> Create Finding</Button>
                      : <span className="text-xs text-slate-400">No</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" data-testid="upload-photo-btn" onClick={() => toast.success("Photo uploaded (EVD-00140)")} className="rounded-full"><Camera className="mr-1 h-4 w-4" /> Upload Photo</Button>
          <Button variant="outline" data-testid="attach-evidence-btn" onClick={() => navigate("/mrv/evidence")} className="rounded-full"><Paperclip className="mr-1 h-4 w-4" /> Attach Evidence</Button>
          <Button data-testid="complete-visit-btn" onClick={() => { completeSiteVisit(); toast.success("Site visit completed"); }} className="ml-auto rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">Complete Site Visit</Button>
        </div>
      </SectionCard>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Observation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Area</Label><Input data-testid="obs-area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="mt-1" /></div>
            <div><Label>Description</Label><Textarea data-testid="obs-desc" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="mt-1" /></div>
            <div><Label>Linked Activity</Label><Input data-testid="obs-activity" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} placeholder="ACT-0021" className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button data-testid="obs-submit" onClick={addObservation} className="rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">Add Observation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
