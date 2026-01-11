// src/lib/langgraph/graph.ts
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";
import { checkpointer, ensureCheckpointerSetup } from "./checkpointer";
import { model } from "./model";
import { tools } from "./tools"; // Import tools

// 1. Bind tools to the model
// This lets the model know what tools it can call.
const modelWithTools = model.bindTools(tools);

// 2. Agent node: this is where the model will think
async function agentNode(state: typeof MessagesAnnotation.State) {
  const messages = [
    new SystemMessage(
      "You are a helpful assistant. Always answer in Bangla.\n\n" +
        "When responding, you MUST follow this sequence:\n" +
        "1. First, think about the user's request. Put all your reasoning, thoughts, and planning inside `<thinking>` XML tags. This is a space for you to plan your approach, consider which tools to use (if any), and outline your steps. This part will be hidden from the user but is crucial for your process.\n" +
        "2. After the `<thinking>` block, provide the final, user-facing answer. This answer should be clear, concise, and directly address the user's query.\n" +
        "3. Convert all English numbers to Bangla digits (০-৯) in your final text summary.\n\n" +
        "Weather Workflow:\n" +
        "- When asked for weather, first use `get_coordinates` to find the location's latitude and longitude.\n" +
        "- Then, use the `get_weather` tool with the coordinates and the location name.\n" +
        "- Finally, summarize the weather in Bangla.",
    ),
    ...state.messages,
  ];
  const response = await modelWithTools.invoke(messages);
  return { messages: [response] };
}

// 3. Decision-making function (Conditional Edge)
// Does the model want to call a tool? Or is it finished?
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1];

  // If the model's response has tool calls, route to the tool node
  if (
    lastMessage.additional_kwargs.tool_calls ||
    (lastMessage as any).tool_calls?.length > 0
  ) {
    return "tools";
  }
  // Otherwise, end the conversation
  return "__end__";
}

// 4. Prebuilt Tool Node
const toolNode = new ToolNode(tools);

// 5. Graph Construction
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode) // Add the tool node
  .addEdge("__start__", "agent")

  // Conditional Edge: from agent, decide where to go next
  .addConditionalEdges("agent", shouldContinue, {
    tools: "tools", // If tools are needed -> go to the tools node
    __end__: "__end__", // If not -> end
  })

  // If tools are called, loop back to the agent to let it process the results
  .addEdge("tools", "agent");

// Ensure the checkpointer database tables are created
ensureCheckpointerSetup().catch(console.error);

// Compile the graph
export const graph = workflow.compile({
  checkpointer: checkpointer,
});
