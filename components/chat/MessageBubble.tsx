"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ToolCallIndicator } from "./ToolCallIndicator";
import { ChartWidget, parseChartBlocks } from "./ChartWidget";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: Array<{ name: string; status: "running" | "done" }>;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 px-4", isUser ? "justify-end" : "justify-start")}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white shrink-0 mt-1">
          AI
        </div>
      )}

      <div className={cn("flex flex-col gap-1.5 max-w-[80%]", isUser && "items-end")}>
        {/* Tool call indicators */}
        {message.toolCalls?.map((tc, i) =>
          tc.status === "running" ? (
            <ToolCallIndicator key={i} toolName={tc.name} />
          ) : null
        )}

        {/* Message content */}
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              isUser
                ? "bg-blue-600 text-white rounded-tr-sm"
                : "bg-white border text-slate-800 rounded-tl-sm shadow-sm"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="space-y-0">
                {parseChartBlocks(message.content).map((part, i) =>
                  part.type === "chart" ? (
                    <ChartWidget key={i} config={part.value as Parameters<typeof ChartWidget>[0]["config"]} />
                  ) : (
                    <div key={i} className="prose prose-sm max-w-none prose-table:text-xs">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-3">
                              <table className="min-w-full border-collapse text-xs">{children}</table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-left font-medium">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="border border-slate-200 px-3 py-1.5">{children}</td>
                          ),
                          tr: ({ children, ...props }) => (
                            <tr className="even:bg-slate-50/50" {...props}>{children}</tr>
                          ),
                          code: ({ children, className }) => {
                            const isBlock = className?.includes("language-");
                            return isBlock ? (
                              <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto my-2">
                                <code className="text-xs">{children}</code>
                              </pre>
                            ) : (
                              <code className="bg-slate-100 text-slate-800 rounded px-1 py-0.5 text-xs">
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {part.value as string}
                      </ReactMarkdown>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs shrink-0 mt-1">
          You
        </div>
      )}
    </div>
  );
}
