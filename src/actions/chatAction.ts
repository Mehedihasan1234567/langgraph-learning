// src/actions/chatAction.ts
"use server"; // এটি সার্ভার অ্যাকশন হিসেবে ডিক্লেয়ার করা

import { graph } from "@/lib/langgraph/graph";
import { HumanMessage } from "@langchain/core/messages";

export async function chatAction(userQuery: string) {
  try {
  const finalState = await graph.invoke(
      {
        messages: [new HumanMessage(userQuery)],
      },
      {
        // 👇 এই কনফিগারেশনটি মেমোরির জন্য জরুরি
        configurable: { 
          thread_id: "user-123", // আপাতত হার্ডকোড। পরে এটি ডাইনামিক হবে।
        },
      }
    );

    // লেটেস্ট রেসপন্স বের করা
    const lastMessage = finalState.messages[finalState.messages.length - 1];
    
    // টেক্সট হিসেবে রিটার্ন করা (বা পুরো মেসেজ অবজেক্ট চাইলে তাও পারেন)
    return { 
      success: true, 
      response: lastMessage.content 
    };

  } catch (error) {
    console.error("Graph Error:", error);
    return { 
      success: false, 
      error: "Something went wrong" 
    };
  }
}