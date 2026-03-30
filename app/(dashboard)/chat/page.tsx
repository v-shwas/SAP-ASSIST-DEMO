"use client";

import { useState, useCallback } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import type { Message } from "@/components/chat/MessageBubble";

let idCounter = 0;
const newId = () => `msg-${++idCounter}`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  const loadConversation = async (id: string) => {
    setConversationId(id);
    setMessages([]);
    try {
      const res = await fetch(`/api/conversations/${id}/messages`);
      if (res.ok) {
        const { messages: saved } = await res.json();
        setMessages(
          saved.map((m: { id: string; role: "user" | "assistant"; content: string }) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          }))
        );
      }
    } catch (err) {
      console.warn("[chat] failed to load conversation:", err);
    }
  };

  const persistMessage = async (
    convId: string,
    role: "user" | "assistant",
    content: string
  ) => {
    try {
      await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, content }),
      });
    } catch (err) {
      console.warn("[chat] failed to persist message:", err);
    }
  };

  const handleSendMessage = useCallback(
    async (text: string) => {
      // Create conversation on first message
      let convId = conversationId;
      if (!convId) {
        try {
          const res = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: text.slice(0, 60) }),
          });
          if (res.ok) {
            const data = await res.json();
            convId = data.conversation.id;
            setConversationId(convId);
          }
        } catch (err) {
          console.warn("[chat] failed to create conversation:", err);
        }
      }

      const userMsg: Message = { id: newId(), role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      if (convId) await persistMessage(convId, "user", text);

      const assistantId = newId();
      let assistantContent = "";

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", toolCalls: [] },
      ]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.error ?? `Request failed (${res.status})`);
        }
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;

            try {
              const event = JSON.parse(data);
              if (event.type === "tool_call") {
                const callId = event.id ?? event.name;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, toolCalls: [...(m.toolCalls ?? []), { name: event.name, id: callId, status: "running" as const }] }
                      : m
                  )
                );
              } else if (event.type === "tool_result") {
                const callId = event.id ?? event.name;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          toolCalls: (m.toolCalls ?? []).map((tc) =>
                            (tc.id ?? tc.name) === callId ? { ...tc, status: "done" as const } : tc
                          ),
                        }
                      : m
                  )
                );
              } else if (event.type === "message") {
                assistantContent += event.delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  )
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }

        if (convId && assistantContent) {
          await persistMessage(convId, "assistant", assistantContent);
        }
      } catch (err) {
        console.error("[chat] error:", err);
        const errMsg = err instanceof Error && err.message !== "Request failed"
          ? `Error: ${err.message}`
          : "Sorry, something went wrong. Please try again.";
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: errMsg } : m))
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, conversationId]
  );

  return (
    <div className="flex h-full overflow-hidden">
      <ConversationSidebar
        activeId={conversationId}
        onSelect={loadConversation}
        onNew={startNewConversation}
      />
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
