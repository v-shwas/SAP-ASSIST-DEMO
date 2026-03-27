import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const db = getPrisma();
    const conversations = await db.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: { id: true, title: true, updatedAt: true },
    });
    return Response.json({ conversations });
  } catch {
    // DB not ready yet — return empty list gracefully
    return Response.json({ conversations: [] });
  }
}

export async function POST(request: Request) {
  const { title } = await request.json();
  try {
    const db = getPrisma();
    const conversation = await db.conversation.create({
      data: {
        tenantId: "demo",
        userId: "demo",
        title: title ?? "New Conversation",
      },
    });
    return Response.json({ conversation });
  } catch {
    // DB not ready — return a fake id so the chat still works
    return Response.json({ conversation: { id: `local-${Date.now()}`, title } });
  }
}
