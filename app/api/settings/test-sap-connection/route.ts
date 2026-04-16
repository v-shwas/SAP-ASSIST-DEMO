export const maxDuration = 15;

export async function POST(request: Request) {
  const { sapUrl, sapUsername, sapPassword, sapClient, connType } = await request.json();

  const connectorUrl = process.env.SAP_CONNECTOR_URL ?? "http://localhost:8000";
  const secret = process.env.SAP_CONNECTOR_SECRET ?? "";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(`${connectorUrl}/test-connection`, {
      method: "POST",
      headers: {
        "X-Connector-Secret": secret,
        "X-SAP-URL": sapUrl,
        "X-SAP-USER": sapUsername,
        "X-SAP-PASS": sapPassword,
        "X-SAP-CLIENT": sapClient ?? "100",
        "X-SAP-CONN-TYPE": connType ?? "odata",
      },
      signal: controller.signal,
    });
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError";
    return Response.json({
      connected: false,
      error: timedOut ? "SAP connector timed out" : "Could not reach SAP connector service",
    });
  } finally {
    clearTimeout(timer);
  }
}
