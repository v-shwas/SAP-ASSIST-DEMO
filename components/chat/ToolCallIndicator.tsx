import { Loader2 } from "lucide-react";

const toolLabels: Record<string, string> = {
  get_profitability_report: "Fetching profitability report",
  get_revenue_data: "Fetching revenue data",
  get_cost_analysis: "Fetching cost analysis",
  get_order_status: "Fetching order status",
  get_shipment_tracking: "Fetching shipment tracking",
  get_return_order_info: "Fetching return order info",
  get_inventory_levels: "Fetching inventory levels",
  get_supplier_info: "Fetching supplier info",
  get_demand_forecast: "Fetching demand forecast",
  run_analytics_query: "Running analytics query",
  get_gst_reconciliation: "Fetching GST reconciliation",
};

interface ToolCallIndicatorProps {
  toolName: string;
}

export function ToolCallIndicator({ toolName }: ToolCallIndicatorProps) {
  const label = toolLabels[toolName] ?? `Calling ${toolName}`;

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border rounded-lg px-3 py-2 w-fit">
      <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      <span>{label}…</span>
    </div>
  );
}
