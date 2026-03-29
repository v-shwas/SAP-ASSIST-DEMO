import Anthropic from "@anthropic-ai/sdk";
import { SAP_TOOLS } from "@/lib/sap-tools";
import { executeSapTool } from "@/lib/sap-client";

const SYSTEM_PROMPT = `You are Joule, the AI assistant for Tirupathi Oils — an edible oil manufacturing company. You help business users query live SAP data and understand their business operations.

Company: Tirupathi Oils
Products: Cottonseed Oil, Groundnut Oil, Sunflower Oil, Corn Oil, Soyabean Oil, Rice Bran Oil, Mustard Oil

Key rules:
1. ALWAYS use the available tools to fetch real data before answering. Never fabricate or assume numbers.
2. Format numeric responses clearly: use ₹ for INR amounts, use lakhs/crores for large numbers (e.g., ₹42.8 Cr).
3. Use markdown tables to present tabular data — they render beautifully in this interface.
4. Use trend indicators: ↑ for positive, ↓ for negative trends vs prior period.
5. After presenting data, always provide 2-3 actionable business insights.
6. Keep responses concise but complete. Lead with the key number/insight, then details.
7. If the user asks about something not covered by your tools, explain what data you can access.
8. Support drill-down queries — when the user asks to "drill down by region/customer/plant", call the appropriate tool with that dimension and present a detailed breakdown.
9. When an order is delayed, proactively suggest alternative travel plans or escalation options.
10. Reference SAP source tables/transactions where applicable (e.g., VBRP, KE24, MARD, ACDOCA, FBL5N).

CHART OUTPUT FORMAT — use this block to render interactive charts alongside your text:
:::chart
{"type":"bar","title":"Revenue by Region","data":[{"name":"North","revenue":82400000},{"name":"South","revenue":74200000}],"xKey":"name","yKey":"revenue"}
:::

Supported chart types: "bar", "line", "pie". Use charts for trend data, comparisons, and distributions. Always also include a markdown table with the same data for accessibility.

You have access to SAP modules: SD (Sales & Billing), MM (Materials & Inventory), CO-PA (Profitability), FI (Finance/GST/AR/AP), LE (Logistics), IBP (Forecasting), and AI Risk Analytics.`;

function hasClaude(): boolean {
  const key = process.env.ANTHROPIC_API_KEY ?? "";
  return key.length > 20 && !key.startsWith("your_") && key.startsWith("sk-");
}

/** Fully local mock response — no API key needed. Fetches real mock SAP data. */
async function mockAiResponse(
  userMessage: string,
  send: (data: object) => void
) {
  // Detect which tool to call based on keywords
  const msg = userMessage.toLowerCase();
  let toolName = "get_profitability_report";
  if (msg.includes("order") && (msg.includes("delay") || msg.includes("status"))) toolName = "get_order_status";
  else if (msg.includes("order") && !msg.includes("profit")) toolName = "get_order_status";
  else if (msg.includes("inventory") || msg.includes("stock") || msg.includes("dead stock") || msg.includes("reorder")) toolName = "get_inventory_levels";
  else if (msg.includes("revenue") || msg.includes("sales")) toolName = "get_revenue_data";
  else if (msg.includes("shipment") || msg.includes("delivery") || msg.includes("tracking")) toolName = "get_shipment_tracking";
  else if (msg.includes("gst") || msg.includes("tax") || msg.includes("mismatch")) toolName = "get_gst_reconciliation";
  else if (msg.includes("forecast") || msg.includes("predict") || msg.includes("next quarter")) toolName = "get_demand_forecast";
  else if (msg.includes("supplier") || msg.includes("vendor")) toolName = "get_supplier_info";
  else if (msg.includes("return") || msg.includes("rma")) toolName = "get_return_order_info";
  else if (msg.includes("cost")) toolName = "get_cost_analysis";
  else if (msg.includes("cash flow") || msg.includes("receivable") || msg.includes("overdue") || msg.includes("aging")) toolName = "get_cash_flow_forecast";
  else if (msg.includes("risk") || msg.includes("alert") || msg.includes("business risk")) toolName = "get_risk_insights";

  send({ type: "tool_call", name: toolName });
  const data = await executeSapTool(toolName, {});
  send({ type: "tool_result", name: toolName });

  // Build a formatted response from the mock data
  const d = data as Record<string, unknown>;
  let response = "";

  if (toolName === "get_profitability_report") {
    const s = d.summary as Record<string, number>;
    response = `## CO-PA Profitability — Tirupathi Oils ↑\n\n**Operating Margin:** ${s.operating_margin_pct}% (↑ +${s.yoy_margin_change}% vs Plan) | **Top Segment:** ${d.top_segment}\n\n`;
    const rows = d.rows as Array<Record<string, unknown>>;
    response += "| Product | Revenue | Margin % | Orders |\n|---------|---------|---------|--------|\n";
    rows.forEach((r) => {
      response += `| ${r.name} | ₹${((r.revenue as number) / 10000000).toFixed(1)}Cr | ${r.margin_pct}% | ${r.orders} |\n`;
    });
    response += `\n:::chart\n${JSON.stringify({ type: "bar", title: "Gross Margin % by Product", data: rows.map((r) => ({ name: r.name, margin: r.margin_pct })), xKey: "name", yKey: "margin" })}\n:::\n`;
    response += "\n**Insights:**\n1. ↑ **Promote** Groundnut Oil & Sunflower Oil — highest margins at 42% and 38%.\n2. **Review** Mustard Oil (18%) and Soyabean Oil (14%) — margins below company average.\n3. **Discontinue consideration:** Corn Oil at 8% margin is dragging overall profitability.\n\n*Source: SAP CO-PA (KE24 / ACDOCA) via Datasphere*";
  } else if (toolName === "get_inventory_levels") {
    const items = d.items as Array<Record<string, unknown>>;
    response = `## Inventory Optimization — Tirupathi Oils\n\n**Dead Stock:** ₹${((d.dead_stock_value as number) / 10000000).toFixed(1)} Cr | **Dead Stock Items:** ${d.dead_stock_items} | **Capital Blocked:** ₹${((d.capital_blocked as number) / 10000000).toFixed(1)} Cr | **Forecast Accuracy:** ${d.forecast_accuracy}\n\n`;
    response += "| Material | Description | Stock Qty | Coverage Days | AI Signal |\n|----------|-------------|-----------|---------------|----------|\n";
    items.forEach((i) => {
      response += `| ${i.material} | ${i.description} | ${i.stock} ${i.unit} | ${i.coverage_days} days | ${i.ai_signal} |\n`;
    });
    response += `\n:::chart\n${JSON.stringify({ type: "bar", title: "Stock Coverage Days by Product", data: items.map((i) => ({ name: i.material, days: i.coverage_days })), xKey: "name", yKey: "days" })}\n:::\n`;
    response += "\n**Insights:**\n1. MAT-001 (Cottonseed Oil) is **Dead Stock** — 210 days coverage. Run a clearance promotion.\n2. MAT-003 (Sunflower Oil) at **8 days** — **Reorder immediately** to prevent stockout.\n3. MAT-005 (Mustard Oil) is low — trigger PO to vendor V-2003 (Rajasthan Mustard Co-op).\n\n*Source: SAP Tables MARD, MARA, MBEW | AI: Demand Forecasting + Turnover Analysis*";
  } else if (toolName === "get_revenue_data" || toolName === "get_demand_forecast") {
    response = `## Predictive Sales Forecast — Tirupathi Oils ↑\n\n**Forecast Revenue:** ₹128 Cr (↑ +8.6% QoQ) | **Confidence Level:** 87% | **Top Growth Driver:** Groundnut Oil (+12%)\n\n`;
    const quarterly = (d.quarterly_forecast ?? d.quarterly) as Array<Record<string, unknown>> | undefined;
    if (quarterly) {
      response += "| Quarter | Revenue |\n|---------|---------|\n";
      quarterly.forEach((q) => {
        response += `| ${q.period} | ₹${((q.revenue as number) / 10000000).toFixed(0)} Cr |\n`;
      });
      response += `\n:::chart\n${JSON.stringify({ type: "bar", title: "Sales Forecast — Trend & Confidence", data: quarterly.map((q) => ({ name: q.period, revenue: q.revenue })), xKey: "name", yKey: "revenue" })}\n:::\n`;
    }
    const bySalesOrg = (d.by_sales_org) as Array<Record<string, unknown>> | undefined;
    if (bySalesOrg) {
      response += "\n### Forecast Breakdown — By Sales Organization\n\n";
      response += "| Sales Org | Forecast Revenue | Growth % | Confidence | Key Driver |\n|-----------|-----------------|----------|------------|------------|\n";
      bySalesOrg.forEach((s) => {
        response += `| ${s.sales_org} | ₹${((s.forecast_revenue as number) / 10000000).toFixed(0)} Cr | +${s.growth_pct}% | ${s.confidence}% | ${s.key_driver} |\n`;
      });
    }
    response += "\n**Insights:**\n1. Q4 forecast at ₹78 Cr shows strong seasonal uptick — ramp up Groundnut & Sunflower Oil production.\n2. NA region leads with ₹52 Cr at 91% confidence — consider expanding distribution.\n3. LATAM at 80% confidence — monitor closely before committing inventory.\n\n*Source: SD Billing (VBRP), LIS + Predictive Model (PAL)*\n*Technical Flow: S/4HANA Sales Data → SAP Datasphere → AI Core Forecast → SAP Analytics Cloud*";
  } else if (toolName === "get_gst_reconciliation") {
    response = `## GST Reconciliation — Tirupathi Oils\n\n**Mismatch:** ₹${((d.total_mismatch as number) / 10000000).toFixed(1)} Cr | **Net GST Liability:** ₹${((d.net_gst_liability as number) / 100000).toFixed(1)}L\n\n`;
    const rows = d.rows as Array<Record<string, unknown>>;
    response += "| Vendor | Invoice Value | Claimed ITC | Eligible ITC | Mismatch |\n|--------|-------------|------------|-------------|----------|\n";
    rows.forEach((r) => {
      const diff = r.diff as number;
      response += `| ${r.party} | ₹${((r.books_amount as number) / 100000).toFixed(0)}L | ₹${((r.books_amount as number) / 100000).toFixed(0)}L | ₹${((r.gst_portal as number) / 100000).toFixed(0)}L | ₹${(diff / 1000).toFixed(0)}K |\n`;
    });
    response += "\n**Insights:**\n1. 3 mismatches with DMart, Spencer's, and More Supermarket — raise queries before GSTR-3B filing.\n2. Total mismatch value of ₹43K is manageable — resolve within this filing cycle.\n3. 3 of 6 customers fully reconciled — good compliance rate.\n\n*Source: FI Invoice Data + GST API reconciliation (GSTR-2A/2B)*";
  } else if (toolName === "get_order_status") {
    response = `## Order Status — Tirupathi Oils\n\n**Total Orders:** ${d.total_orders} | **Open Value:** ₹${((d.open_value as number) / 100000).toFixed(1)}L\n\n`;
    if (d.delayed_orders) {
      response += `⚠️ **Delayed:** ${d.delay_info}\n\n`;
    }
    const orders = d.orders as Array<Record<string, unknown>>;
    response += "| Order ID | Customer | Product | Value | Status |\n|----------|----------|---------|-------|--------|\n";
    orders.forEach((o) => {
      const statusIcon = o.status === "delivered" ? "✅" : o.status === "open" ? "🟡" : "💰";
      response += `| ${o.order_id} | ${o.customer} | ${o.product} | ₹${((o.value as number) / 100000).toFixed(1)}L | ${statusIcon} ${o.status} |\n`;
    });
    response += "\n**Do you want to:**\n- Choose an alternative travel plan for the delayed order?\n- Drill down by customer or product?\n\n*Source: SAP SD — Sales Orders*";
  } else if (toolName === "get_shipment_tracking") {
    response = `## Shipment Tracking — Tirupathi Oils\n\n**On-Time Delivery:** ${d.on_time_delivery_pct}%\n\n`;
    const shipments = d.shipments as Array<Record<string, unknown>>;
    response += "| Delivery | Order | Product | Carrier | Status | ETA |\n|----------|-------|---------|---------|--------|-----|\n";
    shipments.forEach((s) => {
      const statusIcon = s.status === "Delivered" ? "✅" : (s.status as string).includes("Delay") ? "🔴" : "🟡";
      response += `| ${s.delivery_id} | ${s.order} | ${s.product} | ${s.carrier} | ${statusIcon} ${s.status} | ${s.eta} |\n`;
    });
    const alt = d.alternative_travel_plan as Record<string, unknown> | undefined;
    if (alt) {
      response += `\n### ⚠️ Alternative Travel Plans for ${alt.order}\n\n`;
      const alts = alt.alternatives as Array<Record<string, unknown>>;
      response += "| Carrier | New ETA | Cost Delta |\n|---------|---------|------------|\n";
      alts.forEach((a) => {
        response += `| ${a.carrier} | ${a.new_eta} | ${a.cost_delta} |\n`;
      });
      response += "\nWould you like to switch to an alternative carrier? (y/n)";
    }
    response += "\n\n*Source: SAP LE — Logistics Execution*";
  } else if (toolName === "get_cash_flow_forecast") {
    response = `## Cash Flow Forecast — Next ${d.forecast_days} Days\n\n**Inflow:** ₹${((d.inflow as number) / 10000000).toFixed(0)} Cr | **Outflow:** ₹${((d.outflow as number) / 10000000).toFixed(0)} Cr | **Net Gap:** ${d.net_gap_label}\n\n`;
    const aging = d.customer_aging as Array<Record<string, unknown>>;
    response += "### Accounts Receivable Aging — Customer Level\n\n";
    response += "| Customer | Outstanding | Aging Days | Risk Level | Credit Limit |\n|----------|-------------|-----------|------------|-------------|\n";
    aging.forEach((a) => {
      response += `| ${a.customer} | ₹${((a.outstanding as number) / 10000000).toFixed(1)} Cr | ${a.aging_days} Days | ${a.risk_level} | ₹${((a.credit_limit as number) / 10000000).toFixed(0)} Cr |\n`;
    });
    response += `\n**Recommendation:** ${d.recommendation}\n\n*Source: FI-AR Line Items (BSID/ACDOCA), Aging logic via Fiori*`;
  } else if (toolName === "get_risk_insights") {
    response = `## Business Risk Insights — Tirupathi Oils\n\n**Top Risk:** ${d.top_risk}\n\n`;
    const regions = d.by_region as Array<Record<string, unknown>>;
    response += "| Region | Overdue Amount | Avg Delay | Risk Score |\n|--------|---------------|-----------|------------|\n";
    regions.forEach((r) => {
      response += `| ${r.region} | ₹${((r.overdue_amount as number) / 10000000).toFixed(1)} Cr | ${r.avg_delay_days} Days | ${r.risk_score} |\n`;
    });
    const recs = d.recommendations as string[];
    response += "\n**Recommendations:**\n";
    recs.forEach((r, i) => { response += `${i + 1}. ${r}\n`; });
    response += "\n*Source: SAP AI Risk Analytics*";
  } else {
    // Generic fallback
    response = `Here's the data I fetched from SAP for Tirupathi Oils:\n\n\`\`\`json\n${JSON.stringify(d, null, 2).slice(0, 800)}\n\`\`\`\n\n**Note:** This is running in demo mode with mock SAP data. Add your \`ANTHROPIC_API_KEY\` to \`.env.local\` for full AI-powered analysis.`;
  }

  // Stream the response character by character (simulate streaming)
  const chunkSize = 20;
  for (let i = 0; i < response.length; i += chunkSize) {
    send({ type: "message", delta: response.slice(i, i + chunkSize) });
    await new Promise((r) => setTimeout(r, 10));
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages } = body as { messages?: unknown };

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages must be a non-empty array" }, { status: 400 });
  }

  // Validate message structure
  for (const m of messages) {
    if (
      typeof m !== "object" || m === null ||
      !("role" in m) || !("content" in m) ||
      !["user", "assistant"].includes(m.role) ||
      typeof m.content !== "string"
    ) {
      return Response.json({ error: "Each message must have role (user|assistant) and content (string)" }, { status: 400 });
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Demo mode: no Anthropic key → use local mock AI
        if (!hasClaude()) {
          const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
          await mockAiResponse(lastUserMsg?.content ?? "", send);
          send({ type: "done" });
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          return;
        }

        // Real Claude mode
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let loopMessages = [...anthropicMessages];

        while (true) {
          const response = await anthropic.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            tools: SAP_TOOLS,
            messages: loopMessages,
          });

          const toolUseBlocks: Anthropic.ToolUseBlock[] = [];
          const toolResults: Anthropic.ToolResultBlockParam[] = [];

          for (const block of response.content) {
            if (block.type === "tool_use") {
              toolUseBlocks.push(block);
              send({ type: "tool_call", name: block.name, id: block.id });
              const result = await executeSapTool(block.name, block.input as Record<string, unknown>);
              send({ type: "tool_result", name: block.name, id: block.id });
              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: JSON.stringify(result),
              });
            } else if (block.type === "text" && block.text) {
              send({ type: "message", delta: block.text });
            }
          }

          if (toolUseBlocks.length > 0) {
            loopMessages = [
              ...loopMessages,
              { role: "assistant", content: response.content },
              { role: "user", content: toolResults },
            ];
            if (response.stop_reason === "end_turn") break;
            continue;
          }
          break;
        }

        send({ type: "done" });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("[chat/route] error:", err);
        send({ type: "error", message: "An error occurred processing your request." });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
