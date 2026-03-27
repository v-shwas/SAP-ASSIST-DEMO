/**
 * SAP Client — routes Claude tool calls to either:
 *   - Mock data (USE_MOCK_SAP=true, default for dev)
 *   - Real SAP Connector microservice (USE_MOCK_SAP=false)
 */
import { executeMockTool } from "@/lib/mock-sap";

interface SapCredentials {
  baseUrl: string;
  username: string;
  password: string;
  client: string;
  connType?: "odata" | "rfc";
}

// Map Claude tool names → connector endpoint paths
const TOOL_ROUTES: Record<string, string> = {
  get_profitability_report: "/fico/profitability",
  get_revenue_data: "/fico/revenue",
  get_cost_analysis: "/fico/cost-analysis",
  get_gst_reconciliation: "/fico/gst-reconciliation",
  get_order_status: "/sd/orders",
  get_shipment_tracking: "/sd/shipments",
  get_return_order_info: "/sd/returns",
  get_inventory_levels: "/mm/inventory",
  get_supplier_info: "/mm/suppliers",
  get_demand_forecast: "/analytics/forecast",
  run_analytics_query: "/analytics/query",
};

export async function executeSapTool(
  toolName: string,
  input: Record<string, unknown>,
  credentials?: SapCredentials
): Promise<unknown> {
  const useMock = process.env.USE_MOCK_SAP !== "false";

  if (useMock) {
    return executeMockTool(toolName, input);
  }

  const route = TOOL_ROUTES[toolName];
  if (!route) {
    return { error: `No connector route for tool: ${toolName}` };
  }

  const connectorUrl = process.env.SAP_CONNECTOR_URL ?? "http://localhost:8000";
  const secret = process.env.SAP_CONNECTOR_SECRET ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Connector-Secret": secret,
  };

  if (credentials) {
    headers["X-SAP-URL"] = credentials.baseUrl;
    headers["X-SAP-USER"] = credentials.username;
    headers["X-SAP-PASS"] = credentials.password;
    headers["X-SAP-CLIENT"] = credentials.client;
    if (credentials.connType) headers["X-SAP-CONN-TYPE"] = credentials.connType;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(`${connectorUrl}${route}`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    if (!res.ok) {
      return { error: `Connector error: ${res.status} ${res.statusText}` };
    }

    return res.json();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { error: "SAP connector timed out after 10s" };
    }
    return { error: "Could not reach SAP connector service" };
  } finally {
    clearTimeout(timer);
  }
}
