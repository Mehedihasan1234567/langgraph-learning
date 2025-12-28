// src/lib/langgraph/graph.ts
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";
import { checkpointer, ensureCheckpointerSetup } from "./checkpointer";
import { model } from "./model";
import { tools } from "./tools"; // টুল ইমপোর্ট

// ১. মডেলের সাথে টুল বাইন্ড (Bind) করা
// এতে মডেল জানবে তার কাছে "calculator" নামে একটি অস্ত্র আছে
const modelWithTools = model.bindTools(tools);


// ২. এজেন্ট নোড (যেখানে মডেল চিন্তা করবে)
async function agentNode(state: typeof MessagesAnnotation.State) {
  const messages = [
    new SystemMessage("You are a helpful assistant. Use the calculator tool if asked for math."),
    ...state.messages,
  ];
  const response = await modelWithTools.invoke(messages);
  return { messages: [response] };
}

// ৩. ডিসিশন মেকিং ফাংশন (Conditional Edge)
// মডেল কি টুল কল করতে চায়? নাকি উত্তর দিতে চায়?
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1];

  // যদি মডেলের রেসপন্সে tool_calls থাকে, তাহলে টুল নোডে পাঠাও
  if (lastMessage.additional_kwargs.tool_calls || (lastMessage as any).tool_calls?.length > 0) {
    return "tools";
  }
  // নাহলে শেষ করো
  return "__end__";
}

// ৪. টুল নোড তৈরি (Prebuilt)
const toolNode = new ToolNode(tools);

// ৫. গ্রাফ কনস্ট্রাকশন
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode) // টুল নোড যোগ করা হলো
  .addEdge("__start__", "agent")
  
  // কন্ডিশনাল এজ: এজেন্ট থেকে সিদ্ধান্ত নেবে কোথায় যাবে
  .addConditionalEdges(
    "agent",
    shouldContinue,
    {
      tools: "tools", // যদি টুল দরকার হয় -> tools নোডে যাও
      __end__: "__end__" // যদি দরকার না হয় -> শেষ করো
    }
  )
  
  // টুল কাজ শেষ করলে আবার এজেন্টের কাছে ফিরে আসবে (রেজাল্ট জানানোর জন্য)
  .addEdge("tools", "agent");
ensureCheckpointerSetup().catch(console.error);
export const graph = workflow.compile({
 checkpointer: checkpointer,
});