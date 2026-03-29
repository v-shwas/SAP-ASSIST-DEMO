/**
 * SAP Data Layer — queries Neon PostgreSQL for Tirupathi Oils demo data.
 * Replaces the old mock-sap.ts hardcoded values.
 */
import { getPrisma } from "@/lib/prisma";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function executeSapQuery(toolName: string, input: Record<string, any>): Promise<unknown> {
  switch (toolName) {
    case "get_profitability_report":
      return queryProfitability(input);
    case "get_revenue_data":
      return queryRevenue(input);
    case "get_cost_analysis":
      return queryCostAnalysis(input);
    case "get_order_status":
      return queryOrders(input);
    case "get_shipment_tracking":
      return queryShipments(input);
    case "get_return_order_info":
      return queryReturns();
    case "get_inventory_levels":
      return queryInventory(input);
    case "get_supplier_info":
      return querySuppliers();
    case "get_demand_forecast":
      return queryDemandForecast(input);
    case "run_analytics_query":
      return queryAnalytics(input);
    case "get_gst_reconciliation":
      return queryGst(input);
    case "get_cash_flow_forecast":
      return queryCashFlow(input);
    case "get_risk_insights":
      return queryRiskInsights();
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

async function queryProfitability(input: any) {
  const prisma = getPrisma();
  const dimension = input.dimension ?? "product";
  const topN = input.top_n ?? 7;

  const products = await prisma.sapProduct.findMany({
    orderBy: { revenue: "desc" },
    take: topN,
  });

  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
  const totalCost = products.reduce((s, p) => s + p.cost, 0);
  const totalOrders = products.reduce((s, p) => s + p.orders, 0);

  let rows: any[];
  if (dimension === "customer") {
    const customers = await prisma.sapCustomer.findMany();
    const segments = ["Retail", "Wholesale", "Direct B2B", "Online"];
    rows = segments.map((seg) => {
      const custs = customers.filter((c) => c.segment === seg);
      const rev = custs.reduce((s, c) => s + c.outstanding, 0) * 4;
      return { name: seg, revenue: rev, margin_pct: 10 + Math.random() * 4, contribution_pct: Math.round((rev / totalRevenue) * 100) };
    });
  } else {
    rows = products.map((p) => ({
      name: p.name,
      revenue: p.revenue,
      cost: p.cost,
      margin_pct: p.marginPct,
      orders: p.orders,
    }));
  }

  return {
    company: "Tirupathi Oils",
    operating_concern: "S4CORP",
    period: input.period ?? "2026-Q1",
    dimension,
    summary: {
      total_revenue: totalRevenue,
      total_cost: totalCost,
      operating_margin_pct: 10.4,
      gross_margin_pct: Math.round(((totalRevenue - totalCost) / totalRevenue) * 1000) / 10,
      total_orders: totalOrders,
      yoy_margin_change: 1.2,
    },
    top_segment: `${products[0]?.name} (${products[0]?.marginPct}% margin)`,
    rows,
    currency: "INR",
    data_source: "SAP CO-PA — Operating Concern: S4CORP (KE24 / ACDOCA)",
  };
}

async function queryRevenue(input: any) {
  const prisma = getPrisma();

  const monthly = await prisma.sapRevenue.findMany({ where: { type: "monthly" }, orderBy: { period: "asc" } });
  const quarterly = await prisma.sapRevenue.findMany({ where: { type: "quarterly" }, orderBy: { period: "asc" } });
  const salesOrgs = await prisma.sapSalesOrg.findMany();

  const ytdRevenue = monthly.reduce((s, r) => s + r.revenue, 0);
  const ytdTarget = monthly.reduce((s, r) => s + r.target, 0);

  return {
    company: "Tirupathi Oils",
    forecast_revenue: 128000000,
    forecast_revenue_label: "₹128 Cr",
    qoq_growth: "+8.6%",
    confidence_level: "87%",
    top_growth_driver: "Groundnut Oil (+12%)",
    ytd_revenue: ytdRevenue,
    ytd_target: ytdTarget,
    achievement_pct: Math.round((ytdRevenue / ytdTarget) * 1000) / 10,
    trend: monthly.map((r) => ({ period: r.period, revenue: r.revenue, target: r.target, yoy_growth: r.yoyGrowth })),
    quarterly: quarterly.map((r) => ({ period: r.period, revenue: r.revenue })),
    by_sales_org: salesOrgs.map((s) => ({
      sales_org: `${s.code} — ${s.name}`,
      forecast_revenue: s.forecastRevenue,
      growth_pct: s.growthPct,
      confidence: s.confidence,
      key_driver: s.keyDriver,
    })),
    currency: "INR",
    data_source: "SAP SD Billing (VBRP), LIS + Predictive Model (PAL)",
  };
}

async function queryCostAnalysis(input: any) {
  const prisma = getPrisma();
  const products = await prisma.sapProduct.findMany();
  const totalCost = products.reduce((s, p) => s + p.cost, 0);

  return {
    company: "Tirupathi Oils",
    period: input.period ?? "2026-Q1",
    total_actual: totalCost,
    total_planned: Math.round(totalCost * 0.95),
    variance: Math.round(totalCost * 0.05),
    variance_pct: 5.8,
    cost_elements: [
      { element: "Raw Oilseeds", actual: Math.round(totalCost * 0.51), planned: Math.round(totalCost * 0.47), variance_pct: 8.0 },
      { element: "Refining & Processing", actual: Math.round(totalCost * 0.19), planned: Math.round(totalCost * 0.19), variance_pct: 1.7 },
      { element: "Packaging", actual: Math.round(totalCost * 0.13), planned: Math.round(totalCost * 0.12), variance_pct: 3.8 },
      { element: "Logistics & Cold Chain", actual: Math.round(totalCost * 0.10), planned: Math.round(totalCost * 0.09), variance_pct: 6.9 },
      { element: "Energy & Utilities", actual: Math.round(totalCost * 0.07), planned: Math.round(totalCost * 0.07), variance_pct: 4.5 },
    ],
    data_source: "SAP CO — Cost Center Accounting (Tirupathi Oils)",
  };
}

async function queryOrders(input: any) {
  const prisma = getPrisma();
  const statusFilter = input.status_filter;

  const where = statusFilter && statusFilter !== "all" ? { status: statusFilter } : {};
  const orders = await prisma.sapOrder.findMany({
    where,
    include: { customer: true },
    orderBy: { date: "desc" },
    take: input.limit ?? 10,
  });

  const allOrders = await prisma.sapOrder.findMany();
  const openValue = allOrders.filter((o) => o.status === "open").reduce((s, o) => s + o.value, 0);
  const delayed = allOrders.filter((o) => o.delayReason);

  return {
    company: "Tirupathi Oils",
    total_orders: orders.length,
    open_value: openValue,
    delayed_orders: delayed.length,
    delay_info: delayed.map((d) => `${d.orderId} — ${d.delayReason}`).join("; "),
    orders: orders.map((o) => ({
      order_id: o.orderId,
      customer: o.customer.name,
      product: o.product,
      value: o.value,
      status: o.status,
      date: o.date.toISOString().split("T")[0],
      delay_reason: o.delayReason,
    })),
    currency: "INR",
    data_source: "SAP SD — Sales Orders (Tirupathi Oils)",
  };
}

async function queryShipments(input: any) {
  const prisma = getPrisma();

  const shipments = await prisma.sapShipment.findMany({ include: { order: true } });
  const delivered = shipments.filter((s) => s.status === "Delivered");
  const onTimePct = delivered.length > 0
    ? Math.round((delivered.filter((s) => s.actual && s.actual <= s.eta).length / delivered.length) * 1000) / 10
    : 0;

  const delayed = shipments.find((s) => s.status.includes("Delay"));

  return {
    company: "Tirupathi Oils",
    shipments: shipments.map((s) => ({
      delivery_id: s.deliveryId,
      order: s.orderId,
      carrier: s.carrier,
      status: s.status,
      product: s.product,
      eta: s.eta.toISOString().split("T")[0],
      actual: s.actual?.toISOString().split("T")[0] ?? null,
      delay_reason: s.delayReason,
    })),
    on_time_delivery_pct: onTimePct || 88.6,
    alternative_travel_plan: delayed ? {
      order: delayed.orderId,
      current_carrier: delayed.carrier,
      alternatives: [
        { carrier: "BlueDart Express", new_eta: "2026-03-19", cost_delta: "+₹4,200" },
        { carrier: "Gati Priority", new_eta: "2026-03-18", cost_delta: "+₹6,800" },
      ],
    } : null,
    data_source: "SAP LE — Logistics Execution (Tirupathi Oils)",
  };
}

async function queryReturns() {
  // Returns are not in DB yet — use computed data
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

async function queryInventory(input: any) {
  const prisma = getPrisma();
  const alertOnly = input.alert_only ?? false;

  const items = await prisma.sapInventory.findMany({ include: { product: true } });
  const plants = await prisma.sapPlant.findMany();

  const filtered = alertOnly
    ? items.filter((i) => ["Reorder Now", "Low Stock", "Dead Stock"].includes(i.aiSignal))
    : items;

  const alertCount = items.filter((i) => i.stock < i.safetyStock).length;
  const deadStockValue = items.filter((i) => i.aiSignal === "Dead Stock").reduce((s, i) => s + i.stockValue, 0);
  const totalCapitalBlocked = items.filter((i) => ["Dead Stock", "Overstock"].includes(i.aiSignal)).reduce((s, i) => s + i.stockValue, 0);

  return {
    company: "Tirupathi Oils",
    total_skus: items.length,
    alert_count: alertCount,
    dead_stock_value: deadStockValue,
    dead_stock_items: items.filter((i) => i.aiSignal === "Dead Stock").length,
    capital_blocked: totalCapitalBlocked,
    forecast_accuracy: "94%",
    items: filtered.map((i) => ({
      material: i.materialCode,
      description: i.product.name,
      plant: i.plant,
      stock: i.stock,
      stock_value: i.stockValue,
      safety_stock: i.safetyStock,
      coverage_days: i.coverageDays,
      unit: i.unit,
      ai_signal: i.aiSignal,
    })),
    by_plant: plants.map((p) => ({
      plant: `${p.code} — ${p.name}`,
      stock_value: p.stockValue,
      dead_stock_pct: p.deadStockPct,
      overstock_pct: p.overstockPct,
      stockout_risk: p.stockoutRisk,
    })),
    data_source: "SAP MM — Tables: MARD, MARA, MBEW | AI: Demand Forecasting + Turnover Analysis",
  };
}

async function querySuppliers() {
  const prisma = getPrisma();
  const suppliers = await prisma.sapSupplier.findMany();
  const avgOnTime = suppliers.reduce((s, v) => s + v.onTimePct, 0) / suppliers.length;

  return {
    company: "Tirupathi Oils",
    suppliers: suppliers.map((s) => ({
      vendor_id: s.vendorId,
      name: s.name,
      category: s.category,
      on_time_pct: s.onTimePct,
      quality_score: s.qualityScore,
      active_pos: s.activePos,
    })),
    avg_on_time_pct: Math.round(avgOnTime * 10) / 10,
    data_source: "SAP MM Vendor Master — Tirupathi Oils",
  };
}

async function queryDemandForecast(input: any) {
  const prisma = getPrisma();
  const products = await prisma.sapProduct.findMany({ orderBy: { revenue: "desc" } });
  const quarterly = await prisma.sapRevenue.findMany({ where: { type: "quarterly" }, orderBy: { period: "asc" } });

  return {
    company: "Tirupathi Oils",
    material: input.material ?? "ALL",
    method: "Prophet Forecasting + LSTM Time Series + SAC Smart Predict",
    forecast_revenue: 128000000,
    forecast_revenue_label: "₹128 Cr",
    qoq_growth: "+8.6%",
    confidence_level: "87%",
    top_growth_driver: "Groundnut Oil (+12%)",
    accuracy_mape: 6.2,
    quarterly_forecast: quarterly.map((r) => ({ period: r.period, revenue: r.revenue })),
    by_product: products.map((p, i) => ({
      product: p.name,
      forecast_qty: Math.round(p.orders * 1.15),
      growth_pct: Math.round((12 - i * 1.5) * 10) / 10,
      confidence: Math.max(76, 91 - i * 2),
    })),
    recommendation: "Increase Groundnut Oil production capacity by 15% — strong upward demand trend. Consider reducing Corn Oil batches.",
    data_source: "S/4HANA Sales Data → SAP Datasphere → AI Core Forecast → SAP Analytics Cloud → Joule Response",
  };
}

async function queryAnalytics(input: any) {
  const prisma = getPrisma();
  const products = await prisma.sapProduct.findMany({ orderBy: { revenue: "desc" }, take: 4 });
  const regions = ["South", "West", "North", "East"];

  return {
    company: "Tirupathi Oils",
    metric: input.metric ?? "revenue",
    dimensions: input.dimensions ?? ["region"],
    period: input.period ?? "YTD",
    results: products.map((p, i) => ({
      region: regions[i],
      product_line: p.name,
      value: p.revenue,
      unit: "INR",
    })),
    data_source: "SAP BW/HANA Analytics — Tirupathi Oils",
  };
}

async function queryGst(input: any) {
  const prisma = getPrisma();
  const period = input.period ?? "Mar-2026";
  const mismatchOnly = input.mismatch_only ?? false;

  const where = mismatchOnly ? { period, status: "Mismatch" } : { period };
  const records = await prisma.sapGstRecord.findMany({ where });
  const allRecords = await prisma.sapGstRecord.findMany({ where: { period } });

  const totalOutput = allRecords.reduce((s, r) => s + r.booksAmount, 0);
  const totalInput = Math.round(totalOutput * 0.66);
  const mismatchCount = allRecords.filter((r) => r.status === "Mismatch").length;
  const mismatchValue = allRecords.filter((r) => r.status === "Mismatch").reduce((s, r) => s + r.diff, 0);

  return {
    company: "Tirupathi Oils",
    period,
    total_output_tax: totalOutput,
    total_input_tax: totalInput,
    net_gst_liability: totalOutput - totalInput,
    total_mismatch: mismatchValue,
    mismatches: mismatchCount,
    mismatch_value: mismatchValue,
    rows: records.map((r) => ({
      gstin: r.gstin,
      party: r.party,
      books_amount: r.booksAmount,
      gst_portal: r.gstPortal,
      diff: r.diff,
      status: r.status,
    })),
    data_source: "SAP FI Invoice Data + GST API Reconciliation (GSTR-2A/2B)",
  };
}

async function queryCashFlow(input: any) {
  const prisma = getPrisma();
  const customers = await prisma.sapCustomer.findMany({
    where: { outstanding: { gt: 0 } },
    orderBy: { agingDays: "desc" },
  });

  const totalOutstanding = customers.reduce((s, c) => s + c.outstanding, 0);

  return {
    company: "Tirupathi Oils",
    forecast_days: input.days ?? 60,
    inflow: 25000000,
    outflow: 31000000,
    net_gap: -6000000,
    net_gap_label: "₹6 Cr (Deficit)",
    customer_aging: customers.map((c) => ({
      customer: c.name,
      outstanding: c.outstanding,
      aging_days: c.agingDays,
      risk_level: c.riskLevel,
      credit_limit: c.creditLimit,
    })),
    total_outstanding: totalOutstanding,
    recommendation: `Follow up on ${customers[0]?.name} (₹${(customers[0]?.outstanding / 10000000).toFixed(1)} Cr, ${customers[0]?.agingDays} days overdue) — breaches credit risk threshold.`,
    data_source: "SAP FI-AR (BSID/ACDOCA) — Accounts Receivable Aging via Fiori",
  };
}

async function queryRiskInsights() {
  const prisma = getPrisma();
  const regions = await prisma.sapRiskRegion.findMany({ orderBy: { overdueAmount: "desc" } });
  const totalOverdue = regions.reduce((s, r) => s + r.overdueAmount, 0);

  return {
    company: "Tirupathi Oils",
    top_risk: `Receivables delay ₹${(totalOverdue / 10000000).toFixed(1)} Cr`,
    total_overdue: totalOverdue,
    by_region: regions.map((r) => ({
      region: r.region,
      overdue_amount: r.overdueAmount,
      avg_delay_days: r.avgDelayDays,
      risk_score: r.riskScore,
    })),
    recommendations: [
      "Escalate collections in South region — 52 day average delay is above threshold.",
      "Review credit limits for Wholesale segment — 3 accounts in High-risk zone.",
      "Hedge raw oilseed procurement — groundnut prices up 8% MoM.",
    ],
    data_source: "SAP AI Risk Analytics — Tirupathi Oils",
  };
}
