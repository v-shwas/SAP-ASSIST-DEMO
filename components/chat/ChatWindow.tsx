"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble, type Message } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { Sparkles } from "lucide-react";

const QUICK_ACTIONS = [
  "Predict next quarter sales by product and region",
  "What is my order profitability?",
  "Show inventory optimization insights",
  "Why is my order delayed?",
  "Show cash flow forecast next 60 days",
  "Show GST mismatch summary",
  "Show business risks this month",
  "Identify dead stock items and recommend reorder levels",
];

interface ChatWindowProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
        AI
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border bg-white px-4 py-3 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
      </div>
    </div>
  );
}

export function ChatWindow({ onSendMessage, messages, isLoading }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await onSendMessage(text);
  };

  // Show the thinking dots while waiting for the first token / tool call.
  const lastMessage = messages[messages.length - 1];
  const showTyping =
    isLoading &&
    lastMessage?.role === "assistant" &&
    !lastMessage.content &&
    (lastMessage.toolCalls?.length ?? 0) === 0;

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center space-y-6 px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-100">
              <Sparkles className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Tirupathi Oils — SAP Assistant</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ask about your sales, inventory, profitability, cash flow, or any SAP data.
              </p>
            </div>
            <div className="grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setInput("");
                    onSendMessage(action);
                  }}
                  disabled={isLoading}
                  className="rounded-xl border bg-white px-4 py-3 text-left text-sm text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {showTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
