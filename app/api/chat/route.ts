import Anthropic from "@anthropic-ai/sdk";
import { SAP_TOOLS } from "@/lib/sap-tools";
import { executeSapTool } from "@/lib/sap-client";

const SYSTEM_PROMPT = `You are an expert SAP data analyst assistant. You help business users query live SAP data and understand their business operations.

Key rules:
1. ALWAYS use the available tools to fetch real data before answering. Never fabricate or assume numbers.
2. Format numeric responses clearly: use ₹ for INR amounts, use lakhs/crores for large numbers (e.g., ₹42.8 Cr).
3. Use markdown tables to present tabular data — they render beautifully in this interface.
4. Use trend indicators: ↑ for positive, ↓ for negative trends vs prior period.
5. After presenting data, always provide 2-3 actionable business insights.
6. Keep responses concise but complete. Lead with the key number/insight, then details.
7. If the user asks about something not covered by your tools, explain what data you can access.

CHART OUTPUT FORMAT — use this block to render interactive charts alongside your text:
:::chart
{"type":"bar","title":"Revenue by Region","data":[{"name":"North","revenue":82400000},{"name":"South","revenue":74200000}],"xKey":"name","yKey":"revenue"}
:::

Supported chart types: "bar", "line", "pie". Use charts for trend data, comparisons, and distributions. Always also include a markdown table with the same data for accessibility.

You have access to SAP modules: SD (Sales), MM (Materials), CO-PA (Profitability), FI (Finance/GST), LE (Logistics), IBP (Forecasting).`;

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
  if (msg.includes("order") && !msg.includes("profit")) toolName = "get_order_status";
  else if (msg.includes("inventory") || msg.includes("stock")) toolName = "get_inventory_levels";
  else if (msg.includes("revenue") || msg.includes("sales")) toolName = "get_revenue_data";
  else if (msg.includes("shipment") || msg.includes("delivery")) toolName = "get_shipment_tracking";
  else if (msg.includes("gst") || msg.includes("tax")) toolName = "get_gst_reconciliation";
  else if (msg.includes("forecast") || msg.includes("predict")) toolName = "get_demand_forecast";
  else if (msg.includes("supplier") || msg.includes("vendor")) toolName = "get_supplier_info";
  else if (msg.includes("return") || msg.includes("rma")) toolName = "get_return_order_info";
  else if (msg.includes("cost")) toolName = "get_cost_analysis";

  send({ type: "tool_call", name: toolName });
  const data = await executeSapTool(toolName, {});
  send({ type: "tool_result", name: toolName });

  // Build a formatted response from the mock data
  const d = data as Record<string, unknown>;
  let response = "";

  if (toolName === "get_profitability_report") {
    const s = d.summary as Record<string, number>;
    response = `## Q1 Order Profitability ↑\n\n**Total Revenue:** ₹${(s.total_revenue / 10000000).toFixed(1)} Cr | **Gross Margin:** ${s.gross_margin_pct}% (+${s.yoy_margin_change}% YoY)\n\n`;
    const rows = d.rows as Array<Record<string, unknown>>;
    response += "| Product | Revenue | Margin % | Orders |\n|---------|---------|---------|--------|\n";
    rows.forEach((r) => {
      response += `| ${r.name} | ₹${((r.revenue as number) / 10000000).toFixed(1)}Cr | ${r.margin_pct}% | ${r.orders} |\n`;
    });
    response += `\n:::chart\n${JSON.stringify({ type: "bar", title: "Profitability by Product", data: rows.map((r) => ({ name: r.name, revenue: r.revenue })), xKey: "name", yKey: "revenue" })}\n:::\n`;
    response += "\n**Insights:**\n1. ↑ Compressors lead at 39.1% margin — consider expanding this line.\n2. Pressure Vessels at 31.1% are below average — review costing.\n3. Overall margin improvement of 2.1% YoY is on track with targets.";
  } else if (toolName === "get_inventory_levels") {
    const items = d.items as Array<Record<string, unknown>>;
    const alerts = items.filter((i) => i.alert);
    response = `## Inventory Status\n\n⚠️ **${d.alert_count} SKUs** below safety stock out of ${d.total_skus} total.\n\n`;
    response += "| Material | Description | Stock | Safety Stock | Status |\n|----------|-------------|-------|-------------|--------|\n";
    items.forEach((i) => {
      const status = i.alert ? "🔴 Alert" : "✅ OK";
      response += `| ${i.material} | ${i.description} | ${i.stock} | ${i.safety_stock} | ${status} |\n`;
    });
    response += `\n**Insights:**\n1. ${alerts.map((a) => a.material).join(", ")} need immediate replenishment.\n2. METER-006 has 67 units vs 40 safety stock — consider redeployment.\n3. Set up automatic PO triggers for items at <120% of safety stock.`;
  } else if (toolName === "get_revenue_data") {
    const trend = d.trend as Array<Record<string, number>>;
    response = `## Revenue Performance ↑\n\n**YTD Revenue:** ₹${((d.ytd_revenue as number) / 10000000).toFixed(1)} Cr | **Target Achievement:** ${d.achievement_pct}%\n\n`;
    response += "| Period | Revenue | Target | YoY Growth |\n|--------|---------|--------|------------|\n";
    trend.forEach((t) => {
      const r = t as Record<string, unknown>;
      response += `| ${r.period} | ₹${((r.revenue as number) / 10000000).toFixed(1)}Cr | ₹${((r.target as number) / 10000000).toFixed(1)}Cr | +${r.yoy_growth}% |\n`;
    });
    response += `\n:::chart\n${JSON.stringify({ type: "line", title: "Monthly Revenue Trend", data: trend.map((t) => ({ name: t.period as unknown as string, revenue: t.revenue })), xKey: "name", yKey: "revenue" })}\n:::\n`;
    response += "\n**Insights:**\n1. ↑ Consistently beating targets — review if targets need upward revision.\n2. May shows strongest YoY growth at 15.2% — identify what drove this.\n3. North region leads with 30.8% share — double down on top performers.";
  } else if (toolName === "get_gst_reconciliation") {
    response = `## GST Reconciliation Status\n\n**Net GST Liability:** ₹${((d.net_gst_liability as number) / 100000).toFixed(1)}L | **Mismatches:** ${d.mismatches} records (₹${((d.mismatch_value as number) / 1000).toFixed(0)}K)\n\n`;
    const rows = d.rows as Array<Record<string, unknown>>;
    response += "| GSTIN | Party | Books (₹) | Portal (₹) | Diff | Status |\n|-------|-------|-----------|-----------|------|--------|\n";
    rows.forEach((r) => {
      const status = r.status === "Matched" ? "✅" : "⚠️";
      response += `| ${(r.gstin as string).slice(0, 12)}... | ${r.party} | ${((r.books_amount as number) / 100000).toFixed(1)}L | ${((r.gst_portal as number) / 100000).toFixed(1)}L | ${r.diff} | ${status} ${r.status} |\n`;
    });
    response += "\n**Insights:**\n1. 2 mismatches with Tata Steel and L&T — raise queries immediately.\n2. Total mismatch value of ₹40K is manageable — resolve before filing.\n3. 4 of 6 vendors are fully reconciled — good compliance rate.";
  } else {
    // Generic fallback
    response = `Here's the data I fetched from SAP:\n\n\`\`\`json\n${JSON.stringify(d, null, 2).slice(0, 800)}\n\`\`\`\n\n**Note:** This is running in demo mode with mock SAP data. Add your \`ANTHROPIC_API_KEY\` to \`.env.local\` for full AI-powered analysis.`;
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
