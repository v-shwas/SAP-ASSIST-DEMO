/**
 * SAP Data Layer — queries Neon PostgreSQL for Tirupathi Oils demo data.
 * Uses the normalized schema: Company → Product, Customer, SalesOrder, etc.
 */
import { getPrisma } from "@/lib/prisma";

/* eslint-disable @typescript-eslint/no-explicit-any */

const COMPANY_NAME = "Tirupathi Oils";

async function getCompanyId(): Promise<string> {
  const prisma = getPrisma();
  const company = await prisma.company.findFirst({ where: { name: COMPANY_NAME } });
  if (!company) throw new Error(`Company "${COMPANY_NAME}" not found. Run the seed script first.`);
  return company.id;
}

function aiSignal(stock: number, safetyStock: number): string {
  if (stock === 0) return "Out of Stock";
  if (stock < safetyStock * 0.5) return "Reorder Now";
  if (stock < safetyStock) return "Low Stock";
  if (stock > safetyStock * 3) return "Dead Stock";
  if (stock > safetyStock * 1.5) return "Overstock";
  return "Healthy";
}

export async function executeSapQuery(toolName: string, input: Record<string, any>): Promise<unknown> {
  switch (toolName) {
    case "get_profitability_report": return queryProfitability(input);
    case "get_revenue_data":         return queryRevenue(input);
    case "get_cost_analysis":        return queryCostAnalysis(input);
    case "get_order_status":         return queryOrders(input);
    case "get_shipment_tracking":    return queryShipments(input);
    case "get_return_order_info":    return queryReturns();
    case "get_inventory_levels":     return queryInventory(input);
    case "get_supplier_info":        return querySuppliers();
    case "get_demand_forecast":      return queryDemandForecast(input);
    case "run_analytics_query":      return queryAnalytics(input);
    case "get_gst_reconciliation":   return queryGst(input);
    case "get_cash_flow_forecast":   return queryCashFlow(input);
    case "get_risk_insights":        return queryRiskInsights();
    default: return { error: `Unknown tool: ${toolName}` };
  }
}

async function queryProfitability(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();
  const dimension = input.dimension ?? "product";
  const topN = input.top_n ?? 7;
  const period = input.period ?? "2026-Q1";

  if (dimension === "region") {
    const rows = await prisma.profitabilityByRegion.findMany({
      where: { companyId: cid, period },
      orderBy: { revenue: "desc" },
      take: topN,
    });
    const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
    const totalOrders = rows.reduce((s, r) => s + r.orders, 0);
    return {
      company: COMPANY_NAME, period, dimension,
      summary: { total_revenue: totalRevenue, total_orders: totalOrders },
      rows: rows.map(r => ({ name: r.region, revenue: r.revenue, margin_pct: r.marginPct, orders: r.orders })),
      currency: "INR", data_source: "SAP CO-PA — Operating Concern: S4CORP (KE24 / ACDOCA)",
    };
  }

  if (dimension === "customer") {
    const rows = await prisma.profitabilityBySegment.findMany({
      where: { companyId: cid, period },
      orderBy: { revenue: "desc" },
      take: topN,
    });
    const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
    return {
      company: COMPANY_NAME, period, dimension,
      summary: { total_revenue: totalRevenue },
      rows: rows.map(r => ({ name: r.segment, revenue: r.revenue, margin_pct: r.marginPct, contribution_pct: r.contributionPct, variance_vs_plan: r.varianceVsPlan })),
      currency: "INR", data_source: "SAP CO-PA — Operating Concern: S4CORP (KE24 / ACDOCA)",
    };
  }

  // Default: product dimension
  const records = await prisma.profitabilityRecord.findMany({
    where: { companyId: cid, period },
    include: { Product: true },
    orderBy: { revenue: "desc" },
    take: topN,
  });
  const totalRevenue = records.reduce((s, r) => s + r.revenue, 0);
  const totalCost = records.reduce((s, r) => s + r.cost, 0);
  const totalOrders = records.reduce((s, r) => s + r.orders, 0);

  return {
    company: COMPANY_NAME,
    operating_concern: "S4CORP",
    period,
    dimension,
    summary: {
      total_revenue: totalRevenue,
      total_cost: totalCost,
      gross_margin_pct: Math.round(((totalRevenue - totalCost) / totalRevenue) * 1000) / 10,
      operating_margin_pct: 10.4,
      total_orders: totalOrders,
      yoy_margin_change: 1.2,
    },
    top_segment: `${records[0]?.Product.name} (${records[0]?.marginPct}% margin)`,
    rows: records.map(r => ({ name: r.Product.name, revenue: r.revenue, cost: r.cost, margin_pct: r.marginPct, orders: r.orders })),
    currency: "INR",
    data_source: "SAP CO-PA — Operating Concern: S4CORP (KE24 / ACDOCA)",
  };
}

async function queryRevenue(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();

  const monthly = await prisma.revenueRecord.findMany({
    where: { companyId: cid, period: { contains: "-2026" } },
    orderBy: { period: "asc" },
  });
  const quarterly = monthly.filter(r => r.period.startsWith("20"));
  const monthlyOnly = monthly.filter(r => !r.period.startsWith("20"));
  const salesOrgs = await prisma.salesOrg.findMany({ where: { companyId: cid } });

  const ytdRevenue = monthlyOnly.reduce((s, r) => s + r.revenue, 0);
  const ytdTarget = monthlyOnly.reduce((s, r) => s + r.target, 0);

  return {
    company: COMPANY_NAME,
    forecast_revenue: 128000000,
    forecast_revenue_label: "₹128 Cr",
    qoq_growth: "+8.6%",
    confidence_level: "87%",
    top_growth_driver: "Groundnut Oil (+12%)",
    ytd_revenue: ytdRevenue,
    ytd_target: ytdTarget,
    achievement_pct: Math.round((ytdRevenue / ytdTarget) * 1000) / 10,
    trend: monthlyOnly.map(r => ({ period: r.period, revenue: r.revenue, target: r.target, yoy_growth: r.yoyGrowth })),
    quarterly: quarterly.map(r => ({ period: r.period, revenue: r.revenue })),
    by_sales_org: salesOrgs.map(s => ({
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
  const cid = await getCompanyId();
  const period = input.period ?? "2026-Q1";

  const elements = await prisma.costElement.findMany({ where: { companyId: cid, period } });
  const totalActual = elements.reduce((s, e) => s + e.actual, 0);
  const totalPlanned = elements.reduce((s, e) => s + e.planned, 0);

  return {
    company: COMPANY_NAME,
    period,
    total_actual: totalActual,
    total_planned: totalPlanned,
    variance: totalActual - totalPlanned,
    variance_pct: Math.round(((totalActual - totalPlanned) / totalPlanned) * 1000) / 10,
    cost_elements: elements.map(e => ({ element: e.element, actual: e.actual, planned: e.planned, variance_pct: e.variancePct })),
    data_source: "SAP CO — Cost Center Accounting (Tirupathi Oils)",
  };
}

async function queryOrders(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();
  const statusFilter = input.status_filter;

  const where: any = { companyId: cid };
  if (statusFilter && statusFilter !== "all") where.status = statusFilter;

  const orders = await prisma.salesOrder.findMany({
    where,
    include: { Customer: true, Product: true },
    orderBy: { orderDate: "desc" },
    take: input.limit ?? 10,
  });

  const allOrders = await prisma.salesOrder.findMany({ where: { companyId: cid } });
  const openValue = allOrders.filter(o => o.status === "open").reduce((s, o) => s + o.value, 0);
  const delayed = allOrders.filter(o => o.delayReason);

  return {
    company: COMPANY_NAME,
    total_orders: orders.length,
    open_value: openValue,
    delayed_orders: delayed.length,
    delay_info: delayed.map(d => `${d.orderId} — ${d.delayReason}`).join("; "),
    orders: orders.map(o => ({
      order_id: o.orderId,
      customer: o.Customer.name,
      product: o.Product.name,
      value: o.value,
      status: o.status,
      date: o.orderDate.toISOString().split("T")[0],
      delay_reason: o.delayReason,
    })),
    currency: "INR",
    data_source: "SAP SD — Sales Orders (Tirupathi Oils)",
  };
}

async function queryShipments(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();

  const shipments = await prisma.shipment.findMany({
    where: { companyId: cid },
    include: { Product: true },
  });
  const delivered = shipments.filter(s => s.status === "Delivered");
  const onTimePct = delivered.length > 0
    ? Math.round((delivered.filter(s => s.actual && s.actual <= s.eta).length / delivered.length) * 1000) / 10
    : 88.6;

  const delayed = shipments.find(s => s.delayDays > 0);

  return {
    company: COMPANY_NAME,
    shipments: shipments.map(s => ({
      delivery_id: s.deliveryId,
      order: s.orderId,
      carrier: s.carrier,
      status: s.status,
      product: s.Product.name,
      destination: s.destination,
      eta: s.eta.toISOString().split("T")[0],
      actual: s.actual?.toISOString().split("T")[0] ?? null,
      delay_reason: s.delayReason,
    })),
    on_time_delivery_pct: onTimePct,
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
  const prisma = getPrisma();
  const cid = await getCompanyId();

  const returns = await prisma.returnOrder.findMany({
    where: { companyId: cid },
    include: { Product: true, Customer: true },
  });
  const totalValue = returns.reduce((s, r) => s + r.value, 0);

  return {
    company: COMPANY_NAME,
    total_returns: returns.length,
    return_value: totalValue,
    return_rate_pct: 1.8,
    returns: returns.map(r => ({
      rma_id: r.rmaId,
      order: r.orderId,
      product: r.Product.name,
      customer: r.Customer.name,
      reason: r.reason,
      value: r.value,
      status: r.status,
    })),
    top_reason: "Packaging leak (34%)",
    data_source: "SAP SD Returns — Tirupathi Oils",
  };
}

async function queryInventory(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();
  const alertOnly = input.alert_only ?? false;

  const items = await prisma.inventoryItem.findMany({
    where: { companyId: cid },
    include: { Product: true, Plant: true },
  });
  const plantSummaries = await prisma.plantSummary.findMany({
    where: { companyId: cid },
    include: { Plant: true },
  });

  const itemsWithSignal = items.map(i => ({
    ...i,
    signal: aiSignal(i.stock, i.safetyStock),
  }));

  const filtered = alertOnly
    ? itemsWithSignal.filter(i => ["Reorder Now", "Low Stock", "Dead Stock", "Out of Stock"].includes(i.signal))
    : itemsWithSignal;

  const alertCount = items.filter(i => i.stock < i.safetyStock).length;
  const deadStockValue = itemsWithSignal.filter(i => i.signal === "Dead Stock").reduce((s, i) => s + i.value, 0);
  const totalCapitalBlocked = itemsWithSignal.filter(i => ["Dead Stock", "Overstock"].includes(i.signal)).reduce((s, i) => s + i.value, 0);

  return {
    company: COMPANY_NAME,
    total_skus: items.length,
    alert_count: alertCount,
    dead_stock_value: deadStockValue,
    dead_stock_items: itemsWithSignal.filter(i => i.signal === "Dead Stock").length,
    capital_blocked: totalCapitalBlocked,
    forecast_accuracy: "94%",
    items: filtered.map(i => ({
      material: i.Product.sku,
      description: i.Product.name,
      plant: `${i.Plant.code} — ${i.Plant.name}`,
      stock: i.stock,
      stock_value: i.value,
      safety_stock: i.safetyStock,
      unit: i.Product.unit,
      ai_signal: i.signal,
    })),
    by_plant: plantSummaries.map(p => ({
      plant: `${p.Plant.code} — ${p.Plant.name}`,
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
  const cid = await getCompanyId();

  const suppliers = await prisma.supplier.findMany({ where: { companyId: cid } });
  const avgOnTime = suppliers.reduce((s, v) => s + v.onTimePct, 0) / suppliers.length;

  return {
    company: COMPANY_NAME,
    suppliers: suppliers.map(s => ({
      vendor_id: s.id,
      name: s.name,
      category: s.category,
      location: s.location,
      on_time_pct: s.onTimePct,
      quality_score: s.qualityScore,
      active_pos: s.activePOs,
    })),
    avg_on_time_pct: Math.round(avgOnTime * 10) / 10,
    data_source: "SAP MM Vendor Master — Tirupathi Oils",
  };
}

async function queryDemandForecast(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();

  const forecasts = await prisma.demandForecast.findMany({
    where: { companyId: cid },
    include: { Product: true },
    orderBy: { forecastRevenue: "desc" },
  });
  const quarterly = await prisma.revenueRecord.findMany({
    where: { companyId: cid, period: { startsWith: "20" } },
    orderBy: { period: "asc" },
  });

  return {
    company: COMPANY_NAME,
    material: input.material ?? "ALL",
    method: "Prophet Forecasting + LSTM Time Series + SAC Smart Predict",
    forecast_revenue: 128000000,
    forecast_revenue_label: "₹128 Cr",
    qoq_growth: "+8.6%",
    confidence_level: "87%",
    top_growth_driver: "Groundnut Oil (+12%)",
    accuracy_mape: 6.2,
    quarterly_forecast: quarterly.map(r => ({ period: r.period, revenue: r.revenue })),
    by_product: forecasts.map(f => ({
      product: f.Product.name,
      forecast_revenue: f.forecastRevenue,
      growth_pct: f.growthPct,
      confidence: f.confidence,
    })),
    recommendation: "Increase Groundnut Oil production capacity by 15% — strong upward demand trend. Consider reducing Corn Oil batches.",
    data_source: "S/4HANA Sales Data → SAP Datasphere → AI Core Forecast → SAP Analytics Cloud → Joule Response",
  };
}

async function queryAnalytics(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();

  const records = await prisma.profitabilityByRegion.findMany({
    where: { companyId: cid },
    orderBy: { revenue: "desc" },
  });

  return {
    company: COMPANY_NAME,
    metric: input.metric ?? "revenue",
    period: input.period ?? "YTD",
    results: records.map(r => ({
      region: r.region,
      value: r.revenue,
      margin_pct: r.marginPct,
      orders: r.orders,
      unit: "INR",
    })),
    data_source: "SAP BW/HANA Analytics — Tirupathi Oils",
  };
}

async function queryGst(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();
  const period = input.period ?? "Mar-2026";
  const mismatchOnly = input.mismatch_only ?? false;

  const where: any = { companyId: cid, period };
  if (mismatchOnly) where.status = "Mismatch";

  const records = await prisma.gstRecord.findMany({ where, include: { Supplier: true } });
  const allRecords = await prisma.gstRecord.findMany({ where: { companyId: cid, period } });

  const totalOutput = allRecords.reduce((s, r) => s + r.invoiceValue, 0);
  const totalItcClaimed = allRecords.reduce((s, r) => s + r.claimedItc, 0);
  const totalItcEligible = allRecords.reduce((s, r) => s + r.eligibleItc, 0);
  const mismatchValue = allRecords.reduce((s, r) => s + r.mismatch, 0);
  const mismatchCount = allRecords.filter(r => r.status === "Mismatch").length;

  return {
    company: COMPANY_NAME,
    period,
    total_invoice_value: totalOutput,
    total_itc_claimed: totalItcClaimed,
    total_itc_eligible: totalItcEligible,
    total_mismatch: mismatchValue,
    mismatches: mismatchCount,
    rows: records.map(r => ({
      gstin: r.Supplier.gstin ?? "N/A",
      party: r.Supplier.name,
      invoice_value: r.invoiceValue,
      claimed_itc: r.claimedItc,
      eligible_itc: r.eligibleItc,
      mismatch: r.mismatch,
      status: r.status,
    })),
    data_source: "SAP FI Invoice Data + GST API Reconciliation (GSTR-2A/2B)",
  };
}

async function queryCashFlow(input: any) {
  const prisma = getPrisma();
  const cid = await getCompanyId();

  const summary = await prisma.cashFlowSummary.findFirst({ where: { companyId: cid } });
  const receivables = await prisma.receivable.findMany({
    where: { companyId: cid, outstanding: { gt: 0 } },
    include: { Customer: true },
    orderBy: { agingDays: "desc" },
  });

  const totalOutstanding = receivables.reduce((s, r) => s + r.outstanding, 0);
  const top = receivables[0];

  return {
    company: COMPANY_NAME,
    forecast_days: summary?.periodDays ?? input.days ?? 60,
    inflow: summary?.inflow ?? 25000000,
    outflow: summary?.outflow ?? 31000000,
    net_gap: summary?.netGap ?? -6000000,
    net_gap_label: "₹6 Cr (Deficit)",
    customer_aging: receivables.map(r => ({
      customer: r.Customer.name,
      outstanding: r.outstanding,
      aging_days: r.agingDays,
      risk_level: r.riskLevel,
      credit_limit: r.Customer.creditLimit,
    })),
    total_outstanding: totalOutstanding,
    recommendation: top
      ? `Follow up on ${top.Customer.name} (₹${(top.outstanding / 10000000).toFixed(1)} Cr, ${top.agingDays} days overdue) — breaches credit risk threshold.`
      : "No outstanding receivables.",
    data_source: "SAP FI-AR (BSID/ACDOCA) — Accounts Receivable Aging via Fiori",
  };
}

async function queryRiskInsights() {
  const prisma = getPrisma();
  const cid = await getCompanyId();

  const regions = await prisma.regionRisk.findMany({
    where: { companyId: cid },
    orderBy: { overdueAmount: "desc" },
  });
  const businessRisks = await prisma.businessRisk.findMany({
    where: { companyId: cid },
    orderBy: { severity: "asc" },
  });
  const totalOverdue = regions.reduce((s, r) => s + r.overdueAmount, 0);

  return {
    company: COMPANY_NAME,
    top_risk: `Receivables delay ₹${(totalOverdue / 10000000).toFixed(1)} Cr`,
    total_overdue: totalOverdue,
    by_region: regions.map(r => ({
      region: r.region,
      overdue_amount: r.overdueAmount,
      avg_delay_days: r.avgDelayDays,
      risk_score: r.riskScore,
      key_risk: r.keyRisk,
    })),
    business_risks: businessRisks.map(r => ({
      category: r.category,
      description: r.description,
      severity: r.severity,
      amount: r.amount,
      region: r.region,
    })),
    recommendations: [
      `Escalate collections in ${regions[0]?.region} region — ${regions[0]?.avgDelayDays} day average delay is above threshold.`,
      "Review credit limits for Wholesale segment — 3 accounts in High-risk zone.",
      "Hedge raw oilseed procurement — groundnut prices up 8% MoM.",
    ],
    data_source: "SAP AI Risk Analytics — Tirupathi Oils",
  };
}
