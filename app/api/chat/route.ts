import Groq from "groq-sdk";
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

// OpenAI-compatible tool definitions for Groq
const TOOLS: Groq.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_profitability_report",
      description: "Retrieves order profitability data from SAP CO-PA including revenue, cost, and margin by product, customer, or region.",
      parameters: {
        type: "object",
        properties: {
          period: { type: "string", description: "Period in YYYY-QN or YYYY-MM format" },
          dimension: { type: "string", description: "Grouping dimension: product, customer, region, or plant" },
          top_n: { type: "string", description: "Return top N results (default 7), pass as number string e.g. '7'" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_revenue_data",
      description: "Retrieves revenue data from SAP SD, broken down by period, region, or product line with YoY comparison.",
      parameters: {
        type: "object",
        properties: {
          period: { type: "string", description: "Period e.g. '2026-Q1', 'YTD'" },
          region: { type: "string", description: "Region filter, e.g. 'South', 'All'" },
          granularity: { type: "string", description: "Time granularity: monthly, quarterly, yearly" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_cost_analysis",
      description: "Fetches cost center and cost element analysis from SAP CO, including variances.",
      parameters: {
        type: "object",
        properties: {
          cost_center: { type: "string", description: "Cost center ID or 'All'" },
          period: { type: "string", description: "Period in YYYY-QN or YYYY-MM" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_status",
      description: "Gets current status of sales orders from SAP SD, including delivery and billing status. Also shows delayed orders.",
      parameters: {
        type: "object",
        properties: {
          order_id: { type: "string", description: "Specific order ID, or omit for recent orders" },
          status_filter: { type: "string", description: "Filter: open, delivered, billed, or all" },
          limit: { type: "string", description: "Number of orders to return (default 10), pass as number string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_shipment_tracking",
      description: "Tracks outbound deliveries and shipments from SAP LE/WM. Shows delayed shipments with alternative travel plans.",
      parameters: {
        type: "object",
        properties: {
          delivery_id: { type: "string", description: "Specific delivery ID" },
          date_range: { type: "string", description: "Date range e.g. 'last_7_days'" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_return_order_info",
      description: "Retrieves return order (RMA) data from SAP SD including reason codes and status.",
      parameters: {
        type: "object",
        properties: {
          period: { type: "string", description: "Period filter" },
          reason_code: { type: "string", description: "Filter by return reason code" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_inventory_levels",
      description: "Fetches current stock levels from SAP MM/WM, including safety stock alerts, dead stock, and AI signals for each item.",
      parameters: {
        type: "object",
        properties: {
          material: { type: "string", description: "Material number or 'all'" },
          plant: { type: "string", description: "Plant code or 'all'" },
          alert_only: { type: "string", description: "If 'true', return only items with alerts" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_supplier_info",
      description: "Gets supplier/vendor master data and performance metrics from SAP MM.",
      parameters: {
        type: "object",
        properties: {
          vendor_id: { type: "string", description: "Vendor ID or omit for all" },
          include_performance: { type: "string", description: "If 'true', include delivery reliability and quality scores" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_demand_forecast",
      description: "Retrieves demand forecast from SAP using Prophet/LSTM/SAC Smart Predict models.",
      parameters: {
        type: "object",
        properties: {
          material: { type: "string", description: "Material number" },
          horizon_months: { type: "string", description: "Forecast horizon in months (default 3), pass as number string" },
          region: { type: "string", description: "Region filter" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "run_analytics_query",
      description: "Runs a flexible analytics query against SAP BW/HANA CDS views for ad-hoc analysis.",
      parameters: {
        type: "object",
        properties: {
          metric: { type: "string", description: "KPI: 'revenue', 'margin', 'stock_turns'" },
          period: { type: "string", description: "Period filter" },
        },
        required: ["metric"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_gst_reconciliation",
      description: "Fetches GST input/output tax reconciliation from SAP FI-Tax, comparing books vs GSTN portal data.",
      parameters: {
        type: "object",
        properties: {
          period: { type: "string", description: "GST return period e.g. 'Mar-2026'" },
          gstin: { type: "string", description: "GSTIN number, or omit for all" },
          mismatch_only: { type: "string", description: "If 'true', return only mismatched items" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_cash_flow_forecast",
      description: "Retrieves cash flow forecast from SAP FI AR/AP, including accounts receivable aging by customer.",
      parameters: {
        type: "object",
        properties: {
          days: { type: "string", description: "Forecast horizon in days (default 60), pass as number string" },
          drill_down: { type: "string", description: "Drill down: customer or region" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_risk_insights",
      description: "Retrieves AI-powered business risk insights including receivable delays and regional risk scores.",
      parameters: {
        type: "object",
        properties: {
          drill_down: { type: "string", description: "Drill down: region, customer, or product" },
        },
      },
    },
  },
];

/** Coerce string values back to numbers/booleans for the data layer */
function coerceArgs(args: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(args)) {
    if (typeof v === "string") {
      if (v === "true") { out[k] = true; continue; }
      if (v === "false") { out[k] = false; continue; }
      const n = Number(v);
      if (!isNaN(n) && v.trim() !== "") { out[k] = n; continue; }
    }
    out[k] = v;
  }
  return out;
}

function hasGroq(): boolean {
  const key = process.env.GROQ_API_KEY ?? "";
  return key.length > 10 && !key.startsWith("your_");
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

  if (!hasGroq()) {
    return Response.json(
      { error: "GROQ_API_KEY is not configured. Add your Groq API key to .env.local" },
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
        const modelId = process.env.GROQ_MODEL ?? "meta-llama/llama-4-scout-17b-16e-instruct";
        const supportsParallelToolCalls = !modelId.includes("llama-3.3");

        // Build message history in OpenAI format
        const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ];

        const MAX_TOOL_ROUNDS = 5;
        let round = 0;

        while (round < MAX_TOOL_ROUNDS) {
          const response = await groq.chat.completions.create({
            model: modelId,
            messages: groqMessages,
            tools: TOOLS,
            tool_choice: "auto",
            parallel_tool_calls: supportsParallelToolCalls,
            max_tokens: 4096,
          });

          const choice = response.choices[0];
          if (!choice) break;

          const assistantMsg = choice.message;

          // If the model wants to call tools
          if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
            // Send any partial text the model included alongside tool calls
            if (assistantMsg.content) {
              send({ type: "message", delta: assistantMsg.content });
            }

            // Add the assistant message (with tool_calls) to history
            groqMessages.push(assistantMsg);

            // Execute each tool call and add results
            for (const toolCall of assistantMsg.tool_calls) {
              const fnName = toolCall.function.name;
              let fnArgs: Record<string, unknown> = {};
              try {
                fnArgs = JSON.parse(toolCall.function.arguments || "{}");
              } catch {
                // invalid JSON args — use empty
              }

              send({ type: "tool_call", name: fnName, id: toolCall.id });
              const result = await executeSapTool(fnName, coerceArgs(fnArgs));
              send({ type: "tool_result", name: fnName, id: toolCall.id });

              groqMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result),
              });
            }

            round++;
            continue;
          }

          // No tool calls — this is the final text response
          const fullText = assistantMsg.content ?? "";
          if (fullText) {
            const chunkSize = 40;
            for (let i = 0; i < fullText.length; i += chunkSize) {
              send({ type: "message", delta: fullText.slice(i, i + chunkSize) });
            }
          } else {
            send({ type: "message", delta: "I wasn't able to generate a response. Please try rephrasing your question." });
          }
          break;
        }

        send({ type: "done" });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("[chat/route] error:", err);
        const message = err instanceof Error
          ? `${err.message}${err.cause ? ` (cause: ${err.cause})` : ""}`
          : "An error occurred processing your request.";
        send({ type: "message", delta: `**Error:** ${message}` });
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
