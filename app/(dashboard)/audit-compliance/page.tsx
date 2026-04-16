import { ShieldCheck, Calendar, AlertTriangle, CheckCircle, Clock, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const complianceAreas = [
  { label: "ISO 45001", score: 91, status: "Compliant", lastAudit: "Feb 2025" },
  { label: "ISO 14001", score: 78, status: "Minor Gap", lastAudit: "Jan 2025" },
  { label: "OSHA 1910", score: 95, status: "Compliant", lastAudit: "Mar 2025" },
  { label: "EU REACH", score: 65, status: "Action Required", lastAudit: "Nov 2024" },
  { label: "GHS/CLP", score: 83, status: "Compliant", lastAudit: "Feb 2025" },
];

const audits = [
  { name: "Q2 External EHS Audit", auditor: "TÜV Rheinland", date: "Jun 5, 2025", type: "External", status: "Scheduled" },
  { name: "ISO 14001 Surveillance", auditor: "DNV GL", date: "May 22, 2025", type: "Certification", status: "Scheduled" },
  { name: "Internal Safety Walkthrough – Plant A", auditor: "Internal EHS Team", date: "Apr 28, 2025", type: "Internal", status: "Upcoming" },
  { name: "Waste Disposal Compliance Check", auditor: "Regulatory Body", date: "Apr 14, 2025", type: "Regulatory", status: "Completed" },
];

const findings = [
  { id: "FND-012", description: "EU REACH documentation missing for 3 chemical substances", severity: "Major", status: "Open", due: "Apr 30, 2025" },
  { id: "FND-011", description: "ISO 14001 environmental aspect register not updated in 12 months", severity: "Minor", status: "In Progress", due: "May 15, 2025" },
  { id: "FND-010", description: "Emergency drill not conducted in Warehouse C for 6 months", severity: "Major", status: "Open", due: "Apr 20, 2025" },
  { id: "FND-009", description: "PPE inspection records incomplete for Q1 2025", severity: "Minor", status: "Closed", due: "Mar 31, 2025" },
];

const statusStyle: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Upcoming: "bg-yellow-100 text-yellow-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const findingStatusStyle: Record<string, string> = {
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Closed: "bg-emerald-100 text-emerald-700",
};

const severityStyle: Record<string, string> = {
  Major: "text-red-600 font-semibold",
  Minor: "text-yellow-600 font-semibold",
};

const complianceStatus: Record<string, string> = {
  Compliant: "text-emerald-600",
  "Minor Gap": "text-yellow-600",
  "Action Required": "text-red-600",
};

const complianceBar: Record<string, string> = {
  Compliant: "bg-emerald-400",
  "Minor Gap": "bg-yellow-400",
  "Action Required": "bg-red-400",
};

export default function AuditCompliancePage() {
  const overallScore =
    complianceAreas.length > 0
      ? Math.round(complianceAreas.reduce((s, c) => s + c.score, 0) / complianceAreas.length)
      : 0;

  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Compliance", value: `${overallScore}%`, icon: ShieldCheck, color: "text-cyan-600", bg: "bg-cyan-50" },
          { label: "Open Findings", value: "3", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
          { label: "Upcoming Audits", value: "3", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Closed This Month", value: "5", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
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
        {/* Compliance scorecard */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-500" aria-hidden="true" /> Compliance Scorecard
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {complianceAreas.map((area) => (
              <div key={area.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700">{area.label}</span>
                  <span className={`text-xs ${complianceStatus[area.status] ?? "text-slate-600"}`}>{area.score}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full mb-0.5">
                  <div
                    className={`h-1.5 rounded-full ${complianceBar[area.status] ?? "bg-slate-400"}`}
                    style={{ width: `${area.score}%` }}
                  />
                </div>
                <div className="flex justify-between">
                  <span className={`text-[10px] ${complianceStatus[area.status] ?? "text-slate-600"}`}>{area.status}</span>
                  <span className="text-[10px] text-slate-400">Last: {area.lastAudit}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audit schedule */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" aria-hidden="true" /> Audit Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {audits.map((audit) => (
              <div key={audit.name} className="p-2.5 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <p className="text-xs font-medium text-slate-700 truncate">{audit.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${statusStyle[audit.status] ?? "bg-slate-100 text-slate-600"}`}>{audit.status}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock className="h-2.5 w-2.5" aria-hidden="true" /> {audit.date}
                  <span className="text-slate-300">·</span>
                  {audit.auditor}
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full text-xs mt-1">+ Schedule Audit</Button>
          </CardContent>
        </Card>

        {/* Findings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-400" aria-hidden="true" /> Non-Conformances
            </CardTitle>
            <CardDescription className="text-xs">Audit findings and CAPA tracking</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {findings.map((f) => (
              <div key={f.id} className={`p-2.5 border rounded-lg ${f.status === "Open" ? "border-red-100 bg-red-50/30" : "border-slate-100"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400">{f.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${findingStatusStyle[f.status] ?? "bg-slate-100 text-slate-600"}`}>{f.status}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[10px] ${severityStyle[f.severity] ?? "text-slate-600"}`}>{f.severity}</span>
                  <span className="text-[10px] text-slate-400">Due: {f.due}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
