import React, { useState } from "react";
import { Lock, Snowflake, AlertTriangle } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { Kpi, StatusBadge, Field, SectionCard } from "@/components/mrv/shared";
import { usePrimaryAction } from "@/components/mrv/primaryAction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const CONTENTS = [
  "Organisation snapshot", "Facility snapshot", "Product snapshot", "Batch snapshot",
  "Boundary snapshot", "Inventory snapshot", "Allocation snapshot", "Logistics snapshot",
  "Emission factors", "Calculation results", "Evidence manifest", "Audit trail",
];

export default function DataFreeze() {
  const { meta, engagement, freezeDataset } = useMrv();
  const [confirm, setConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const frozen = engagement.frozen;
  usePrimaryAction(frozen ? "Dataset Frozen" : "Freeze Dataset", () => !frozen && setConfirm(true));
  const info = engagement.freezeInfo;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi testid="kpi-freeze-status" label="Freeze Status" value={frozen ? "LOCKED" : "OPEN"} tone={frozen ? "green" : "amber"} />
        <Kpi testid="kpi-dataset-records" label="Dataset Records" value={meta.activityRecords} />
        <Kpi testid="kpi-freeze-evidence" label="Evidence Count" value={meta.evidenceItems} />
        <Kpi testid="kpi-freeze-version" label="Calculation Version" value="V1.0" />
        <Kpi testid="kpi-freeze-pcf" label="Claimed PCF" value={`${meta.claimedIntensity}`} />
      </div>

      {frozen && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <Lock className="h-6 w-6 text-emerald-600" />
          <div>
            <p className="font-extrabold text-emerald-800">VERIFICATION DATASET LOCKED</p>
            <p className="text-sm text-emerald-700">Later operational changes cannot modify this frozen snapshot.</p>
          </div>
          <StatusBadge status="DATA FROZEN" className="ml-auto" />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Freeze Package" className="lg:col-span-2" testid="freeze-package">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Freeze ID" value={info.id} mono />
            <Field label="PCF Project" value={meta.pcfProject} mono />
            <Field label="Calculation" value="V1.0" />
            <Field label="Activity Records" value={meta.activityRecords} />
            <Field label="Evidence" value={meta.evidenceItems} />
            <Field label="Boundary Version" value={info.boundaryVersion} />
            <Field label="Emission Factor Dataset" value={info.efDataset} />
            <Field label="Production Quantity" value={meta.productionQuantity} />
            <Field label="Total PCF" value={`${meta.claimedTotal} tCO2e`} />
            <Field label="Intensity" value={`${meta.claimedIntensity} kgCO2e/kg`} />
          </div>
          {frozen && (
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-4">
              <Field label="Snapshot Hash" value={info.hash} mono />
              <Field label="Freeze Timestamp" value={info.ts} />
              <Field label="Frozen By" value={info.by} />
              <Field label="Reason" value={info.reason} />
            </div>
          )}
        </SectionCard>

        <SectionCard title="Freeze Contents" testid="freeze-contents">
          <ul className="space-y-2 text-sm">
            {CONTENTS.map((c) => (
              <li key={c} className="flex items-center gap-2 text-slate-700">
                <span className={`h-2 w-2 rounded-full ${frozen ? "bg-emerald-500" : "bg-slate-300"}`} />{c}
              </li>
            ))}
          </ul>
          {!frozen && (
            <Button data-testid="freeze-btn" onClick={() => setConfirm(true)} className="mt-4 w-full rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">
              <Snowflake className="mr-2 h-4 w-4" /> Freeze Verification Dataset
            </Button>
          )}
        </SectionCard>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
        <div className="text-sm text-amber-800">
          <p className="font-bold">If source data changes: SOURCE DATA CHANGED</p>
          <p>A NEW CALCULATION VERSION is required and RE-VERIFICATION may be triggered. The frozen snapshot always remains unchanged.</p>
        </div>
      </div>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Freeze Verification Dataset</DialogTitle></DialogHeader>
          <p className="text-sm text-slate-600">You are creating an immutable verification snapshot for <span className="font-mono font-semibold">{meta.pcfProject}</span> Calculation <span className="font-semibold">V1.0</span>.</p>
          <div className="mt-2"><Label>Reason</Label><Textarea data-testid="freeze-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for freeze…" className="mt-1" /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)} className="rounded-full">Cancel</Button>
            <Button data-testid="freeze-confirm" onClick={() => { freezeDataset(reason); toast.success("Verification dataset frozen"); setConfirm(false); }} className="rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">Freeze Dataset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
