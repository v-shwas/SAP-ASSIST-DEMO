import { getPrisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getPrisma();
    const messages = await db.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
    });
    return Response.json({ messages });
  } catch {
    return Response.json({ messages: [] });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { role, content, toolCalls } = await request.json();

  // Skip persistence for local-* ids (DB not ready)
  if (id.startsWith("local-")) {
    return Response.json({ message: { id: `msg-${Date.now()}`, role, content } });
  }

  try {
    const db = getPrisma();
    const message = await db.message.create({
      data: { conversationId: id, role, content, toolCalls },
    });

    const conversation = await db.conversation.findUnique({ where: { id } });
    if (role === "user" && conversation?.title === "New Conversation") {
      await db.conversation.update({
        where: { id },
        data: { title: content.slice(0, 60), updatedAt: new Date() },
      });
    } else {
      await db.conversation.update({ where: { id }, data: { updatedAt: new Date() } });
    }

    return Response.json({ message });
  } catch {
    return Response.json({ message: { id: `msg-${Date.now()}`, role, content } });
  }
}
