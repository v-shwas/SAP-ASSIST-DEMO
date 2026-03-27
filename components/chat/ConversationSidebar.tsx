"use client";

import { useEffect, useState } from "react";
import { MessageSquarePlus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface ConversationSidebarProps {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function ConversationSidebar({ activeId, onSelect, onNew }: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const refresh = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations);
      }
    } catch {
      // silently fail — sidebar is non-critical
    }
  };

  useEffect(() => {
    refresh();
  }, [activeId]);

  return (
    <aside className="w-56 border-r bg-white flex flex-col h-full shrink-0 hidden lg:flex">
      <div className="p-3 border-b">
        <Button size="sm" className="w-full gap-2" onClick={onNew}>
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {conversations.length === 0 ? (
          <p className="text-xs text-slate-400 px-2 py-3 text-center">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "w-full text-left px-2 py-2 rounded-lg text-xs truncate flex items-center gap-2 transition-colors",
                activeId === conv.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <MessageSquare className="h-3 w-3 shrink-0 opacity-60" />
              <span className="truncate">{conv.title}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
