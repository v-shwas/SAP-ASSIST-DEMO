/* eslint-disable @typescript-eslint/no-explicit-any */

// Demo data for Tirupathi Oils — edible oil manufacturing company
// Products: Cottonseed Oil, Groundnut Oil, Sunflower Oil, Corn Oil, Soyabean Oil, Rice Bran Oil, Mustard Oil

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
    case "get_cash_flow_forecast":
      return mockCashFlowForecast(input);
    case "get_risk_insights":
      return mockRiskInsights(input);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

function mockProfitabilityReport(input: any) {
  const period = input.period ?? "2026-Q1";
  const dimension = input.dimension ?? "product";
  const topN = input.top_n ?? 7;

  const productRows = [
    { name: "Groundnut Oil", revenue: 22000000, cost: 12760000, margin_pct: 42.0, orders: 320 },
    { name: "Sunflower Oil", revenue: 18500000, cost: 11470000, margin_pct: 38.0, orders: 410 },
    { name: "Cottonseed Oil", revenue: 15200000, cost: 10486000, margin_pct: 31.0, orders: 280 },
    { name: "Rice Bran Oil", revenue: 12800000, cost: 8576000, margin_pct: 33.0, orders: 195 },
    { name: "Mustard Oil", revenue: 9600000, cost: 7872000, margin_pct: 18.0, orders: 150 },
    { name: "Soyabean Oil", revenue: 8400000, cost: 7224000, margin_pct: 14.0, orders: 175 },
    { name: "Corn Oil", revenue: 5500000, cost: 5060000, margin_pct: 8.0, orders: 90 },
  ].slice(0, topN);

  const customerRows = [
    { name: "Retail", revenue: 22000000, cost: 12760000, margin_pct: 12.8, contribution_pct: 38, var_vs_plan: "+1.5%" },
    { name: "Wholesale", revenue: 15000000, cost: 10500000, margin_pct: 10.2, contribution_pct: 26, var_vs_plan: "+0.6%" },
    { name: "Direct B2B", revenue: 12000000, cost: 9120000, margin_pct: 9.4, contribution_pct: 21, var_vs_plan: "−0.8%" },
    { name: "Online", revenue: 9000000, cost: 6480000, margin_pct: 13.6, contribution_pct: 15, var_vs_plan: "+2.1%" },
  ];

  const rows = dimension === "customer" ? customerRows : productRows;

  return {
    company: "Tirupathi Oils",
    operating_concern: "S4CORP",
    period,
    dimension,
    summary: {
      total_revenue: 92000000,
      total_cost: 63448000,
      operating_margin_pct: 10.4,
      gross_margin_pct: 31.0,
      total_orders: 1620,
      yoy_margin_change: +1.2,
      vs_plan: "+1.2%",
    },
    top_segment: "Groundnut Oil (42% margin)",
    rows,
    currency: "INR",
    data_source: "SAP CO-PA — Operating Concern: S4CORP (KE24 / ACDOCA)",
  };
}

function mockRevenueData(input: any) {
  const granularity = input.granularity ?? "monthly";
  const region = input.region ?? "All";

  const months = [
    { period: "Oct 2025", revenue: 32000000, target: 30000000, yoy_growth: 9.8 },
    { period: "Nov 2025", revenue: 35600000, target: 33000000, yoy_growth: 11.4 },
    { period: "Dec 2025", revenue: 38200000, target: 36000000, yoy_growth: 10.1 },
    { period: "Jan 2026", revenue: 42000000, target: 40000000, yoy_growth: 8.6 },
    { period: "Feb 2026", revenue: 51000000, target: 48000000, yoy_growth: 12.3 },
    { period: "Mar 2026", revenue: 63000000, target: 58000000, yoy_growth: 14.2 },
  ];

  const quarterly = [
    { period: "Q1 Actual", revenue: 42000000 },
    { period: "Q2 Actual", revenue: 51000000 },
    { period: "Q3 Actual", revenue: 63000000 },
    { period: "Q4 Forecast", revenue: 78000000 },
  ];

  const bySalesOrg = [
    { sales_org: "1000 — NA", forecast_revenue: 52000000, growth_pct: 10.2, confidence: 91, key_driver: "Groundnut Oil demand" },
    { sales_org: "2000 — EU", forecast_revenue: 38000000, growth_pct: 6.4, confidence: 85, key_driver: "Stable orders" },
    { sales_org: "3000 — APAC", forecast_revenue: 28000000, growth_pct: 9.1, confidence: 88, key_driver: "New customers" },
    { sales_org: "4000 — LATAM", forecast_revenue: 10000000, growth_pct: 4.3, confidence: 80, key_driver: "Seasonal" },
  ];

  const byRegion = [
    { region: "South", revenue: 84200000, share_pct: 32.8 },
    { region: "West", revenue: 72400000, share_pct: 28.2 },
    { region: "North", revenue: 62100000, share_pct: 24.2 },
    { region: "East", revenue: 38100000, share_pct: 14.8 },
  ];

  return {
    company: "Tirupathi Oils",
    region,
    granularity,
    forecast_revenue: 128000000,
    forecast_revenue_label: "₹128 Cr",
    qoq_growth: "+8.6%",
    confidence_level: "87%",
    top_growth_driver: "Groundnut Oil (+12%)",
    ytd_revenue: 256800000,
    ytd_target: 245000000,
    achievement_pct: 104.8,
    trend: months,
    quarterly,
    by_sales_org: bySalesOrg,
    by_region: region === "All" ? byRegion : byRegion.filter((r) => r.region === region),
    currency: "INR",
    data_source: "SAP SD Billing (VBRP), LIS + Predictive Model (PAL)",
  };
}

function mockCostAnalysis(input: any) {
  const period = input.period ?? "2026-Q1";

  return {
    company: "Tirupathi Oils",
    period,
    total_actual: 63500000,
    total_planned: 60000000,
    variance: 3500000,
    variance_pct: 5.8,
    cost_elements: [
      { element: "Raw Oilseeds", actual: 32400000, planned: 30000000, variance_pct: 8.0 },
      { element: "Refining & Processing", actual: 12200000, planned: 12000000, variance_pct: 1.7 },
      { element: "Packaging", actual: 8100000, planned: 7800000, variance_pct: 3.8 },
      { element: "Logistics & Cold Chain", actual: 6200000, planned: 5800000, variance_pct: 6.9 },
      { element: "Energy & Utilities", actual: 4600000, planned: 4400000, variance_pct: 4.5 },
    ],
    data_source: "SAP CO — Cost Center Accounting (Tirupathi Oils)",
  };
}

function mockOrderStatus(input: any) {
  const statusFilter = input.status_filter ?? "all";
  const orders = [
    { order_id: "SO-7201", customer: "Reliance Retail", product: "Sunflower Oil 1L x 20", value: 3450000, status: "delivered", date: "2026-03-12" },
    { order_id: "SO-7202", customer: "DMart", product: "Groundnut Oil 5L x 50", value: 2820000, status: "open", date: "2026-03-14", delay_reason: "Shipment late from warehouse" },
    { order_id: "SO-7203", customer: "BigBasket", product: "Rice Bran Oil 1L x 100", value: 1800000, status: "billed", date: "2026-03-10" },
    { order_id: "SO-7204", customer: "More Supermarket", product: "Cottonseed Oil 15kg Tin", value: 1450000, status: "open", date: "2026-03-15" },
    { order_id: "SO-7205", customer: "Spencer's Retail", product: "Mustard Oil 1L x 60", value: 980000, status: "delivered", date: "2026-03-11" },
    { order_id: "SO-7206", customer: "Star Bazaar", product: "Soyabean Oil 5L x 30", value: 1250000, status: "open", date: "2026-03-16" },
    { order_id: "SO-7207", customer: "Amazon Pantry", product: "Corn Oil 1L x 48", value: 720000, status: "delivered", date: "2026-03-09" },
  ];

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return {
    company: "Tirupathi Oils",
    total_orders: filtered.length,
    open_value: orders.filter((o) => o.status === "open").reduce((s, o) => s + o.value, 0),
    delayed_orders: 1,
    delay_info: "SO-7202 (DMart) — Shipment late from warehouse. Alternative transport plan available.",
    orders: filtered.slice(0, input.limit ?? 10),
    currency: "INR",
    data_source: "SAP SD — Sales Orders (Tirupathi Oils)",
  };
}

function mockShipmentTracking(input: any) {
  return {
    company: "Tirupathi Oils",
    shipments: [
      { delivery_id: "DL-3401", order: "SO-7201", carrier: "BlueDart", status: "Delivered", product: "Sunflower Oil 1L", eta: "2026-03-14", actual: "2026-03-13" },
      { delivery_id: "DL-3402", order: "SO-7202", carrier: "DTDC", status: "Delayed — In Transit", product: "Groundnut Oil 5L", eta: "2026-03-18", actual: null, delay_reason: "Vehicle breakdown on NH44" },
      { delivery_id: "DL-3403", order: "SO-7203", carrier: "Gati", status: "Out for Delivery", product: "Rice Bran Oil 1L", eta: "2026-03-16", actual: null },
      { delivery_id: "DL-3404", order: "SO-7205", carrier: "DHL", status: "Delivered", product: "Mustard Oil 1L", eta: "2026-03-12", actual: "2026-03-12" },
      { delivery_id: "DL-3405", order: "SO-7207", carrier: "Delhivery", status: "Delivered", product: "Corn Oil 1L", eta: "2026-03-10", actual: "2026-03-09" },
    ],
    on_time_delivery_pct: 88.6,
    alternative_travel_plan: {
      order: "SO-7202",
      current_carrier: "DTDC",
      alternatives: [
        { carrier: "BlueDart Express", new_eta: "2026-03-19", cost_delta: "+₹4,200" },
        { carrier: "Gati Priority", new_eta: "2026-03-18", cost_delta: "+₹6,800" },
      ],
    },
    data_source: "SAP LE — Logistics Execution (Tirupathi Oils)",
  };
}

function mockReturnOrders(input: any) {
  return {
    company: "Tirupathi Oils",
    total_returns: 18,
    return_value: 1420000,
    return_rate_pct: 1.8,
    returns: [
      { rma_id: "RMA-301", order: "SO-7188", product: "Sunflower Oil 1L x 20", reason: "Quality — rancid smell", value: 345000, status: "Credit issued" },
      { rma_id: "RMA-302", order: "SO-7191", product: "Groundnut Oil 5L x 10", reason: "Packaging leak", value: 282000, status: "Replacement sent" },
      { rma_id: "RMA-303", order: "SO-7195", product: "Mustard Oil 1L x 60", reason: "Wrong product shipped", value: 196000, status: "Under review" },
      { rma_id: "RMA-304", order: "SO-7197", product: "Cottonseed Oil 15kg", reason: "Damaged in transit", value: 145000, status: "Credit issued" },
    ],
    top_reason: "Packaging leak (34%)",
    data_source: "SAP SD Returns — Tirupathi Oils",
  };
}

function mockInventoryLevels(input: any) {
  const alertOnly = input.alert_only ?? false;
  const allItems = [
    { material: "MAT-001", description: "Cottonseed Oil 1L", plant: "P001 — Tirupati", stock: 450, stock_value: 2250000, safety_stock: 200, coverage_days: 210, unit: "Cases", alert: false, ai_signal: "Dead Stock" },
    { material: "MAT-002", description: "Groundnut Oil 5L", plant: "P001 — Tirupati", stock: 80, stock_value: 960000, safety_stock: 100, coverage_days: 45, unit: "Cases", alert: true, ai_signal: "Healthy" },
    { material: "MAT-003", description: "Sunflower Oil 1L", plant: "P002 — Vijayawada", stock: 15, stock_value: 75000, safety_stock: 120, coverage_days: 8, unit: "Cases", alert: true, ai_signal: "Reorder Now" },
    { material: "MAT-004", description: "Rice Bran Oil 1L", plant: "P001 — Tirupati", stock: 320, stock_value: 1440000, safety_stock: 150, coverage_days: 180, unit: "Cases", alert: false, ai_signal: "Overstock" },
    { material: "MAT-005", description: "Mustard Oil 1L", plant: "P003 — Hyderabad", stock: 60, stock_value: 420000, safety_stock: 80, coverage_days: 35, unit: "Cases", alert: true, ai_signal: "Low Stock" },
    { material: "MAT-006", description: "Soyabean Oil 5L", plant: "P002 — Vijayawada", stock: 200, stock_value: 1200000, safety_stock: 100, coverage_days: 90, unit: "Cases", alert: false, ai_signal: "Healthy" },
    { material: "MAT-007", description: "Corn Oil 1L", plant: "P003 — Hyderabad", stock: 25, stock_value: 175000, safety_stock: 50, coverage_days: 18, unit: "Cases", alert: true, ai_signal: "Reorder Now" },
  ];

  const byPlant = [
    { plant: "P001 — Tirupati", stock_value: 12000000, dead_stock_pct: 18, overstock_pct: 12, stockout_risk: "Low" },
    { plant: "P002 — Vijayawada", stock_value: 9000000, dead_stock_pct: 22, overstock_pct: 18, stockout_risk: "Medium" },
    { plant: "P003 — Hyderabad", stock_value: 7000000, dead_stock_pct: 28, overstock_pct: 25, stockout_risk: "High" },
  ];

  const items = alertOnly ? allItems.filter((i) => i.alert) : allItems;

  return {
    company: "Tirupathi Oils",
    total_skus: allItems.length,
    alert_count: allItems.filter((i) => i.alert).length,
    dead_stock_value: 32000000,
    dead_stock_items: 18,
    overstock_pct: 22,
    overstock_category: "Cottonseed Oil",
    capital_blocked: 24000000,
    forecast_accuracy: "94%",
    items,
    by_plant: byPlant,
    data_source: "SAP MM — Tables: MARD, MARA, MBEW | AI: Demand Forecasting + Turnover Analysis",
  };
}

function mockSupplierInfo(input: any) {
  return {
    company: "Tirupathi Oils",
    suppliers: [
      { vendor_id: "V-2001", name: "Andhra Pradesh Oilseeds Federation", category: "Groundnut Seeds", on_time_pct: 94.8, quality_score: 4.7, active_pos: 12 },
      { vendor_id: "V-2002", name: "Gujarat Cottonseed Traders", category: "Cotton Seeds", on_time_pct: 91.2, quality_score: 4.4, active_pos: 8 },
      { vendor_id: "V-2003", name: "Rajasthan Mustard Co-op", category: "Mustard Seeds", on_time_pct: 88.5, quality_score: 4.2, active_pos: 6 },
      { vendor_id: "V-2004", name: "MP Soya Processors", category: "Soyabean Seeds", on_time_pct: 92.4, quality_score: 4.5, active_pos: 10 },
      { vendor_id: "V-2005", name: "Karnataka Sunflower Growers", category: "Sunflower Seeds", on_time_pct: 96.1, quality_score: 4.8, active_pos: 5 },
      { vendor_id: "V-2006", name: "West Bengal Rice Bran Mills", category: "Rice Bran", on_time_pct: 89.7, quality_score: 4.3, active_pos: 4 },
    ],
    avg_on_time_pct: 92.1,
    data_source: "SAP MM Vendor Master — Tirupathi Oils",
  };
}

function mockDemandForecast(input: any) {
  const material = input.material ?? "ALL";
  const horizon = input.horizon_months ?? 4;

  const quarterlyForecast = [
    { period: "Q1 Actual", revenue: 42000000, qty: 4200 },
    { period: "Q2 Actual", revenue: 51000000, qty: 5100 },
    { period: "Q3 Actual", revenue: 63000000, qty: 6300 },
    { period: "Q4 Forecast", revenue: 78000000, qty: 7800 },
  ];

  const byProduct = [
    { product: "Groundnut Oil", forecast_qty: 2800, growth_pct: 12.0, confidence: 91 },
    { product: "Sunflower Oil", forecast_qty: 2200, growth_pct: 9.4, confidence: 88 },
    { product: "Cottonseed Oil", forecast_qty: 1400, growth_pct: 5.2, confidence: 85 },
    { product: "Rice Bran Oil", forecast_qty: 1100, growth_pct: 8.1, confidence: 86 },
    { product: "Mustard Oil", forecast_qty: 800, growth_pct: 6.8, confidence: 82 },
    { product: "Soyabean Oil", forecast_qty: 600, growth_pct: 3.2, confidence: 79 },
    { product: "Corn Oil", forecast_qty: 300, growth_pct: 2.1, confidence: 76 },
  ];

  return {
    company: "Tirupathi Oils",
    material,
    method: "Prophet Forecasting + LSTM Time Series + SAC Smart Predict",
    forecast_revenue: 128000000,
    forecast_revenue_label: "₹128 Cr",
    qoq_growth: "+8.6%",
    confidence_level: "87%",
    top_growth_driver: "Groundnut Oil (+12%)",
    accuracy_mape: 6.2,
    quarterly_forecast: quarterlyForecast,
    by_product: byProduct,
    recommendation: "Increase Groundnut Oil production capacity by 15% — strong upward demand trend. Consider reducing Corn Oil batches.",
    data_source: "S/4HANA Sales Data → SAP Datasphere → AI Core Forecast → SAP Analytics Cloud → Joule Response",
  };
}

function mockAnalyticsQuery(input: any) {
  const metric = input.metric ?? "revenue";
  const dimensions = input.dimensions ?? ["region"];

  return {
    company: "Tirupathi Oils",
    metric,
    dimensions,
    period: input.period ?? "YTD",
    results: [
      { region: "South", product_line: "Groundnut Oil", value: 48200000, unit: "INR" },
      { region: "West", product_line: "Sunflower Oil", value: 36800000, unit: "INR" },
      { region: "North", product_line: "Mustard Oil", value: 28400000, unit: "INR" },
      { region: "East", product_line: "Rice Bran Oil", value: 19600000, unit: "INR" },
    ],
    data_source: "SAP BW/HANA Analytics — Tirupathi Oils",
  };
}

function mockGstReconciliation(input: any) {
  const period = input.period ?? "Mar-2026";
  const mismatchOnly = input.mismatch_only ?? false;

  const allRows = [
    { gstin: "37AABCT4521K1Z8", party: "Reliance Retail", books_amount: 3450000, gst_portal: 3450000, diff: 0, status: "Matched" },
    { gstin: "27AAACM6254Q1ZP", party: "DMart", books_amount: 2820000, gst_portal: 2800000, diff: 20000, status: "Mismatch" },
    { gstin: "29AAACU9603R1ZP", party: "BigBasket", books_amount: 1800000, gst_portal: 1800000, diff: 0, status: "Matched" },
    { gstin: "36AABCS5678D1Z4", party: "Spencer's Retail", books_amount: 980000, gst_portal: 965000, diff: 15000, status: "Mismatch" },
    { gstin: "27AABCU9342P1ZO", party: "Star Bazaar", books_amount: 1250000, gst_portal: 1250000, diff: 0, status: "Matched" },
    { gstin: "29AAGCF5765H1ZH", party: "More Supermarket", books_amount: 1450000, gst_portal: 1442000, diff: 8000, status: "Mismatch" },
  ];

  const rows = mismatchOnly ? allRows.filter((r) => r.status === "Mismatch") : allRows;

  return {
    company: "Tirupathi Oils",
    period,
    total_output_tax: 18400000,
    total_input_tax: 12200000,
    net_gst_liability: 6200000,
    total_mismatch: 18000000,
    mismatches: allRows.filter((r) => r.status === "Mismatch").length,
    mismatch_value: 43000,
    rows,
    data_source: "SAP FI Invoice Data + GST API Reconciliation (GSTR-2A/2B)",
  };
}

function mockCashFlowForecast(input: any) {
  const days = input.days ?? 60;

  const customerAging = [
    { customer: "DMart", outstanding: 21000000, aging_days: 75, risk_level: "High 🔴", credit_limit: 30000000 },
    { customer: "BigBasket", outstanding: 14000000, aging_days: 62, risk_level: "High 🔴", credit_limit: 20000000 },
    { customer: "More Supermarket", outstanding: 9000000, aging_days: 48, risk_level: "Medium 🟠", credit_limit: 15000000 },
    { customer: "Star Bazaar", outstanding: 6000000, aging_days: 30, risk_level: "Low 🟢", credit_limit: 10000000 },
  ];

  return {
    company: "Tirupathi Oils",
    forecast_days: days,
    inflow: 25000000,
    outflow: 31000000,
    net_gap: -6000000,
    net_gap_label: "₹6 Cr (Deficit)",
    customer_aging: customerAging,
    recommendation: "Follow up on DMart (₹2.1 Cr, 75 days overdue) and BigBasket (₹1.4 Cr, 62 days) — both breach credit risk thresholds.",
    data_source: "SAP FI-AR (BSID/ACDOCA) — Accounts Receivable Aging via Fiori",
  };
}

function mockRiskInsights(input: any) {
  const byRegion = [
    { region: "South", overdue_amount: 18000000, avg_delay_days: 52, risk_score: "High" },
    { region: "West", overdue_amount: 12000000, avg_delay_days: 48, risk_score: "Medium" },
    { region: "North", overdue_amount: 8000000, avg_delay_days: 39, risk_score: "Medium" },
    { region: "East", overdue_amount: 4000000, avg_delay_days: 30, risk_score: "Low" },
  ];

  return {
    company: "Tirupathi Oils",
    top_risk: "Receivables delay ₹4.2 Cr",
    total_overdue: 42000000,
    by_region: byRegion,
    recommendations: [
      "Escalate collections in South region — 52 day average delay is above threshold.",
      "Review credit limits for Wholesale segment — 3 accounts in High-risk zone.",
      "Hedge raw oilseed procurement — groundnut prices up 8% MoM.",
    ],
    data_source: "SAP AI Risk Analytics — Tirupathi Oils",
  };
}
