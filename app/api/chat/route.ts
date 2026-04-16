import { GoogleGenerativeAI, SchemaType, type FunctionDeclaration, type Content, type Part } from "@google/generative-ai";
import { executeSapTool } from "@/lib/sap-client";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are Joule, the AI assistant for Tirupathi Oils — an edible oil manufacturing company.

Company: Tirupathi Oils
Products: Cottonseed Oil, Groundnut Oil, Sunflower Oil, Corn Oil, Soyabean Oil, Rice Bran Oil, Mustard Oil

CRITICAL: You MUST call the provided tools to fetch data. NEVER ask the user for clarification before calling a tool — use sensible defaults. For example, if the user asks "What is my order profitability?", immediately call get_profitability_report with no parameters (defaults will be used).

Rules:
- ALWAYS call tools first, then present the results. Do NOT ask follow-up questions before fetching data.
- Format: use ₹ for INR, lakhs/crores for large numbers (e.g., ₹42.8 Cr).
- Use markdown tables for tabular data.
- Use ↑ for positive, ↓ for negative trends.
- Provide 2-3 actionable insights after presenting data.
- Support drill-down: when user says "drill down by X", call the tool with that dimension.
- When an order is delayed, suggest alternative options.
- Reference SAP source tables/transactions where applicable (e.g., VBRP, KE24, MARD, ACDOCA, FBL5N).

CHART FORMAT — render charts like this:
:::chart
{"type":"bar","title":"Title","data":[{"name":"A","value":100}],"xKey":"name","yKey":"value"}
:::

Supported chart types: bar, line, pie. Include a markdown table alongside each chart.`;

const GEMINI_TOOLS: FunctionDeclaration[] = [
  {
    name: "get_profitability_report",
    description: "Retrieves order profitability data from SAP CO-PA including revenue, cost, and margin by product, customer, or region.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        period: { type: SchemaType.STRING, description: "Period in YYYY-QN or YYYY-MM format" },
        dimension: { type: SchemaType.STRING, description: "Grouping dimension: product, customer, region, or plant" },
        top_n: { type: SchemaType.NUMBER, description: "Return top N results (default 7)" },
      },
    },
  },
  {
    name: "get_revenue_data",
    description: "Retrieves revenue data from SAP SD, broken down by period, region, or product line with YoY comparison.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        period: { type: SchemaType.STRING, description: "Period e.g. '2026-Q1', 'YTD'" },
        region: { type: SchemaType.STRING, description: "Region filter, e.g. 'South', 'All'" },
        granularity: { type: SchemaType.STRING, description: "Time granularity: monthly, quarterly, yearly" },
      },
    },
  },
  {
    name: "get_cost_analysis",
    description: "Fetches cost center and cost element analysis from SAP CO, including variances.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        cost_center: { type: SchemaType.STRING, description: "Cost center ID or 'All'" },
        period: { type: SchemaType.STRING, description: "Period in YYYY-QN or YYYY-MM" },
      },
    },
  },
  {
    name: "get_order_status",
    description: "Gets current status of sales orders from SAP SD, including delivery and billing status. Also shows delayed orders.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        order_id: { type: SchemaType.STRING, description: "Specific order ID, or omit for recent orders" },
        status_filter: { type: SchemaType.STRING, description: "Filter: open, delivered, billed, or all" },
        limit: { type: SchemaType.NUMBER, description: "Number of orders to return (default 10)" },
      },
    },
  },
  {
    name: "get_shipment_tracking",
    description: "Tracks outbound deliveries and shipments from SAP LE/WM. Shows delayed shipments with alternative travel plans.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        delivery_id: { type: SchemaType.STRING, description: "Specific delivery ID" },
        date_range: { type: SchemaType.STRING, description: "Date range e.g. 'last_7_days'" },
      },
    },
  },
  {
    name: "get_return_order_info",
    description: "Retrieves return order (RMA) data from SAP SD including reason codes and status.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        period: { type: SchemaType.STRING, description: "Period filter" },
        reason_code: { type: SchemaType.STRING, description: "Filter by return reason code" },
      },
    },
  },
  {
    name: "get_inventory_levels",
    description: "Fetches current stock levels from SAP MM/WM, including safety stock alerts, dead stock, and AI signals for each item.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        material: { type: SchemaType.STRING, description: "Material number or 'all'" },
        plant: { type: SchemaType.STRING, description: "Plant code or 'all'" },
        alert_only: { type: SchemaType.BOOLEAN, description: "If true, return only items with alerts" },
      },
    },
  },
  {
    name: "get_supplier_info",
    description: "Gets supplier/vendor master data and performance metrics from SAP MM.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        vendor_id: { type: SchemaType.STRING, description: "Vendor ID or omit for all" },
        include_performance: { type: SchemaType.BOOLEAN, description: "Include delivery reliability and quality scores" },
      },
    },
  },
  {
    name: "get_demand_forecast",
    description: "Retrieves demand forecast from SAP using Prophet/LSTM/SAC Smart Predict models.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        material: { type: SchemaType.STRING, description: "Material number" },
        horizon_months: { type: SchemaType.NUMBER, description: "Forecast horizon in months (default 3)" },
        region: { type: SchemaType.STRING, description: "Region filter" },
      },
    },
  },
  {
    name: "run_analytics_query",
    description: "Runs a flexible analytics query against SAP BW/HANA CDS views for ad-hoc analysis.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        metric: { type: SchemaType.STRING, description: "KPI: 'revenue', 'margin', 'stock_turns'" },
        period: { type: SchemaType.STRING, description: "Period filter" },
      },
      required: ["metric"],
    },
  },
  {
    name: "get_gst_reconciliation",
    description: "Fetches GST input/output tax reconciliation from SAP FI-Tax, comparing books vs GSTN portal data.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        period: { type: SchemaType.STRING, description: "GST return period e.g. 'Mar-2026'" },
        gstin: { type: SchemaType.STRING, description: "GSTIN number, or omit for all" },
        mismatch_only: { type: SchemaType.BOOLEAN, description: "Return only mismatched items" },
      },
    },
  },
  {
    name: "get_cash_flow_forecast",
    description: "Retrieves cash flow forecast from SAP FI AR/AP, including accounts receivable aging by customer.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        days: { type: SchemaType.NUMBER, description: "Forecast horizon in days (default 60)" },
        drill_down: { type: SchemaType.STRING, description: "Drill down: customer or region" },
      },
    },
  },
  {
    name: "get_risk_insights",
    description: "Retrieves AI-powered business risk insights including receivable delays and regional risk scores.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        drill_down: { type: SchemaType.STRING, description: "Drill down: region, customer, or product" },
      },
    },
  },
];

function hasGemini(): boolean {
  const key = process.env.GEMINI_API_KEY ?? "";
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

  if (!hasGemini()) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured. Add your Gemini API key to .env.local" },
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
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations: GEMINI_TOOLS }],
        });

        // Convert messages to Gemini format
        const geminiHistory: Content[] = [];
        for (const m of messages.slice(0, -1)) {
          geminiHistory.push({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          });
        }

        const lastUserMsg = messages[messages.length - 1];
        const chat = model.startChat({ history: geminiHistory });

        let response = await chat.sendMessage(lastUserMsg.content);
        let candidate = response.response.candidates?.[0];

        // Tool use loop
        const MAX_TOOL_ROUNDS = 5;
        let round = 0;

        while (candidate && round < MAX_TOOL_ROUNDS) {
          const functionCalls = candidate.content?.parts?.filter(
            (p: Part) => "functionCall" in p
          );

          if (!functionCalls || functionCalls.length === 0) break;

          const functionResponses: Part[] = [];

          for (const part of functionCalls) {
            if (!("functionCall" in part) || !part.functionCall) continue;
            const { name, args } = part.functionCall;

            send({ type: "tool_call", name });
            const result = await executeSapTool(name, (args ?? {}) as Record<string, unknown>);
            send({ type: "tool_result", name });

            functionResponses.push({
              functionResponse: {
                name,
                response: result as object,
              },
            });
          }

          response = await chat.sendMessage(functionResponses);
          candidate = response.response.candidates?.[0];
          round++;
        }

        // Extract final text
        const textParts = candidate?.content?.parts?.filter((p: Part) => "text" in p) ?? [];
        const fullText = textParts.map((p: Part) => ("text" in p ? p.text : "")).join("");

        if (fullText) {
          const chunkSize = 40;
          for (let i = 0; i < fullText.length; i += chunkSize) {
            send({ type: "message", delta: fullText.slice(i, i + chunkSize) });
          }
        } else {
          send({ type: "message", delta: "I wasn't able to generate a response. Please try rephrasing your question." });
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
