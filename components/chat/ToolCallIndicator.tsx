import { Loader2, CheckCircle2 } from "lucide-react";

const toolLabels: Record<string, string> = {
  get_profitability_report: "Profitability report",
  get_revenue_data: "Revenue data",
  get_cost_analysis: "Cost analysis",
  get_order_status: "Order status",
  get_shipment_tracking: "Shipment tracking",
  get_return_order_info: "Return order info",
  get_inventory_levels: "Inventory levels",
  get_supplier_info: "Supplier info",
  get_demand_forecast: "Demand forecast",
  run_analytics_query: "Analytics query",
  get_gst_reconciliation: "GST reconciliation",
  get_cash_flow_forecast: "Cash flow forecast",
  get_risk_insights: "Risk insights",
};

interface ToolCallIndicatorProps {
  toolName: string;
  status?: "running" | "done";
}

export function ToolCallIndicator({ toolName, status = "running" }: ToolCallIndicatorProps) {
  const label = toolLabels[toolName] ?? toolName.replace(/_/g, " ");
  const isDone = status === "done";

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border rounded-lg px-3 py-1.5 w-fit">
      {isDone ? (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      ) : (
        <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      )}
      <span>{isDone ? `Fetched ${label.toLowerCase()}` : `Fetching ${label.toLowerCase()}...`}</span>
    </div>
  );
}
