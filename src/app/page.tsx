// src/app/page.tsx
"use client";

import { useState } from "react";
import { chatAction } from "@/actions/chatAction";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!input) return;
    setLoading(true);
    // সার্ভার অ্যাকশন কল করা হচ্ছে
    const aiReply = await chatAction(input);
    if (aiReply.success) {
      setResponse(typeof aiReply.response === 'string' ? aiReply.response : JSON.stringify(aiReply.response || ""));
    } else {
      setResponse("Error: " + aiReply.error);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-4 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">My First LangGraph Agent</h1>
      
      <div className="w-full max-w-md space-y-4">
        <textarea
          className="w-full p-2 border rounded text-black"
          placeholder="Ask something (e.g., What is Next.js?)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Send Message"}
        </button>

        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-black border border-gray-300">
            <strong>AI Says:</strong>
            <p className="mt-1">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}