"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    } as any) as any;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-2xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((m: any) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                m.role === "user"
                  ? "bg-violet-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70">
                <span className="text-xs font-medium">
                  {m.role === "user" ? "You" : "AI Assistant"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-bl-none border border-slate-700 p-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-700 flex gap-3 sticky bottom-0"
      >
        <input
          className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-violet-900/20"
        >
          Send
        </button>
      </form>
    </div>
  );
}
