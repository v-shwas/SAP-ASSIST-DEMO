/**
 * Tenant resolution — demo mode uses a single hardcoded tenant.
 * In production, integrate with your auth provider here.
 */

export interface TenantContext {
  tenantId: string;
  userId: string;
}

export async function resolveTenant(): Promise<TenantContext> {
  return { tenantId: "demo", userId: "demo" };
}
