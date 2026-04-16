import { type ReactNode } from "react";
import { Cpu, Wifi, WifiOff, AlertTriangle, Thermometer, Wind, Droplets, Zap, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sensors = [
  { id: "SNS-001", name: "Air Quality Monitor", location: "Plant A – Zone 2", type: "Air", value: "42 AQI", status: "Online", alert: false },
  { id: "SNS-002", name: "Temperature Sensor", location: "Plant B – Lab 3", type: "Temp", value: "38.4°C", status: "Alert", alert: true },
  { id: "SNS-003", name: "Gas Leak Detector", location: "Warehouse C", type: "Gas", value: "0.002 ppm", status: "Online", alert: false },
  { id: "SNS-004", name: "Noise Level Sensor", location: "Plant A – Press Room", type: "Noise", value: "92 dB", status: "Warning", alert: true },
  { id: "SNS-005", name: "Humidity Sensor", location: "Office HQ – Server Room", type: "Humidity", value: "68%", status: "Online", alert: false },
  { id: "SNS-006", name: "Vibration Monitor", location: "Plant B – Machine Line", type: "Vibration", value: "12 mm/s", status: "Offline", alert: false },
  { id: "SNS-007", name: "UV Radiation Sensor", location: "Site D – Rooftop", type: "UV", value: "7.2 UV Index", status: "Online", alert: false },
  { id: "SNS-008", name: "CO₂ Level Monitor", location: "Plant A – Chem Storage", type: "Gas", value: "1,240 ppm", status: "Alert", alert: true },
];

const iotDevices = [
  { name: "Smart Helmet Fleet", count: 42, online: 38, emoji: "⛑️", emojiLabel: "Hard hat" },
  { name: "Safety Wearables", count: 120, online: 115, emoji: "⌚", emojiLabel: "Wristwatch" },
  { name: "Emergency Beacons", count: 18, online: 18, emoji: "🔦", emojiLabel: "Flashlight" },
  { name: "CCTV Network", count: 64, online: 61, emoji: "📷", emojiLabel: "Camera" },
];

const statusStyle: Record<string, string> = {
  Online: "bg-emerald-100 text-emerald-700",
  Warning: "bg-yellow-100 text-yellow-700",
  Alert: "bg-red-100 text-red-700",
  Offline: "bg-slate-100 text-slate-500",
};

const typeIcon: Record<string, ReactNode> = {
  Air: <Wind className="h-3.5 w-3.5" aria-hidden="true" />,
  Temp: <Thermometer className="h-3.5 w-3.5" aria-hidden="true" />,
  Gas: <Zap className="h-3.5 w-3.5" aria-hidden="true" />,
  Noise: <Cpu className="h-3.5 w-3.5" aria-hidden="true" />,
  Humidity: <Droplets className="h-3.5 w-3.5" aria-hidden="true" />,
  Vibration: <Cpu className="h-3.5 w-3.5" aria-hidden="true" />,
  UV: <Zap className="h-3.5 w-3.5" aria-hidden="true" />,
};

function StatusIcon({ status }: { status: string }) {
  if (status === "Offline") return <WifiOff className="h-3 w-3 text-slate-400" aria-hidden="true" />;
  if (status === "Warning") return <Wifi className="h-3 w-3 text-yellow-400" aria-hidden="true" />;
  if (status === "Alert") return <Wifi className="h-3 w-3 text-red-400" aria-hidden="true" />;
  return <Wifi className="h-3 w-3 text-emerald-400" aria-hidden="true" />;
}

export default function EHSManagementPage() {
  const onlineCount = sensors.filter((s) => s.status === "Online").length;
  const alertCount = sensors.filter((s) => s.alert).length;

  return (
    <div className="p-6 space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sensors", value: sensors.length, sub: "Registered", color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Online", value: onlineCount, sub: "Connected", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Active Alerts", value: alertCount, sub: "Require action", color: "text-red-600", bg: "bg-red-50" },
          { label: "IoT Devices", value: "244", sub: "Fleet total", color: "text-blue-600", bg: "bg-blue-50" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex items-center justify-center h-7 w-7 rounded-full ${s.bg} mb-3`}>
                <Cpu className={`h-3.5 w-3.5 ${s.color}`} aria-hidden="true" />
              </div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              <div className="text-[10px] text-slate-400">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor table */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-violet-500" aria-hidden="true" /> Sensor Grid
              </CardTitle>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 h-7 px-2">
                <RefreshCw className="h-3 w-3" aria-hidden="true" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">IoT Sensor Grid</caption>
                <thead>
                  <tr className="border-b border-slate-100">
                    {["ID", "Name", "Location", "Reading", "Status"].map((h) => (
                      <th key={h} scope="col" className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensors.map((s) => (
                    <tr
                      key={s.id}
                      className={`border-b border-slate-50 transition-colors ${s.alert ? "bg-red-50/30 hover:bg-red-100/40" : "hover:bg-slate-50"}`}
                    >
                      <td className="py-2.5 pr-4 text-xs font-mono text-slate-400">{s.id}</td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <span className="text-slate-400">{typeIcon[s.type]}</span>
                          {s.name}
                          {s.alert && <AlertTriangle className="h-3 w-3 text-red-400" aria-label="Alert" />}
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-slate-500">{s.location}</td>
                      <td className="py-2.5 pr-4 text-xs font-mono text-slate-700">{s.value}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1">
                          <StatusIcon status={s.status} />
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusStyle[s.status] ?? "bg-slate-100 text-slate-600"}`}>{s.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* IoT Devices */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">IoT Device Fleet</CardTitle>
              <CardDescription className="text-xs">Connected wearables & smart equipment</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {iotDevices.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span role="img" aria-label={d.emojiLabel} className="text-xl">{d.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 truncate">{d.name}</span>
                      <span className="text-slate-400 flex-shrink-0">{d.online}/{d.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div
                        className="h-1.5 rounded-full bg-violet-400"
                        style={{ width: `${(d.online / d.count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-amber-50 border-amber-100">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">Action Required</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">
                    SNS-002 temperature exceeds 38°C threshold in Lab 3. Check HVAC system.
                  </p>
                  <p className="text-[11px] text-amber-600 mt-1">
                    SNS-008 CO₂ levels elevated in Chemical Storage. Increase ventilation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
