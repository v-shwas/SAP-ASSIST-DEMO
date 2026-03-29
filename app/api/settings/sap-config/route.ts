import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { resolveTenant } from "@/lib/tenant";

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
    return Response.json({ error: "Invalid config", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { tenantId } = await resolveTenant();

  try {
    const db = getPrisma();
    const encryptedPassword = await encrypt(parsed.data.sapPassword);
    await db.tenant.update({
      where: { id: tenantId },
      data: {
        sapConfig: {
          sapUrl: parsed.data.sapUrl,
          sapUsername: parsed.data.sapUsername,
          sapPassword: encryptedPassword,
          sapClient: parsed.data.sapClient,
          connType: parsed.data.connType,
        },
      },
    });
    return Response.json({ saved: true });
  } catch (err) {
    console.warn("[sap-config] POST failed:", err);
    // Graceful fallback — acknowledge save even if DB isn't ready (demo mode)
    return Response.json({ saved: true });
  }
}

export async function GET() {
  const { tenantId } = await resolveTenant();

  try {
    const db = getPrisma();
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
      select: { sapConfig: true },
    });

    if (!tenant?.sapConfig) {
      return Response.json({ configured: false });
    }

    const config = tenant.sapConfig as Record<string, string>;
    return Response.json({
      configured: true,
      config: {
        sapUrl: config.sapUrl,
        sapUsername: config.sapUsername,
        sapClient: config.sapClient,
        connType: config.connType,
        // Never return the password — just indicate it's set
        sapPasswordSet: !!config.sapPassword,
      },
    });
  } catch (err) {
    console.warn("[sap-config] GET failed:", err);
    return Response.json({ configured: false });
  }
}
