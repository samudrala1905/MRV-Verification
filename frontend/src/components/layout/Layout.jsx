import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Building2, Database, Calculator, Network, Globe2, ShieldCheck,
  BadgeCheck, Bell, ChevronDown,
} from "lucide-react";
import { useMrv } from "@/context/MrvContext";
import { ROLES } from "@/data/mockData";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Organisation", icon: Building2, to: "/organisation" },
  { label: "Data", icon: Database, to: "/data" },
  { label: "Carbon Accounting", icon: Calculator, to: "/pcf/calculation" },
  { label: "Value Chain", icon: Network, to: "/value-chain" },
  { label: "CBAM", icon: Globe2, to: "/cbam" },
  { label: "MRV & Verification", icon: ShieldCheck, to: "/mrv/readiness" },
  { label: "Carbon Passports", icon: BadgeCheck, to: "/passport" },
];

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = (to) =>
    to === "/mrv/readiness" ? pathname.startsWith("/mrv") : pathname === to;

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-slate-300">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-extrabold text-slate-900">S</div>
        <div>
          <p className="text-[15px] font-extrabold leading-tight text-white">SAURIENT</p>
          <p className="text-[11px] font-medium text-slate-400">Carbon Passport Platform</p>
        </div>
      </div>
      <p className="px-5 pb-2 pt-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">Workspace</p>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = isActive(n.to);
          return (
            <button
              key={n.label}
              data-testid={`nav-${n.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              onClick={() => navigate(n.to)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-emerald-500/15 text-emerald-400" : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {n.label}
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-[11px] text-slate-500">v2.6 · Simulated demo</div>
    </aside>
  );
}

function Topbar() {
  const { role, setRole, meta } = useMrv();
  return (
    <div className="flex items-center justify-end gap-3 border-b border-slate-200 bg-white px-6 py-3">
      <div className="mr-auto text-sm font-medium text-slate-400">Workspace Overview</div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Demo role</span>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger data-testid="role-switcher" className="h-9 w-[190px] rounded-full border-slate-200 text-sm font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r} data-testid={`role-option-${r.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold text-slate-700">{meta.facility}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
      <button data-testid="notifications-btn" className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-800">
        <Bell className="h-4 w-4" />
      </button>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-slate-900">S</div>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[hsl(210_20%_98%)]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="thin-scroll flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
