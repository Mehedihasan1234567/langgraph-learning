"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { ChatLayout } from "@/components/ChatLayout";
import { ReasoningBlock } from "@/components/chat/reasoning-block";
import { ArtifactsPanel } from "@/components/chat/ArtifactsPanel";
import { ShowCodeButton } from "@/components/chat/ShowCodeButton";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import {
  parseReasoning,
  extractCodeBlocks,
  hasCodeBlocks,
  extractSuggestions,
  generateMockSuggestions,
} from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatPageClientProps {
  threadId: string;
  initialMessages: Array<{
    id: string;
    role: "user" | "assistant" | "system";
    parts: Array<{ type: "text"; text: string }>;
  }>;
  chatTitle: string;
  chatSidebar: React.ReactNode;
}

// Sidebar Trigger Button Component
function SidebarTriggerButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="text-slate-300 hover:text-slate-100 hover:bg-purple-900/30"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M9 3v18" />
      </svg>
    </Button>
  );
}

export default function ChatPageClient({
  threadId,
  initialMessages,
  chatTitle,
  chatSidebar,
}: ChatPageClientProps) {
  const [input, setInput] = useState("");
  const [artifactContent, setArtifactContent] = useState<React.ReactNode>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    // TextStreamChatTransport ব্যবহার করে plain text stream handle করা
    transport: new TextStreamChatTransport({
      api: "/api/chat",
      body: () => ({
        thread_id: threadId,
      }),
    }),
    onError: (error) => {
      console.error("Chat Error:", error);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  // Set initial messages when component mounts
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, []); // Only run once on mount

  // Message থেকে text content extract করা (parts structure handle করা)
  const getMessageText = (message: (typeof messages)[0]) => {
    // parts array থেকে text parts join করা
    if (message.parts && Array.isArray(message.parts)) {
      return message.parts
        .filter(
          (part): part is { type: "text"; text: string } =>
            part.type === "text",
        )
        .map((part) => part.text)
        .join("");
    }
    return "";
  };

  // Parse message content to extract reasoning and answer
  const getParsedMessage = (
    message: (typeof messages)[0],
    isStreaming: boolean = false,
  ) => {
    const messageText = getMessageText(message);
    return parseReasoning(messageText);
  };

  // Handle opening artifacts panel with code
  const handleShowCode = (
    codeBlocks: Array<{ language: string; code: string }>,
  ) => {
    setArtifactContent(<ArtifactsPanel codeBlocks={codeBlocks} />);
    // Open the artifacts panel
    if (typeof window !== "undefined" && (window as any).__openArtifacts) {
      (window as any).__openArtifacts();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: userMessage }],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Extract suggestions from the last assistant message
  const lastAssistantMessage = messages
    .filter((m) => m.role === "assistant")
    .slice(-1)[0];
  const lastMessageText = lastAssistantMessage
    ? getMessageText(lastAssistantMessage)
    : "";
  const suggestions = lastAssistantMessage
    ? extractSuggestions(lastMessageText)
    : generateMockSuggestions(lastMessageText || "New conversation");

  return (
    <ChatLayout
      artifactContent={artifactContent}
      onOpenArtifacts={() => {}}
      chatHistory={chatSidebar}
    >
      <div className="flex flex-col h-full w-full overflow-hidden bg-[#1a0d2e] text-slate-50 font-sans relative">
        {/* Header */}
        <header className="flex items-center gap-3 p-4 border-b border-purple-900/30 bg-[#1a0d2e]/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          {/* Sidebar Trigger Button */}
          <SidebarTriggerButton />
          <div className="p-2 bg-violet-600/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight">
              {chatTitle}
            </h1>
            <p className="text-xs text-slate-400">Powered by LangGraph</p>
          </div>
          {status === "streaming" && (
            <div className="ml-auto flex items-center gap-2 text-xs text-violet-400">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              Streaming...
            </div>
          )}
        </header>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-800/50 scrollbar-track-transparent min-h-0 bg-[#1a0d2e]">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-purple-300/50">
              <Bot className="w-16 h-16 mb-4 text-purple-400/30" />
              <p>Start a conversation...</p>
            </div>
          )}

          {messages.map((m, index) => {
            const isLastAssistantMessage =
              m.role === "assistant" && index === messages.length - 1;
            const isCurrentlyStreaming =
              isLastAssistantMessage && status === "streaming";

            // Only parse reasoning for assistant messages
            const parsed =
              m.role === "assistant"
                ? getParsedMessage(m, isCurrentlyStreaming)
                : { reasoning: null, answer: getMessageText(m) };

            const hasReasoning = parsed.reasoning !== null;

            // Extract code blocks from answer
            const { codeBlocks, textWithoutCode } = extractCodeBlocks(
              parsed.answer,
            );
            const hasCode = codeBlocks.length > 0;
            const hasAnswer = textWithoutCode.trim().length > 0 || hasCode;

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-violet-400" />
                  </div>
                )}

                <div
                  className={`flex flex-col gap-3 max-w-[85%] md:max-w-[75%] ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {/* Render reasoning block first if it exists or is streaming */}
                  {m.role === "assistant" &&
                    (hasReasoning || (isCurrentlyStreaming && !hasAnswer)) && (
                      <div className="w-full">
                        <ReasoningBlock
                          content={parsed.reasoning || ""}
                          isLoading={isCurrentlyStreaming}
                        />
                      </div>
                    )}

                  {/* Render answer as normal chat bubble */}
                  {hasAnswer && (
                    <div
                      className={`rounded-2xl p-4 shadow-sm ${
                        m.role === "user"
                          ? "bg-violet-600 text-white rounded-br-sm"
                          : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm"
                      }`}
                    >
                      {textWithoutCode && (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {textWithoutCode}
                          {/* Typewriter cursor effect for streaming */}
                          {isCurrentlyStreaming && (
                            <span className="inline-block w-2 h-4 bg-violet-400 ml-1 animate-pulse" />
                          )}
                        </div>
                      )}

                      {/* Show Code Button */}
                      {hasCode && (
                        <div className="mt-3">
                          <ShowCodeButton
                            onClick={() => handleShowCode(codeBlocks)}
                            codeBlockCount={codeBlocks.length}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 &&
          messages.length > 0 &&
          status !== "streaming" && (
            <div className="px-4 md:px-6 pb-2">
              <SuggestionChips
                suggestions={suggestions}
                onSelect={(suggestion) => {
                  setInput(suggestion);
                  // Auto-submit after a short delay
                  setTimeout(() => {
                    sendMessage({
                      role: "user",
                      parts: [{ type: "text", text: suggestion }],
                    });
                  }, 100);
                }}
              />
            </div>
          )}

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-purple-900/30 bg-[#1a0d2e]/50 backdrop-blur-md shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={1}
              className={cn(
                "flex-1 resize-none rounded-xl px-4 py-3",
                "bg-slate-900/80 border border-slate-700/50",
                "text-slate-100 placeholder:text-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent",
              )}
              style={{ minHeight: "48px", maxHeight: "200px" }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </ChatLayout>
  );
}
