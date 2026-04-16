"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  Cpu,
  Sparkles,
  Leaf,
  ShieldCheck,
  Trash2,
  Store,
  Menu,
  X,
  Layers,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/ehs-health",
    label: "EHS Health Status",
    icon: Activity,
    color: "text-emerald-400",
    description: "Site-wide safety metrics",
  },
  {
    href: "/policy-hub",
    label: "Policy & Documentation",
    icon: FileText,
    color: "text-blue-400",
    description: "RAG-powered policy hub",
  },
  {
    href: "/ehs-management",
    label: "EHS Management",
    icon: Cpu,
    color: "text-violet-400",
    description: "Sensors & IoT monitoring",
  },
  {
    href: "/ai-recommendations",
    label: "AI Recommendations",
    icon: Sparkles,
    color: "text-yellow-400",
    description: "Intelligent safety insights",
  },
  {
    href: "/carbon-credits",
    label: "Carbon Credit Trading",
    icon: Leaf,
    color: "text-green-400",
    description: "Peer-to-peer carbon exchange",
  },
  {
    href: "/audit-compliance",
    label: "Audit & Compliance",
    icon: ShieldCheck,
    color: "text-cyan-400",
    description: "Governance & reporting",
  },
  {
    href: "/disposal-analytics",
    label: "Disposal Analytics",
    icon: Trash2,
    color: "text-orange-400",
    description: "Vendor disposal tracking",
  },
  {
    href: "/marketplace",
    label: "Marketplace",
    icon: Store,
    color: "text-pink-400",
    description: "Extensions & integrations",
  },
];

function Sidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col h-full bg-slate-950 text-slate-100 w-64 shrink-0", className)}>
      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600">
          <Layers className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-sm text-white">SAP EHS Assist</span>
          <span className="text-[10px] text-slate-400 tracking-wide uppercase">Environmental · Health · Safety</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7 text-slate-400" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Section label */}
      <div className="px-5 pt-4 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Services</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 mt-0.5", isActive ? item.color : "text-slate-500 group-hover:" + item.color.replace("text-", ""))} />
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-medium text-xs truncate">{item.label}</span>
                <span className="text-[10px] text-slate-500 truncate">{item.description}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const currentNav = navItems.find((n) => pathname.startsWith(n.href));

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <Sidebar className="relative z-10 flex" onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 md:px-6 h-14 border-b bg-white shrink-0 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 min-w-0">
            {currentNav && (
              <>
                <currentNav.icon className={cn("h-4 w-4 shrink-0", currentNav.color)} />
                <h1 className="font-semibold text-sm text-slate-800 truncate">{currentNav.label}</h1>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              VP
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
