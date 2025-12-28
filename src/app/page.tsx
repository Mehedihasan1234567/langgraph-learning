"use client";

import { useState, useRef, useEffect } from "react";
import { chatAction } from "@/actions/chatAction";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const aiReply = await chatAction(userMessage);
      
      if (aiReply.success) {
        setMessages((prev) => [
          ...prev,
          { 
            role: "ai", 
            content: typeof aiReply.response === 'string' 
              ? aiReply.response 
              : JSON.stringify(aiReply.response || "") 
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Sorry, I encountered an error: " + aiReply.error }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="p-2 bg-violet-600/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="font-semibold text-lg tracking-tight">AI Assistant</h1>
          <p className="text-xs text-slate-400">Powered by LangGraph</p>
        </div>
      </header>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <Bot className="w-16 h-16 mb-4" />
            <p>Start a conversation...</p>
          </div>
        )}
        
        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                m.role === "user"
                  ? "bg-violet-600 text-white rounded-br-sm"
                  : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {m.content}
              </div>
            </div>

            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-violet-900/30 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-violet-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl rounded-bl-sm p-4 flex items-center gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/90 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-slate-800/50 border border-slate-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-500/50 transition-all">
          <textarea
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !input.trim()}
            className="p-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-2">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}