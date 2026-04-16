import { Activity, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Users, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const metrics = [
  { label: "Total Incidents (MTD)", value: "3", delta: "-2 vs last month", trend: "down", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  { label: "Near Misses", value: "11", delta: "+1 vs last month", trend: "up", icon: Activity, color: "text-yellow-500", bg: "bg-yellow-50" },
  { label: "Days Without Incident", value: "28", delta: "Site A record", trend: "up", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Workers at Risk", value: "4", delta: "Immediate action", trend: "neutral", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
];

const sites = [
  { name: "Plant A – Hamburg", status: "Healthy", incidents: 0, riskLevel: "Low", lastAudit: "3 days ago" },
  { name: "Plant B – Munich", status: "Warning", incidents: 2, riskLevel: "Medium", lastAudit: "1 week ago" },
  { name: "Warehouse C – Berlin", status: "Critical", incidents: 1, riskLevel: "High", lastAudit: "2 weeks ago" },
  { name: "Office HQ – Frankfurt", status: "Healthy", incidents: 0, riskLevel: "Low", lastAudit: "Yesterday" },
  { name: "Site D – Stuttgart", status: "Healthy", incidents: 0, riskLevel: "Low", lastAudit: "5 days ago" },
];

const recentEvents = [
  { id: "EVT-001", type: "Incident", description: "Chemical spill in Lab 3", site: "Plant B", severity: "High", time: "2h ago" },
  { id: "EVT-002", type: "Near Miss", description: "Forklift proximity alert", site: "Warehouse C", severity: "Medium", time: "5h ago" },
  { id: "EVT-003", type: "Inspection", description: "Fire exit inspection passed", site: "Office HQ", severity: "Info", time: "Yesterday" },
  { id: "EVT-004", type: "Training", description: "PPE compliance training completed", site: "Plant A", severity: "Info", time: "2 days ago" },
];

const statusColor: Record<string, string> = {
  Healthy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Critical: "bg-red-100 text-red-700 border-red-200",
};

const severityColor: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Info: "bg-blue-100 text-blue-700",
};

export default function EHSHealthPage() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-medium">{m.label}</span>
                <div className={`h-7 w-7 rounded-full ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800">{m.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {m.trend === "down" && <TrendingDown className="h-3 w-3 text-emerald-500" />}
                {m.trend === "up" && <TrendingUp className="h-3 w-3 text-red-400" />}
                <span className="text-[11px] text-slate-400">{m.delta}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Site Status */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-500" /> Site Health Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {sites.map((site) => (
                <div key={site.name} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${site.status === "Healthy" ? "bg-emerald-400" : site.status === "Warning" ? "bg-yellow-400" : "bg-red-400"}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{site.name}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> Last audit: {site.lastAudit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-500">{site.incidents} incident{site.incidents !== 1 ? "s" : ""}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[site.status]}`}>
                      {site.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Gauge */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Overall Risk Score</CardTitle>
            <CardDescription className="text-xs">Composite EHS index</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-8 border-yellow-400 bg-yellow-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">64</div>
                <div className="text-[10px] text-yellow-500 font-medium">MODERATE</div>
              </div>
            </div>
            <div className="w-full space-y-2">
              {[
                { label: "Air Quality", score: 88, color: "bg-emerald-400" },
                { label: "Fire Safety", score: 72, color: "bg-yellow-400" },
                { label: "Chemical Handling", score: 51, color: "bg-orange-400" },
                { label: "Ergonomics", score: 90, color: "bg-emerald-400" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>{r.label}</span><span>{r.score}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className={`h-1.5 rounded-full ${r.color}`} style={{ width: `${r.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["ID", "Type", "Description", "Site", "Severity", "Time"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((ev) => (
                  <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 pr-4 text-xs font-mono text-slate-500">{ev.id}</td>
                    <td className="py-2.5 pr-4 text-xs text-slate-700">{ev.type}</td>
                    <td className="py-2.5 pr-4 text-xs text-slate-600">{ev.description}</td>
                    <td className="py-2.5 pr-4 text-xs text-slate-500">{ev.site}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${severityColor[ev.severity]}`}>{ev.severity}</span>
                    </td>
                    <td className="py-2.5 text-xs text-slate-400">{ev.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
