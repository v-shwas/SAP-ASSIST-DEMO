"use client";

import { useState } from "react";
import { Store, Search, Star, Download, ExternalLink, Filter, Zap, Shield, BarChart2, Globe, Plug, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = ["All", "Analytics", "Compliance", "IoT", "Reporting", "Integrations", "AI/ML"];

const extensions = [
  {
    id: "EXT-001",
    name: "SAP S/4HANA Connector",
    vendor: "SAP SE",
    category: "Integrations",
    description: "Deep integration with S/4HANA for real-time EHS data synchronization and process automation.",
    rating: 4.8,
    reviews: 312,
    installs: "10K+",
    price: "Included",
    icon: "🔗",
    installed: true,
    tags: ["ERP", "Real-time", "Official"],
  },
  {
    id: "EXT-002",
    name: "Advanced Analytics Suite",
    vendor: "DataViz Pro",
    category: "Analytics",
    description: "50+ pre-built EHS dashboards with predictive analytics and drill-down capabilities.",
    rating: 4.6,
    reviews: 187,
    installs: "5K+",
    price: "€49/mo",
    icon: "📊",
    installed: false,
    tags: ["Dashboards", "Predictive"],
  },
  {
    id: "EXT-003",
    name: "Chemical Regulatory DB",
    vendor: "ChemSafe Ltd",
    category: "Compliance",
    description: "Access to 150,000+ chemical safety data sheets with automatic REACH/GHS compliance checks.",
    rating: 4.7,
    reviews: 98,
    installs: "2K+",
    price: "€99/mo",
    icon: "⚗️",
    installed: false,
    tags: ["REACH", "GHS", "SDS"],
  },
  {
    id: "EXT-004",
    name: "IoT Bridge – Siemens MindSphere",
    vendor: "Siemens",
    category: "IoT",
    description: "Connect Siemens industrial IoT sensors directly to EHS dashboards with real-time alerting.",
    rating: 4.5,
    reviews: 64,
    installs: "1K+",
    price: "€79/mo",
    icon: "🔌",
    installed: true,
    tags: ["IoT", "Industrial", "Real-time"],
  },
  {
    id: "EXT-005",
    name: "Incident Report Generator",
    vendor: "FormFlow Inc.",
    category: "Reporting",
    description: "AI-powered incident reporting with automatic regulatory submission for OSHA, EU OSH Directive.",
    rating: 4.9,
    reviews: 241,
    installs: "8K+",
    price: "€29/mo",
    icon: "📋",
    installed: false,
    tags: ["OSHA", "Automation", "AI"],
  },
  {
    id: "EXT-006",
    name: "Climate Risk Intelligence",
    vendor: "ClimateGuard AI",
    category: "AI/ML",
    description: "Physical climate risk scoring for facilities using satellite data and AI climate models.",
    rating: 4.3,
    reviews: 45,
    installs: "500+",
    price: "€149/mo",
    icon: "🌍",
    installed: false,
    tags: ["Climate", "AI", "Risk"],
  },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = extensions.filter((e) => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-violet-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Store className="h-5 w-5" />
          <h2 className="text-base font-bold">EHS Marketplace</h2>
        </div>
        <p className="text-sm text-pink-100 mb-4">Extend your platform with integrations, analytics tools, and AI capabilities.</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm bg-white/20 border border-white/30 rounded-lg placeholder-white/60 text-white focus:outline-none focus:bg-white/30"
            placeholder="Search extensions, integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Extensions Available", value: "120+", icon: Plug, color: "text-pink-500", bg: "bg-pink-50" },
          { label: "Installed", value: "2", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Categories", value: "7", icon: Filter, color: "text-violet-500", bg: "bg-violet-50" },
          { label: "Verified Vendors", value: "48", icon: Shield, color: "text-blue-500", bg: "bg-blue-50" },
        ].map((m) => (
          <Card key={m.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${m.bg} mb-2`}>
                <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
              </div>
              <div className="text-xl font-bold text-slate-800">{m.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-pink-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Extensions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ext) => (
          <Card key={ext.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                  {ext.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">{ext.name}</p>
                    {ext.installed && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">Installed</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{ext.vendor}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-3">{ext.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {ext.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-slate-700">{ext.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">({ext.reviews})</span>
                  <span className="text-[10px] text-slate-400">·</span>
                  <Download className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400">{ext.installs}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">{ext.price}</span>
                  {ext.installed ? (
                    <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 text-slate-500">
                      <ExternalLink className="h-2.5 w-2.5 mr-1" /> Open
                    </Button>
                  ) : (
                    <Button size="sm" className="text-[10px] h-6 px-2 bg-pink-600 hover:bg-pink-700 text-white">
                      Install
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
