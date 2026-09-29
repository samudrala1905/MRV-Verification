import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ExternalLink } from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { StatusBadge, Field, SectionCard, RefLink } from "@/components/mrv/shared";
import { CALC_LINES } from "@/data/mockData";
import { Button } from "@/components/ui/button";

function Shell({ crumb, title, subtitle, children }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <button onClick={() => navigate(-1)} className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" /> Back</button>
        <p className="text-sm font-semibold text-slate-400">{crumb}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-5 p-6">{children}</div>
    </div>
  );
}

function BackToMrv() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 text-sm text-emerald-800"><ShieldCheck className="h-5 w-5" /> This record is under independent verification (VER-026).</div>
      <Button data-testid="back-to-mrv" onClick={() => navigate("/mrv/readiness")} variant="outline" className="rounded-full">Return to MRV <ExternalLink className="ml-1 h-3.5 w-3.5" /></Button>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { meta, engagement } = useMrv();
  return (
    <Shell crumb="Home" title="Workspace Overview" subtitle="Saurient Carbon Passport Platform — simulated demo">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["Active PCF Projects", "1"], ["Verification Engagements", "1"], ["Engagement Status", engagement.status], ["Carbon Passports", engagement.passportIssued ? "1" : "0"]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{l}</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{v}</p></div>
        ))}
      </div>
      <SectionCard title="Current Engagement">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Organisation" value={meta.organisation} />
          <Field label="Facility" value={meta.facility} />
          <Field label="Product" value={meta.product} />
          <Field label="PCF Project" value={meta.pcfProject} mono />
        </div>
        <Button data-testid="home-open-mrv" onClick={() => navigate("/mrv/readiness")} className="mt-4 rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">Open MRV &amp; Independent Verification</Button>
      </SectionCard>
    </Shell>
  );
}

export function Organisation() {
  const { meta } = useMrv();
  return (
    <Shell crumb="Organisation" title={meta.organisation} subtitle="Organisation & facility master data">
      <BackToMrv />
      <SectionCard title="Organisation Identity">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Legal Name" value={meta.organisation} />
          <Field label="Country" value={meta.country} />
          <Field label="Facility" value={meta.facility} />
          <Field label="Reporting Period" value={meta.reportingPeriod} />
          <Field label="Registration" value="GH-COOP-2019-0442" mono />
          <Field label="Status" value={<StatusBadge status="ACTIVE" />} />
        </div>
      </SectionCard>
    </Shell>
  );
}

export function DataPage() {
  const { meta } = useMrv();
  return (
    <Shell crumb="Data" title="Data Sources" subtitle="Connected source systems feeding the PCF calculation">
      <BackToMrv />
      <SectionCard title="Source Systems">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[["Schneider PAS800", "Meter Data"], ["SAP ERP", "Material & Production"], ["ECG Utility Portal", "Electricity"], ["Fuel Register", "Diesel"], ["TMS", "Logistics"], ["Supplier Portal", "Supplier Data"]].map(([s, t]) => (
            <div key={s} className="rounded-xl border border-slate-200 p-4"><p className="font-bold text-slate-800">{s}</p><p className="text-xs text-slate-500">{t}</p></div>
          ))}
        </div>
      </SectionCard>
    </Shell>
  );
}

export function PcfInventory() {
  const [sp] = useSearchParams();
  const rec = sp.get("rec");
  const { meta } = useMrv();
  const navigate = useNavigate();
  return (
    <Shell crumb="Carbon Accounting / PCF / Inventory" title="Activity Inventory" subtitle={`${meta.pcfProject} · V1.0`}>
      <BackToMrv />
      {rec && <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Deep-linked to activity record <span className="font-mono">{rec}</span></div>}
      <SectionCard title="Activity Records (sample)">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100 text-left text-xs font-bold uppercase text-slate-400">{["Activity", "Description", "Qty", "Unit", "Calc"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}</tr></thead>
          <tbody>
            {CALC_LINES.map((l) => (
              <tr key={l.id} className={`border-b border-slate-50 ${rec === l.evidence ? "bg-emerald-50" : ""}`}>
                <td className="py-3 pr-3 font-mono text-xs font-semibold text-emerald-700">ACT-{l.id.slice(-4)}</td>
                <td className="py-3 pr-3 text-slate-600">{l.activity}</td>
                <td className="py-3 pr-3 text-slate-600">{l.qty.toLocaleString()}</td>
                <td className="py-3 pr-3 text-slate-500">{l.unit}</td>
                <td className="py-3 pr-3"><RefLink id={l.id} onClick={() => navigate("/pcf/calculation?rec=" + l.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </Shell>
  );
}

export function PcfCalculation() {
  const [sp] = useSearchParams();
  const rec = sp.get("rec");
  const { meta } = useMrv();
  return (
    <Shell crumb="Carbon Accounting / PCF / Calculation" title="PCF Calculation" subtitle={`${meta.pcfProject} · V1.0 · ${meta.claimedTotal} tCO2e`}>
      <BackToMrv />
      {rec && <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Deep-linked to calculation line <span className="font-mono">{rec}</span></div>}
      <SectionCard title="Calculation Lines">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100 text-left text-xs font-bold uppercase text-slate-400">{["Calc", "Category", "Qty", "EF", "CO2e (t)"].map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}</tr></thead>
          <tbody>
            {CALC_LINES.map((l) => (
              <tr key={l.id} className={`border-b border-slate-50 ${rec === l.id ? "bg-emerald-50" : ""}`}>
                <td className="py-3 pr-3 font-mono text-xs font-semibold text-emerald-700">{l.id}</td>
                <td className="py-3 pr-3 text-slate-600">{l.category}</td>
                <td className="py-3 pr-3 text-slate-600">{l.qty.toLocaleString()} {l.unit}</td>
                <td className="py-3 pr-3 text-slate-500">{l.ef}</td>
                <td className="py-3 pr-3 font-semibold text-slate-800">{l.co2e.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </Shell>
  );
}

function SimplePcf({ crumb, title }) {
  const { meta } = useMrv();
  return (
    <Shell crumb={crumb} title={title} subtitle={`${meta.pcfProject} · V1.0`}>
      <BackToMrv />
      <SectionCard title={title}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Product" value={meta.product} />
          <Field label="Functional Unit" value="1 kg refined cocoa butter" />
          <Field label="Boundary" value={meta.boundary} />
          <Field label="Declared Unit" value="kg" />
          <Field label="Production Quantity" value={meta.productionQuantity} />
          <Field label="Methodology" value="ISO 14067" />
        </div>
      </SectionCard>
    </Shell>
  );
}
export const PcfOutput = () => <SimplePcf crumb="Carbon Accounting / PCF / Output Definition" title="Output Definition" />;
export const PcfBoundary = () => <SimplePcf crumb="Carbon Accounting / PCF / Boundary" title="System Boundary" />;
export const PcfAllocation = () => <SimplePcf crumb="Carbon Accounting / PCF / Allocation" title="Allocation" />;
export const PcfLogistics = () => <SimplePcf crumb="Carbon Accounting / PCF / Logistics" title="Logistics" />;

export function PcfReport() {
  const { meta, engagement, verifiedIntensity, verifiedTotal, finalVersion } = useMrv();
  return (
    <Shell crumb="Carbon Accounting / PCF / Report" title="PCF Report" subtitle={meta.pcfProject}>
      <BackToMrv />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Claimed PCF</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{meta.claimedIntensity} kg</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Verification Status</p><p className="mt-1"><StatusBadge status={engagement.released ? "VERIFIED" : engagement.status} /></p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Verified PCF</p><p className="mt-1 text-2xl font-extrabold text-emerald-600">{engagement.released ? `${verifiedIntensity} kg` : "—"}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Final Version</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{engagement.released ? finalVersion : "V1.0"}</p></div>
      </div>
      {engagement.released && (
        <SectionCard title="Verified Result (from MRV VER-026)">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Verified Total" value={`${verifiedTotal} tCO2e`} />
            <Field label="Verification Engagement" value="VER-026" mono />
            <Field label="Verifier" value={meta.verifierOrg} />
            <Field label="Reference" value="VER-026/2026" mono />
          </div>
        </SectionCard>
      )}
    </Shell>
  );
}

export function ValueChain() { return <Shell crumb="Value Chain" title="Value Chain" subtitle="Supplier & upstream mapping"><SectionCard title="Value Chain"><p className="text-sm text-slate-500">Simulated module — not part of the MRV scope.</p></SectionCard></Shell>; }
export function Cbam() { return <Shell crumb="CBAM" title="CBAM" subtitle="Carbon Border Adjustment reporting"><SectionCard title="CBAM"><p className="text-sm text-slate-500">Simulated module — not part of the MRV scope.</p></SectionCard></Shell>; }

export function CarbonPassport() {
  const navigate = useNavigate();
  const { meta, engagement, verifiedIntensity, verifiedTotal, finalVersion, issuePassport } = useMrv();
  const steps = ["DRAFT", "VERIFIED DATA ATTACHED", "READY FOR ISSUANCE", "ISSUED", "ACTIVE"];
  const idx = engagement.passportIssued ? 3 : engagement.released ? 1 : 0;
  return (
    <Shell crumb="Carbon Passports" title="Carbon Passports" subtitle="Only accepted verified results feed passport issuance">
      {!engagement.released ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <b>Passport locked.</b> The PCF is not yet verified. Complete the MRV workflow and release the verified result to unlock passport issuance.
          <div className="mt-3"><Button data-testid="passport-goto-mrv" onClick={() => navigate("/mrv/report")} variant="outline" className="rounded-full">Go to MRV Report</Button></div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${i <= idx ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>{s}</span>
                {i < steps.length - 1 && <span className="text-slate-300">→</span>}
              </React.Fragment>
            ))}
          </div>
          <SectionCard title="Passport — Refined Cocoa Butter (CB-2026-001)">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <Field label="Organisation" value={meta.organisation} />
              <Field label="Facility" value={meta.facility} />
              <Field label="Product" value={meta.product} />
              <Field label="Batch" value={meta.batch} mono />
              <Field label="Production Quantity" value={meta.productionQuantity} />
              <Field label="Declared Unit" value="kg" />
              <Field label="Verified PCF" value={`${verifiedIntensity} kgCO2e/kg`} />
              <Field label="Verified Total" value={`${verifiedTotal} tCO2e`} />
              <Field label="Boundary" value={meta.boundary} />
              <Field label="Methodology" value="ISO 14067" />
              <Field label="Calculation Reference" value={finalVersion} />
              <Field label="Verification Reference" value="VER-026/2026" mono />
              <Field label="Verification Organisation" value={meta.verifierOrg} />
              <Field label="Verification Date" value={new Date().toISOString().slice(0, 10)} />
              <Field label="Audit Reference" value="Evidence manifest · 186 items" />
              <Field label="Status" value={<StatusBadge status={engagement.passportStatus} />} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button data-testid="passport-create" onClick={() => { issuePassport(); }} disabled={engagement.passportIssued} className="rounded-full bg-emerald-500 font-bold text-slate-900 hover:bg-emerald-600 hover:text-white">
                {engagement.passportIssued ? "Passport Issued" : "Create Passport"}
              </Button>
            </div>
          </SectionCard>
          {engagement.passportIssued && (
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white p-2">
                <div className="grid grid-cols-5 gap-0.5">{Array.from({ length: 25 }).map((_, i) => <span key={i} className={`h-2.5 w-2.5 ${[0,1,2,4,5,7,9,10,12,14,16,18,20,21,24].includes(i) ? "bg-slate-900" : "bg-transparent"}`} />)}</div>
              </div>
              <div>
                <p className="font-extrabold text-emerald-800">Public Verification (QR)</p>
                <p className="text-sm text-emerald-700">Scan to view the public verified carbon result. Working papers remain confidential.</p>
                <p className="mt-1 font-mono text-xs text-emerald-600">saurient.example/verify/VER-026</p>
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}
