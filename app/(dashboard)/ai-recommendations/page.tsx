import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Clock, ChevronRight, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const recommendations = [
  {
    id: "REC-001",
    priority: "Critical",
    category: "Chemical Safety",
    title: "Increase ventilation frequency in Chemical Storage",
    rationale: "CO₂ levels have exceeded 1,200 ppm three times this week. Based on sensor trend analysis and ISO 45001 clause 8.1.2, immediate ventilation schedule adjustment is recommended.",
    impact: "Reduces health risk exposure by ~73%",
    effort: "Low",
    source: "Sensor SNS-008 + Policy DB",
    status: "Open",
  },
  {
    id: "REC-002",
    priority: "High",
    category: "Training",
    title: "Schedule PPE refresher training for Plant B team",
    rationale: "Incident EVT-001 in Plant B indicates knowledge gaps around chemical spill protocols. 6 team members haven't completed 2025 PPE certification.",
    impact: "Reduces incident recurrence likelihood by 58%",
    effort: "Medium",
    source: "Incident Log + HR Records",
    status: "In Review",
  },
  {
    id: "REC-003",
    priority: "Medium",
    category: "Maintenance",
    title: "Schedule HVAC maintenance for Lab 3",
    rationale: "Temperature sensor SNS-002 has logged values above threshold for 4 consecutive days. Predictive model flags 89% probability of HVAC degradation within 30 days.",
    impact: "Prevents potential equipment failure and heat-related incidents",
    effort: "Medium",
    source: "IoT Sensor Analysis",
    status: "Open",
  },
  {
    id: "REC-004",
    priority: "Medium",
    category: "Compliance",
    title: "Update Hazardous Waste Disposal SOP before audit",
    rationale: "EU Regulation 2024/1234 introduces updated requirements for hazardous waste documentation. Current SOP was last revised 14 months ago and has 3 non-compliant sections.",
    impact: "Ensures regulatory compliance before Q3 audit",
    effort: "Low",
    source: "Policy Hub RAG + Regulatory DB",
    status: "Open",
  },
  {
    id: "REC-005",
    priority: "Low",
    category: "Ergonomics",
    title: "Assess ergonomic risk at Press Room workstations",
    rationale: "Noise levels at 92 dB in Press Room are approaching OSHA limits. Combined with 3 ergonomics complaints in Q1, a formal ergonomic assessment is advised.",
    impact: "Reduces long-term musculoskeletal injury risk",
    effort: "High",
    source: "HR Complaints + Sensor Data",
    status: "Backlog",
  },
];

const priorityStyle: Record<string, { badge: string; dot: string }> = {
  Critical: { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  High: { badge: "bg-orange-100 text-orange-700", dot: "bg-orange-400" },
  Medium: { badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400" },
  Low: { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

const statusStyle: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Review": "bg-violet-100 text-violet-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Backlog: "bg-slate-100 text-slate-500",
};

const effortStyle: Record<string, string> = {
  Low: "text-emerald-600",
  Medium: "text-yellow-600",
  High: "text-red-500",
};

export default function AIRecommendationsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header insight strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Recommendations", value: "3", icon: Sparkles, color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "Critical Actions", value: "1", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
          { label: "Resolved This Month", value: "7", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Avg. Response Time", value: "2.4d", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
        ].map((m) => (
          <Card key={m.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${m.bg} mb-3`}>
                <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-800">{m.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI banner */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Brain className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-800">AI Analysis complete — 5 recommendations generated</p>
            <p className="text-xs text-violet-600 mt-0.5">
              Based on sensor data from 8 devices, 48 policy documents, 12 incident logs, and regulatory database cross-reference. Last updated 15 minutes ago.
            </p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <Button size="sm" variant="outline" className="text-xs border-violet-200 text-violet-700 hover:bg-violet-50">
              Re-run Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations list */}
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${priorityStyle[rec.priority].dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityStyle[rec.priority].badge}`}>{rec.priority}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{rec.id}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{rec.category}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusStyle[rec.status]}`}>{rec.status}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800 mt-2">{rec.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rec.rationale}</p>

                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-[11px] text-slate-600">{rec.impact}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400">Effort:</span>
                      <span className={`text-[11px] font-semibold ${effortStyle[rec.effort]}`}>{rec.effort}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-violet-400" />
                      <span className="text-[11px] text-slate-400">{rec.source}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 flex-shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
