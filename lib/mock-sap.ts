/* eslint-disable @typescript-eslint/no-explicit-any */

export function executeMockTool(toolName: string, input: Record<string, any>): unknown {
  switch (toolName) {
    case "get_profitability_report":
      return mockProfitabilityReport(input);
    case "get_revenue_data":
      return mockRevenueData(input);
    case "get_cost_analysis":
      return mockCostAnalysis(input);
    case "get_order_status":
      return mockOrderStatus(input);
    case "get_shipment_tracking":
      return mockShipmentTracking(input);
    case "get_return_order_info":
      return mockReturnOrders(input);
    case "get_inventory_levels":
      return mockInventoryLevels(input);
    case "get_supplier_info":
      return mockSupplierInfo(input);
    case "get_demand_forecast":
      return mockDemandForecast(input);
    case "run_analytics_query":
      return mockAnalyticsQuery(input);
    case "get_gst_reconciliation":
      return mockGstReconciliation(input);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

function mockProfitabilityReport(input: any) {
  const period = input.period ?? "2024-Q1";
  const dimension = input.dimension ?? "product";
  const topN = input.top_n ?? 5;

  const rows = [
    { name: "Industrial Pumps", revenue: 12500000, cost: 7800000, margin_pct: 37.6, orders: 145 },
    { name: "Control Valves", revenue: 9800000, cost: 6100000, margin_pct: 37.8, orders: 203 },
    { name: "Heat Exchangers", revenue: 8200000, cost: 5400000, margin_pct: 34.1, orders: 87 },
    { name: "Pressure Vessels", revenue: 7400000, cost: 5100000, margin_pct: 31.1, orders: 64 },
    { name: "Compressors", revenue: 6900000, cost: 4200000, margin_pct: 39.1, orders: 52 },
    { name: "Filters", revenue: 3200000, cost: 2100000, margin_pct: 34.4, orders: 312 },
    { name: "Meters", revenue: 2800000, cost: 1900000, margin_pct: 32.1, orders: 198 },
  ].slice(0, topN);

  return {
    period,
    dimension,
    summary: {
      total_revenue: 50800000,
      total_cost: 32600000,
      gross_margin_pct: 35.8,
      total_orders: 1061,
      yoy_margin_change: +2.1,
    },
    rows,
    currency: "INR",
    data_source: "SAP CO-PA (Mock)",
  };
}

function mockRevenueData(input: any) {
  const granularity = input.granularity ?? "monthly";
  const region = input.region ?? "All";

  const months = [
    { period: "Jan 2024", revenue: 38500000, target: 36000000, yoy_growth: 12.3 },
    { period: "Feb 2024", revenue: 41200000, target: 38000000, yoy_growth: 14.8 },
    { period: "Mar 2024", revenue: 45600000, target: 42000000, yoy_growth: 11.2 },
    { period: "Apr 2024", revenue: 39800000, target: 40000000, yoy_growth: 8.6 },
    { period: "May 2024", revenue: 44300000, target: 41000000, yoy_growth: 15.2 },
    { period: "Jun 2024", revenue: 47100000, target: 44000000, yoy_growth: 13.4 },
  ];

  const byRegion = [
    { region: "North", revenue: 82400000, share_pct: 30.8 },
    { region: "South", revenue: 74200000, share_pct: 27.7 },
    { region: "West", revenue: 68100000, share_pct: 25.4 },
    { region: "East", revenue: 43100000, share_pct: 16.1 },
  ];

  return {
    region,
    granularity,
    ytd_revenue: 256500000,
    ytd_target: 241000000,
    achievement_pct: 106.4,
    trend: months,
    by_region: region === "All" ? byRegion : byRegion.filter((r) => r.region === region),
    currency: "INR",
    data_source: "SAP SD (Mock)",
  };
}

function mockCostAnalysis(input: any) {
  const period = input.period ?? "2024-Q1";

  return {
    period,
    total_actual: 98400000,
    total_planned: 95000000,
    variance: 3400000,
    variance_pct: 3.6,
    cost_elements: [
      { element: "Raw Materials", actual: 48200000, planned: 46000000, variance_pct: 4.8 },
      { element: "Direct Labor", actual: 18600000, planned: 18000000, variance_pct: 3.3 },
      { element: "Overheads", actual: 14800000, planned: 14500000, variance_pct: 2.1 },
      { element: "Logistics", actual: 9200000, planned: 8800000, variance_pct: 4.5 },
      { element: "Energy", actual: 7600000, planned: 7700000, variance_pct: -1.3 },
    ],
    data_source: "SAP CO (Mock)",
  };
}

function mockOrderStatus(input: any) {
  const statusFilter = input.status_filter ?? "all";
  const orders = [
    { order_id: "SO-4521", customer: "Reliance Industries", value: 2450000, status: "delivered", date: "2024-03-12" },
    { order_id: "SO-4522", customer: "Tata Steel", value: 1820000, status: "open", date: "2024-03-14" },
    { order_id: "SO-4523", customer: "ONGC", value: 3100000, status: "billed", date: "2024-03-10" },
    { order_id: "SO-4524", customer: "BHEL", value: 980000, status: "open", date: "2024-03-15" },
    { order_id: "SO-4525", customer: "L&T", value: 5600000, status: "delivered", date: "2024-03-11" },
    { order_id: "SO-4526", customer: "Adani Ports", value: 1250000, status: "open", date: "2024-03-16" },
  ];

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return {
    total_orders: filtered.length,
    open_value: orders.filter((o) => o.status === "open").reduce((s, o) => s + o.value, 0),
    orders: filtered.slice(0, input.limit ?? 10),
    currency: "INR",
    data_source: "SAP SD (Mock)",
  };
}

function mockShipmentTracking(input: any) {
  return {
    shipments: [
      { delivery_id: "DL-8821", order: "SO-4521", carrier: "BlueDart", status: "Delivered", eta: "2024-03-14", actual: "2024-03-13" },
      { delivery_id: "DL-8822", order: "SO-4522", carrier: "DTDC", status: "In Transit", eta: "2024-03-18", actual: null },
      { delivery_id: "DL-8823", order: "SO-4523", carrier: "FedEx", status: "Out for Delivery", eta: "2024-03-16", actual: null },
      { delivery_id: "DL-8824", order: "SO-4525", carrier: "DHL", status: "Delivered", eta: "2024-03-12", actual: "2024-03-12" },
    ],
    on_time_delivery_pct: 92.4,
    data_source: "SAP LE (Mock)",
  };
}

function mockReturnOrders(input: any) {
  return {
    total_returns: 23,
    return_value: 1840000,
    return_rate_pct: 2.1,
    returns: [
      { rma_id: "RMA-201", order: "SO-4488", reason: "Quality issue", value: 420000, status: "Credit issued" },
      { rma_id: "RMA-202", order: "SO-4491", reason: "Wrong item", value: 180000, status: "Replacement sent" },
      { rma_id: "RMA-203", order: "SO-4495", reason: "Damage in transit", value: 560000, status: "Under review" },
      { rma_id: "RMA-204", order: "SO-4497", reason: "Spec mismatch", value: 240000, status: "Credit issued" },
    ],
    top_reason: "Quality issue (38%)",
    data_source: "SAP SD Returns (Mock)",
  };
}

function mockInventoryLevels(input: any) {
  const alertOnly = input.alert_only ?? false;
  const allItems = [
    { material: "PUMP-001", description: "Industrial Pump 50HP", plant: "P001", stock: 45, safety_stock: 30, unit: "EA", alert: false },
    { material: "VALVE-002", description: "Ball Valve 2\"", plant: "P001", stock: 12, safety_stock: 50, unit: "EA", alert: true },
    { material: "COMP-003", description: "Compressor 100CFM", plant: "P002", stock: 8, safety_stock: 10, unit: "EA", alert: true },
    { material: "EXCH-004", description: "Heat Exchanger Shell&Tube", plant: "P001", stock: 22, safety_stock: 15, unit: "EA", alert: false },
    { material: "FILT-005", description: "Industrial Filter", plant: "P002", stock: 3, safety_stock: 25, unit: "EA", alert: true },
    { material: "METER-006", description: "Flow Meter Digital", plant: "P001", stock: 67, safety_stock: 40, unit: "EA", alert: false },
    { material: "PRESS-007", description: "Pressure Vessel 500L", plant: "P003", stock: 5, safety_stock: 8, unit: "EA", alert: true },
  ];

  const items = alertOnly ? allItems.filter((i) => i.alert) : allItems;

  return {
    total_skus: allItems.length,
    alert_count: allItems.filter((i) => i.alert).length,
    items,
    data_source: "SAP MM/WM (Mock)",
  };
}

function mockSupplierInfo(input: any) {
  return {
    suppliers: [
      { vendor_id: "V-1001", name: "Kirloskar Brothers", category: "Pumps", on_time_pct: 94.2, quality_score: 4.6, active_pos: 8 },
      { vendor_id: "V-1002", name: "Thermax Ltd", category: "Heat Exchangers", on_time_pct: 91.8, quality_score: 4.4, active_pos: 5 },
      { vendor_id: "V-1003", name: "Bharat Forge", category: "Forged Parts", on_time_pct: 87.3, quality_score: 4.2, active_pos: 12 },
      { vendor_id: "V-1004", name: "Atlas Copco India", category: "Compressors", on_time_pct: 96.1, quality_score: 4.8, active_pos: 3 },
      { vendor_id: "V-1005", name: "Forbes Marshall", category: "Valves & Controls", on_time_pct: 89.4, quality_score: 4.3, active_pos: 7 },
    ],
    avg_on_time_pct: 91.8,
    data_source: "SAP MM Vendor (Mock)",
  };
}

function mockDemandForecast(input: any) {
  const material = input.material ?? "ALL";
  const horizon = input.horizon_months ?? 3;

  const forecast = [];
  const base = 450;
  for (let i = 1; i <= horizon; i++) {
    const month = new Date(new Date().getFullYear(), new Date().getMonth() + i, 1).toLocaleString("default", { month: "short", year: "numeric" });
    forecast.push({
      period: month,
      forecast_qty: Math.round(base * (1 + i * 0.04) + (Math.random() - 0.5) * 30),
      lower_bound: Math.round(base * (1 + i * 0.04) - 40),
      upper_bound: Math.round(base * (1 + i * 0.04) + 60),
    });
  }

  return {
    material,
    method: "Exponential Smoothing + Trend",
    accuracy_mape: 8.4,
    forecast,
    recommendation: "Increase safety stock for PUMP-001 by 15% given upward trend",
    data_source: "SAP IBP Statistical Forecast (Mock)",
  };
}

function mockAnalyticsQuery(input: any) {
  const metric = input.metric ?? "revenue";
  const dimensions = input.dimensions ?? ["region"];

  return {
    metric,
    dimensions,
    period: input.period ?? "YTD",
    results: [
      { region: "North", product_line: "Pumps", value: 42800000, unit: "INR" },
      { region: "South", product_line: "Valves", value: 31200000, unit: "INR" },
      { region: "West", product_line: "Compressors", value: 28600000, unit: "INR" },
      { region: "East", product_line: "Filters", value: 18400000, unit: "INR" },
    ],
    data_source: "SAP BW Analytics (Mock)",
  };
}

function mockGstReconciliation(input: any) {
  const period = input.period ?? "Mar-2024";
  const mismatchOnly = input.mismatch_only ?? false;

  const allRows = [
    { gstin: "27AABCS1429B1ZB", party: "Reliance Industries", books_amount: 3245000, gst_portal: 3245000, diff: 0, status: "Matched" },
    { gstin: "27AAACT2727Q1Z2", party: "Tata Steel", books_amount: 1820000, gst_portal: 1800000, diff: 20000, status: "Mismatch" },
    { gstin: "07AADCS0472M1ZF", party: "BHEL", books_amount: 980000, gst_portal: 980000, diff: 0, status: "Matched" },
    { gstin: "06AACCL0417A1Z1", party: "L&T", books_amount: 5600000, gst_portal: 5580000, diff: 20000, status: "Mismatch" },
    { gstin: "24AAACG3888B1ZC", party: "Adani Ports", books_amount: 1250000, gst_portal: 1250000, diff: 0, status: "Matched" },
    { gstin: "19AABCO0634Q1Z2", party: "ONGC", books_amount: 3100000, gst_portal: 3100000, diff: 0, status: "Matched" },
  ];

  const rows = mismatchOnly ? allRows.filter((r) => r.status === "Mismatch") : allRows;

  return {
    period,
    total_output_tax: 12584000,
    total_input_tax: 8924000,
    net_gst_liability: 3660000,
    mismatches: allRows.filter((r) => r.status === "Mismatch").length,
    mismatch_value: 40000,
    rows,
    data_source: "SAP FI-Tax / GSTN (Mock)",
  };
}
