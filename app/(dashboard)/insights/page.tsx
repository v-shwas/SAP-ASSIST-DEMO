import { BarChart2 } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <BarChart2 className="h-12 w-12 mb-4 opacity-30" />
      <p className="text-lg font-medium">Insights coming soon</p>
      <p className="text-sm mt-1">Analytics dashboards will appear here.</p>
    </div>
  );
}
