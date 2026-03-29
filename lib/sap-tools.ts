import type Anthropic from "@anthropic-ai/sdk";

export const SAP_TOOLS: Anthropic.Tool[] = [
  {
    name: "get_profitability_report",
    description:
      "Retrieves order profitability data from SAP CO-PA including revenue, cost, and margin by product, customer, or region.",
    input_schema: {
      type: "object" as const,
      properties: {
        period: {
          type: "string",
          description: "Period in YYYY-QN or YYYY-MM format, e.g. '2024-Q1' or '2024-01'",
        },
        dimension: {
          type: "string",
          enum: ["product", "customer", "region", "plant"],
          description: "Grouping dimension for the report",
        },
        top_n: {
          type: "number",
          description: "Return top N results (default 10)",
        },
      },
      required: [],
    },
  },
  {
    name: "get_revenue_data",
    description:
      "Retrieves revenue data from SAP SD, broken down by period, region, or product line with YoY comparison.",
    input_schema: {
      type: "object" as const,
      properties: {
        period: { type: "string", description: "Period e.g. '2024-Q1', '2024-01', or 'YTD'" },
        region: { type: "string", description: "Region filter, e.g. 'North', 'South', 'All'" },
        granularity: {
          type: "string",
          enum: ["monthly", "quarterly", "yearly"],
          description: "Time granularity",
        },
      },
      required: [],
    },
  },
  {
    name: "get_cost_analysis",
    description: "Fetches cost center and cost element analysis from SAP CO, including variances.",
    input_schema: {
      type: "object" as const,
      properties: {
        cost_center: { type: "string", description: "Cost center ID or 'All'" },
        period: { type: "string", description: "Period in YYYY-QN or YYYY-MM" },
      },
      required: [],
    },
  },
  {
    name: "get_order_status",
    description:
      "Gets current status of sales orders from SAP SD, including delivery and billing status.",
    input_schema: {
      type: "object" as const,
      properties: {
        order_id: { type: "string", description: "Specific order ID, or omit for recent orders" },
        status_filter: {
          type: "string",
          enum: ["open", "delivered", "billed", "all"],
          description: "Filter by order status",
        },
        limit: { type: "number", description: "Number of orders to return (default 20)" },
      },
      required: [],
    },
  },
  {
    name: "get_shipment_tracking",
    description: "Tracks outbound deliveries and shipments from SAP LE/WM.",
    input_schema: {
      type: "object" as const,
      properties: {
        delivery_id: { type: "string", description: "Specific delivery ID" },
        date_range: { type: "string", description: "Date range e.g. 'last_7_days', 'last_30_days'" },
      },
      required: [],
    },
  },
  {
    name: "get_return_order_info",
    description: "Retrieves return order (RMA) data from SAP SD including reason codes and status.",
    input_schema: {
      type: "object" as const,
      properties: {
        period: { type: "string", description: "Period filter" },
        reason_code: { type: "string", description: "Filter by return reason code" },
      },
      required: [],
    },
  },
  {
    name: "get_inventory_levels",
    description:
      "Fetches current stock levels from SAP MM/WM, including safety stock alerts and slow-moving items.",
    input_schema: {
      type: "object" as const,
      properties: {
        material: { type: "string", description: "Material number or 'all'" },
        plant: { type: "string", description: "Plant code or 'all'" },
        alert_only: {
          type: "boolean",
          description: "If true, return only items below safety stock",
        },
      },
      required: [],
    },
  },
  {
    name: "get_supplier_info",
    description:
      "Gets supplier/vendor master data and performance metrics from SAP MM including delivery reliability.",
    input_schema: {
      type: "object" as const,
      properties: {
        vendor_id: { type: "string", description: "Vendor ID or omit for all" },
        include_performance: {
          type: "boolean",
          description: "Include delivery reliability and quality scores",
        },
      },
      required: [],
    },
  },
  {
    name: "get_demand_forecast",
    description:
      "Retrieves demand forecast data from SAP APO/IBP or generates statistical forecast.",
    input_schema: {
      type: "object" as const,
      properties: {
        material: { type: "string", description: "Material number" },
        horizon_months: {
          type: "number",
          description: "Forecast horizon in months (default 3)",
        },
        region: { type: "string", description: "Region filter" },
      },
      required: [],
    },
  },
  {
    name: "run_analytics_query",
    description:
      "Runs a flexible analytics query against SAP BW/HANA CDS views. Use for ad-hoc analysis not covered by other tools.",
    input_schema: {
      type: "object" as const,
      properties: {
        metric: {
          type: "string",
          description: "KPI to measure e.g. 'revenue', 'margin', 'stock_turns'",
        },
        dimensions: {
          type: "array",
          items: { type: "string" },
          description: "Group-by dimensions e.g. ['region', 'product_line']",
        },
        filters: {
          type: "object",
          description: "Key-value filter conditions",
        },
        period: { type: "string", description: "Period filter" },
      },
      required: ["metric"],
    },
  },
  {
    name: "get_gst_reconciliation",
    description:
      "Fetches GST input/output tax reconciliation from SAP FI-Tax, comparing books vs GSTN portal data.",
    input_schema: {
      type: "object" as const,
      properties: {
        period: { type: "string", description: "GST return period e.g. 'Mar-2026'" },
        gstin: { type: "string", description: "GSTIN number, or omit for all GSTINs" },
        mismatch_only: {
          type: "boolean",
          description: "Return only mismatched line items",
        },
      },
      required: [],
    },
  },
  {
    name: "get_cash_flow_forecast",
    description:
      "Retrieves cash flow forecast from SAP FI AR/AP, including accounts receivable aging by customer with risk levels and credit limits.",
    input_schema: {
      type: "object" as const,
      properties: {
        days: { type: "number", description: "Forecast horizon in days (default 60)" },
        drill_down: { type: "string", enum: ["customer", "region"], description: "Drill down dimension" },
      },
      required: [],
    },
  },
  {
    name: "get_risk_insights",
    description:
      "Retrieves AI-powered business risk insights including receivable delays, credit risk, and regional risk scores.",
    input_schema: {
      type: "object" as const,
      properties: {
        drill_down: { type: "string", enum: ["region", "customer", "product"], description: "Drill down dimension for risk breakdown" },
      },
      required: [],
    },
  },
];
