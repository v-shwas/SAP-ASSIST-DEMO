"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

export function ChatWindow({ onSendMessage, messages, isLoading }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await onSendMessage(text);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-4 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Tirupathi Oils — SAP Assistant</h2>
              <p className="text-sm text-slate-500 mt-1">
                Ask Joule about your sales, inventory, profitability, cash flow, or any SAP data.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl w-full">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setInput(action);
                    onSendMessage(action);
                  }}
                  className="text-left text-sm px-4 py-3 rounded-xl border bg-white hover:border-blue-300 hover:bg-blue-50 transition-colors text-slate-600"
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
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}
