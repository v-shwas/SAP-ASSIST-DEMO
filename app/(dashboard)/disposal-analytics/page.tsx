import { Trash2, Truck, Building2, CheckCircle, AlertTriangle, Clock, Package, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const vendors = [
  { id: "VND-001", name: "EcoDispose GmbH", type: "Hazardous Waste", status: "Certified", lastPickup: "Apr 12, 2025", compliance: 98 },
  { id: "VND-002", name: "CleanRoute AG", type: "Electronic Waste", status: "Certified", lastPickup: "Apr 8, 2025", compliance: 94 },
  { id: "VND-003", name: "BioWaste Partners", type: "Biological Waste", status: "Under Review", lastPickup: "Mar 20, 2025", compliance: 71 },
  { id: "VND-004", name: "MetalRecycle Co.", type: "Metal Scrap", status: "Certified", lastPickup: "Apr 15, 2025", compliance: 99 },
];

const disposalRequests = [
  { id: "DSP-0041", material: "Chlorinated Solvents", qty: "240 L", site: "Plant A", vendor: "EcoDispose GmbH", status: "Scheduled", date: "Apr 22, 2025", owner: "M. Hoffmann" },
  { id: "DSP-0040", material: "Old Server Equipment", qty: "18 units", site: "Office HQ", vendor: "CleanRoute AG", status: "In Transit", date: "Apr 16, 2025", owner: "T. Bauer" },
  { id: "DSP-0039", material: "Battery Packs", qty: "85 kg", site: "Warehouse C", vendor: "MetalRecycle Co.", status: "Completed", date: "Apr 14, 2025", owner: "K. Weber" },
  { id: "DSP-0038", material: "Lab Biological Waste", qty: "30 L", site: "Plant B", vendor: "BioWaste Partners", status: "Pending Approval", date: "Apr 18, 2025", owner: "L. Fischer" },
  { id: "DSP-0037", material: "Contaminated PPE", qty: "120 items", site: "Plant A", vendor: "EcoDispose GmbH", status: "Completed", date: "Apr 10, 2025", owner: "M. Hoffmann" },
];

const materialVolumes = [
  { label: "Hazardous Chemicals", volume: 1_240, unit: "L", color: "bg-red-400" },
  { label: "Electronic Waste", volume: 340, unit: "units", color: "bg-blue-400" },
  { label: "Metal Scrap", volume: 2_800, unit: "kg", color: "bg-slate-400" },
  { label: "Biological Waste", volume: 180, unit: "L", color: "bg-green-400" },
  { label: "Mixed Waste", volume: 650, unit: "kg", color: "bg-orange-400" },
];
const maxVolume = Math.max(...materialVolumes.map((m) => m.volume));

const vendorStatusStyle: Record<string, string> = {
  Certified: "bg-emerald-100 text-emerald-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Suspended: "bg-red-100 text-red-700",
};

const requestStatusStyle: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  "In Transit": "bg-violet-100 text-violet-700",
  Completed: "bg-emerald-100 text-emerald-700",
  "Pending Approval": "bg-yellow-100 text-yellow-700",
};

export default function DisposalAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Vendors", value: "4", icon: Building2, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Pending Requests", value: "2", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "In Transit", value: "1", icon: Truck, color: "text-violet-500", bg: "bg-violet-50" },
          { label: "Completed (MTD)", value: "9", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((m) => (
          <Card key={m.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${m.bg} mb-3`}>
                <m.icon className={`h-3.5 w-3.5 ${m.color}`} aria-hidden="true" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{m.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disposal requests */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-500" aria-hidden="true" /> Disposal Requests
              </CardTitle>
              <Button size="sm" className="text-xs bg-orange-600 hover:bg-orange-700 text-white">+ New Request</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Disposal Requests</caption>
              <thead>
                <tr className="border-b border-slate-100">
                  {["ID", "Material", "Qty", "Site", "Vendor", "Owner", "Date", "Status"].map((h) => (
                    <th key={h} scope="col" className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-2 pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disposalRequests.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 pr-3 text-[11px] font-mono text-slate-400">{r.id}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-700">{r.material}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-500 whitespace-nowrap">{r.qty}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-500">{r.site}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-500">{r.vendor}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-500">{r.owner}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-400 whitespace-nowrap">{r.date}</td>
                    <td className="py-2.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${requestStatusStyle[r.status] ?? "bg-slate-100 text-slate-600"}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Vendor panel */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" aria-hidden="true" /> Vendor Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {vendors.map((v) => (
                <div key={v.id} className="p-2.5 border border-slate-100 rounded-lg hover:border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-slate-700">{v.name}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${vendorStatusStyle[v.status] ?? "bg-slate-100 text-slate-600"}`}>{v.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-1.5">{v.type}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 mb-0.5">Compliance: {v.compliance}%</div>
                      <div className="h-1 w-20 bg-slate-100 rounded-full">
                        <div className={`h-1 rounded-full ${v.compliance >= 90 ? "bg-emerald-400" : "bg-yellow-400"}`} style={{ width: `${v.compliance}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">Last: {v.lastPickup}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Volume chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-slate-500" aria-hidden="true" /> Waste Volume (YTD)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {materialVolumes.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>{m.label}</span><span>{m.volume.toLocaleString()} {m.unit}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${(m.volume / maxVolume) * 100}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
