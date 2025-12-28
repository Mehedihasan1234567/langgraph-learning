// src/lib/langgraph/tools.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// ১. একটি সাধারণ যোগ করার টুল
export const calculatorTool = tool(
  async ({ a, b }) => {
    return `The result of ${a} + ${b} is ${a + b}`;
  },
  {
    name: "calculator",
    description: "Use this tool strictly when the user asks to add two numbers.",
    schema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    }),
  }
);

// সব টুল একটি অ্যারেতে এক্সপোর্ট করা
export const tools = [calculatorTool];