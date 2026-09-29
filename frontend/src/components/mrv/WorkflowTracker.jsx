import React from "react";
import { Check, Circle, AlertTriangle, X } from "lucide-react";
import { WORKFLOW_STAGES } from "@/data/mockData";
import { useMrv } from "@/context/MrvContext";
import { cn } from "@/lib/utils";

const ICON = {
  complete: { Icon: Check, cls: "bg-emerald-500 text-white border-emerald-500" },
  pending: { Icon: Circle, cls: "bg-white text-slate-400 border-slate-300" },
  action: { Icon: AlertTriangle, cls: "bg-amber-100 text-amber-600 border-amber-300" },
  blocked: { Icon: X, cls: "bg-red-100 text-red-600 border-red-300" },
};

export default function WorkflowTracker({ activeTab, onNavigate }) {
  const { stageStatus } = useMrv();
  return (
    <div className="thin-scroll overflow-x-auto rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex min-w-max items-center gap-1">
        {WORKFLOW_STAGES.map((s, i) => {
          const st = stageStatus[s.key] || "pending";
          const { Icon, cls } = ICON[st];
          const isActive = s.tab === activeTab;
          return (
            <React.Fragment key={s.key}>
              <button
                data-testid={`tracker-${s.key}`}
                onClick={() => onNavigate(s.tab)}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-slate-50",
                  isActive && "bg-emerald-50"
                )}
              >
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border", cls)}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className={cn("text-[10px] font-bold uppercase tracking-wide",
                  isActive ? "text-emerald-700" : "text-slate-500 group-hover:text-slate-700")}>
                  {s.label}
                </span>
              </button>
              {i < WORKFLOW_STAGES.length - 1 && <span className="text-slate-300">→</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
