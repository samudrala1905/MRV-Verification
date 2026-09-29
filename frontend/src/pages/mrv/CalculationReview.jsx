import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { CALC_LINES, CHECK_ENGINE } from "@/data/mockData";
import { Kpi, StatusBadge, SectionCard, Field, RefLink } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { refRoute } from "@/lib/mrvNav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SCOPES = ["Scope 1", "Scope 2", "Scope 3"];

export default function CalculationReview() {
  const navigate = useNavigate();
  const { meta, engagement, completeCalcReview, raiseFinding, role } = useMrv();
  const [open, setOpen] = useState({ "Scope 2": true });
  const [sel, setSel] = useState(null);
  usePrimaryAction("Complete Review", () => { completeCalcReview(); toast.success("Calculation review completed"); });

  const passed = CHECK_ENGINE.filter((c) => c.status === "PASS").length;
  const total = 49;
  const canReview = role === "Verifier";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi testid="kpi-claimed-pcf" label="Claimed PCF" value={`${meta.claimedIntensity} kgCO2e/kg`} />
        <Kpi testid="kpi-total-footprint" label="Total Footprint" value={`${meta.claimedTotal} tCO2e`} />
        <Kpi testid="kpi-calc-version" label="Calculation Version" value="V1.0" />
        <Kpi testid="kpi-checks" label="Checks Passed" value={`${passed + 45}/${total}`} tone={passed + 45 === total ? "green" : "amber"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Calculation Tree" className="lg:col-span-2" testid="calc-tree"
          action={<StatusBadge status={engagement.calcReviewComplete ? "CALCULATION REVIEW COMPLETE" : "IN REVIEW"} />}>
          <div className="mb-3 rounded-xl bg-emerald-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">PCF Total</p>
            <p className="text-2xl font-extrabold text-emerald-800">{meta.claimedTotal} tCO2e</p>
          </div>
          {SCOPES.map((scope) => {
            const lines = CALC_LINES.filter((l) => l.scope === scope);
            const sum = lines.reduce((s, l) => s + l.co2e, 0);
            const isOpen = open[scope];
            return (
              <div key={scope} className="border-b border-slate-100 last:border-0">
                <button data-testid={`calc-scope-${scope.replace(/\s/g, "-").toLowerCase()}`} onClick={() => setOpen((o) => ({ ...o, [scope]: !o[scope] }))}
                  className="flex w-full items-center justify-between py-3 text-left">
                  <span className="flex items-center gap-2 font-bold text-slate-800">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}{scope}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">{sum.toFixed(2)} tCO2e</span>
                </button>
                {isOpen && (
                  <div className="pb-2 pl-6">
                    {lines.map((l) => (
                      <button key={l.id} data-testid={`calc-line-${l.id}`} onClick={() => setSel(l)}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-emerald-700">{l.id}</span>
                          <span className="text-slate-600">{l.category} · {l.activity}</span>
                          {l.status === "QUERY" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        </span>
                        <span className="font-semibold text-slate-700">{l.co2e.toFixed(2)} t</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </SectionCard>

        <SectionCard title="Check Engine" testid="check-engine">
          <div className="space-y-1.5">
            {CHECK_ENGINE.map((c) => (
              <div key={c.name} className={cn("flex items-start gap-2 rounded-lg px-3 py-2 text-sm", c.status === "FAIL" ? "bg-red-50" : "bg-slate-50")}>
                {c.status === "PASS" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />}
                <div>
                  <p className={cn("font-semibold", c.status === "FAIL" ? "text-red-700" : "text-slate-700")}>{c.name}</p>
                  {c.detail && <p className="text-xs text-red-600">{c.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Calculation Review" testid="calc-review-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                {["Calc ID", "Category", "Activity", "Qty", "Unit", "Emission Factor", "Source", "Alloc", "CO2e (t)", "Evidence", "Status"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {CALC_LINES.map((l) => (
                <tr key={l.id} data-testid={`calc-row-${l.id}`} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 pr-3"><RefLink id={l.id} onClick={() => setSel(l)} /></td>
                  <td className="py-3 pr-3 text-slate-600">{l.category}</td>
                  <td className="py-3 pr-3 text-slate-600">{l.activity}</td>
                  <td className="py-3 pr-3 text-slate-600">{l.qty.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-slate-500">{l.unit}</td>
                  <td className="py-3 pr-3 text-slate-600">{l.ef}</td>
                  <td className="py-3 pr-3 text-slate-500">{l.efSource}</td>
                  <td className="py-3 pr-3 text-slate-500">{l.allocation}</td>
                  <td className="py-3 pr-3 font-semibold text-slate-800">{l.co2e.toFixed(2)}</td>
                  <td className="py-3 pr-3">{l.evidence !== "—" ? <RefLink id={l.evidence} onClick={() => navigate("/mrv/evidence")} /> : "—"}</td>
                  <td className="py-3 pr-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {sel && (
            <>
              <SheetHeader><SheetTitle>{sel.id} · {sel.category}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Drill-down</p>
                  <div className="mt-2 space-y-1 text-sm">
                    {[`Result: ${sel.co2e.toFixed(2)} tCO2e`, `Formula: ${sel.qty.toLocaleString()} ${sel.unit} × ${sel.ef} × ${sel.allocation}`,
                      `Emission Factor: ${sel.ef} (${sel.efSource})`, `Activity: ${sel.activity}`, `Source System: ${sel.efSource}`, `Evidence: ${sel.evidence}`]
                      .map((r, i) => <p key={i} className="flex items-center gap-2 text-slate-600"><span className="text-emerald-500">↓</span>{r}</p>)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Scope" value={sel.scope} />
                  <Field label="Allocation" value={sel.allocation} />
                  <Field label="Status" value={<StatusBadge status={sel.status} />} />
                  <Field label="Evidence" value={sel.evidence} mono />
                </div>
                {sel.comment && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">{sel.comment}</div>}
                <div className="flex flex-wrap gap-2">
                  <Button data-testid="calc-accept" onClick={() => { toast.success(`${sel.id} accepted`); setSel(null); }} disabled={!canReview} className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Accept Line</Button>
                  <Button data-testid="calc-query" onClick={() => { toast("Query raised on " + sel.id); }} disabled={!canReview} variant="outline" className="rounded-full">Raise Query</Button>
                  <Button data-testid="calc-finding" onClick={() => { raiseFinding({ classification: "Non-conformity", area: sel.category, desc: `Query on calculation line ${sel.id}.`, activity: sel.activity, calc: sel.id }); toast.success("Finding created"); setSel(null); navigate("/mrv/findings"); }} disabled={!canReview} variant="outline" className="rounded-full text-red-600">Create Finding</Button>
                  <Button data-testid="calc-view-evidence" onClick={() => navigate("/mrv/evidence")} variant="ghost" className="rounded-full text-slate-600">View Evidence</Button>
                  <Button data-testid="calc-view-activity" onClick={() => navigate(refRoute(sel.activity !== "—" ? sel.activity : "ACT-0021"))} variant="ghost" className="rounded-full text-slate-600">View Source Activity</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
