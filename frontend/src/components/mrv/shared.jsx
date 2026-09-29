import React from "react";
import { cn } from "@/lib/utils";

// ---- status / classification chip colours ----
const STYLE = {
  PASSED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COMPLETE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  VERIFIED: "bg-emerald-600 text-white border-emerald-600",
  PASS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "NO CONFLICT": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "NO CONFLICT IDENTIFIED": "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ISSUED: "bg-emerald-600 text-white border-emerald-600",
  WARNING: "bg-amber-50 text-amber-700 border-amber-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  QUERY: "bg-amber-50 text-amber-700 border-amber-200",
  "IN PROGRESS": "bg-amber-50 text-amber-700 border-amber-200",
  "IN REVIEW": "bg-sky-50 text-sky-700 border-sky-200",
  SUBMITTED: "bg-sky-50 text-sky-700 border-sky-200",
  OPEN: "bg-amber-50 text-amber-700 border-amber-200",
  PLANNED: "bg-sky-50 text-sky-700 border-sky-200",
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
  CLOSED: "bg-slate-100 text-slate-500 border-slate-200",
  FAIL: "bg-red-50 text-red-700 border-red-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  BLOCKED: "bg-red-50 text-red-700 border-red-200",
  "BLOCKING CONFLICT": "bg-red-50 text-red-700 border-red-200",
  "POTENTIAL CONFLICT": "bg-amber-50 text-amber-700 border-amber-200",
  "POTENTIAL MISSTATEMENT": "bg-red-50 text-red-700 border-red-200",
  "MATERIAL ISSUE": "bg-red-50 text-red-700 border-red-200",
  "NON-CONFORMITY": "bg-amber-50 text-amber-700 border-amber-200",
  CLARIFICATION: "bg-sky-50 text-sky-700 border-sky-200",
  OBSERVATION: "bg-slate-100 text-slate-600 border-slate-200",
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INFO: "bg-slate-100 text-slate-600 border-slate-200",
};

export function StatusBadge({ status, className }) {
  const key = String(status || "").toUpperCase();
  return (
    <span
      data-testid={`status-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        STYLE[key] || "bg-slate-100 text-slate-600 border-slate-200", className)}
    >
      {status}
    </span>
  );
}

export function Kpi({ label, value, hint, tone = "default", testid }) {
  const toneCls = {
    default: "text-slate-900",
    green: "text-emerald-600",
    amber: "text-amber-600",
    red: "text-red-600",
  }[tone];
  return (
    <div data-testid={testid} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={cn("mt-1 text-3xl font-extrabold tracking-tight", toneCls)}>{value}</p>
      {hint && <p className="mt-1 text-xs font-medium text-slate-400">{hint}</p>}
    </div>
  );
}

export function SectionCard({ title, action, children, className, testid }) {
  return (
    <div data-testid={testid} className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Field({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={cn("mt-0.5 text-sm font-semibold text-slate-800", mono && "font-mono text-[13px]")}>{value || "—"}</p>
    </div>
  );
}

// deep-link ref chip (e.g. ACT-0021 / CALC-0038 / EVD-00184)
export function RefLink({ id, onClick }) {
  return (
    <button
      type="button"
      data-testid={`reflink-${id}`}
      onClick={onClick}
      className="font-mono text-[13px] font-semibold text-emerald-700 underline decoration-dotted underline-offset-2 hover:text-emerald-800"
    >
      {id}
    </button>
  );
}
