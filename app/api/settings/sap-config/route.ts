import { z } from "zod";

const ConfigSchema = z.object({
  sapUrl: z.string().url(),
  sapUsername: z.string().min(1),
  sapPassword: z.string().min(1),
  sapClient: z.string().default("100"),
  connType: z.enum(["odata", "rfc"]).default("odata"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ConfigSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid config" }, { status: 400 });
  }
  // In a real deployment, this would persist to DB with encryption.
  // For demo mode, just acknowledge the save.
  return Response.json({ saved: true });
}

export async function GET() {
  return Response.json({ configured: false });
}
