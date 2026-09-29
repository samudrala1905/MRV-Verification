import React, { useState } from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { VERIFIER_ORGS, VERIFIER_TEAM } from "@/data/mockData";
import { Kpi, StatusBadge, Field, SectionCard } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

export default function Verifiers() {
  const { engagement, assignVerifier } = useMrv();
  const [sel, setSel] = useState(null);
  usePrimaryAction("Assign Verifier", () => { assignVerifier(); toast.success("Verifier assigned to VER-026"); });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi testid="kpi-verifier-orgs" label="Verifier Organisations" value={VERIFIER_ORGS.length} />
        <Kpi testid="kpi-available-verifiers" label="Available Verifiers" value={10} />
        <Kpi testid="kpi-assigned-engagements" label="Assigned Engagements" value={engagement.verifierAssigned ? 4 : 3} tone="green" />
        <Kpi testid="kpi-expiring-credentials" label="Expiring Credentials" value={1} tone="amber" />
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-600" />
        <p>Accreditation is <b>not</b> assumed. The platform stores documentary recognition references and certificates only — it does not automatically certify a verifier as accredited.</p>
      </div>

      <SectionCard title="Verifier Organisations" testid="verifier-orgs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                {["Organisation", "Country", "Scope", "Recognition Ref", "Validity", "Personnel", "Engagements", "Status", "Actions"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {VERIFIER_ORGS.map((o) => (
                <tr key={o.org} data-testid={`verifier-row-${o.org.replace(/[^a-zA-Z]+/g, "-")}`} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 pr-3 font-semibold text-slate-800">{o.org}</td>
                  <td className="py-3 pr-3 text-slate-500">{o.country}</td>
                  <td className="py-3 pr-3 text-slate-500">{o.scope}</td>
                  <td className="py-3 pr-3 text-slate-500">{o.ref}</td>
                  <td className="py-3 pr-3 text-slate-500">{o.validity}</td>
                  <td className="py-3 pr-3 text-slate-500">{o.personnel}</td>
                  <td className="py-3 pr-3 text-slate-500">{o.engagements}</td>
                  <td className="py-3 pr-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 pr-3"><Button size="sm" variant="ghost" data-testid={`verifier-view-${o.org.replace(/[^a-zA-Z]+/g, "-")}`} onClick={() => setSel(o)} className="h-7 text-xs text-emerald-700">Profile</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Verification Team" testid="verification-team"
        action={<StatusBadge status={engagement.verifierAssigned ? "VERIFIER ASSIGNED" : "UNASSIGNED"} />}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VERIFIER_TEAM.map((m) => (
            <div key={m.name} data-testid={`team-${m.role.replace(/\s/g, "-").toLowerCase()}`} className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">{m.role}</p>
              <p className="mt-1 font-bold text-slate-800">{m.name}</p>
              <p className="mt-1 text-xs text-slate-500">{m.qual}</p>
              <p className="mt-1 text-xs text-slate-500">{m.sector}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">{m.engagements} engagements</span>
                <StatusBadge status={m.independence} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {sel && (
            <>
              <SheetHeader><SheetTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-emerald-600" /> {sel.org}</SheetTitle></SheetHeader>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Field label="Address" value={sel.address} />
                <Field label="Country" value={sel.country} />
                <Field label="Website" value={sel.website} />
                <Field label="Contact" value={sel.contact} />
                <Field label="Verification Scope" value={sel.scope} />
                <Field label="Sector Competence" value={sel.sector} />
                <Field label="Recognition Body" value={sel.body} />
                <Field label="Certificate / Reference" value={sel.cert} mono />
                <Field label="Valid From" value={sel.from} />
                <Field label="Valid Until" value={sel.until} />
                <Field label="Supporting Certificate" value={sel.certDoc} mono />
                <Field label="Status" value={<StatusBadge status={sel.status} />} />
              </div>
              <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                Recognition reference stored for documentary purposes only. Independent accreditation must be confirmed with the recognition body.
              </div>
              <Button data-testid="verifier-assign-drawer" onClick={() => { assignVerifier(); toast.success(`${sel.org} assigned`); setSel(null); }} className="mt-4 w-full rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">Assign to VER-026</Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
