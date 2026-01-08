import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a message content to extract reasoning and answer from <thinking> tags
 * @param content - The message content that may contain <thinking>...</thinking> tags
 * @returns An object with `reasoning` (text inside tags) and `answer` (text outside/after tags)
 */
export function parseReasoning(content: string): {
  reasoning: string | null;
  answer: string;
} {
  if (!content) {
    return { reasoning: null, answer: "" };
  }

  // Match complete <thinking>...</thinking> tags
  const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
  
  if (thinkingMatch) {
    const reasoning = thinkingMatch[1].trim();
    // Remove the thinking tags and get the remaining content as answer
    const answer = content.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
    return { reasoning, answer };
  }

  // Check for partial thinking tag (during streaming - opening tag but no closing)
  const partialMatch = content.match(/<thinking>([\s\S]*?)$/);
  if (partialMatch) {
    const reasoning = partialMatch[1].trim() || "...";
    // Get text before the <thinking> tag as answer (if any)
    const beforeThinking = content.substring(0, content.indexOf("<thinking>")).trim();
    return { reasoning, answer: beforeThinking };
  }

  // No thinking tags found
  return { reasoning: null, answer: content };
}

/**
 * Extracts code blocks from markdown content
 * @param content - The message content that may contain markdown code blocks
 * @returns An object with `codeBlocks` array and `textWithoutCode` (text with code blocks removed)
 */
export function extractCodeBlocks(content: string): {
  codeBlocks: Array<{ language: string; code: string }>;
  textWithoutCode: string;
} {
  if (!content) {
    return { codeBlocks: [], textWithoutCode: "" };
  }

  const codeBlocks: Array<{ language: string; code: string }> = [];
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  let match;
  let textWithoutCode = content;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || "text";
    const code = match[2].trim();
    codeBlocks.push({ language, code });
    // Remove the code block from text
    textWithoutCode = textWithoutCode.replace(match[0], "").trim();
  }

  return { codeBlocks, textWithoutCode };
}

/**
 * Checks if content contains code blocks or tool outputs
 * @param content - The message content to check
 * @returns true if content contains code blocks
 */
export function hasCodeBlocks(content: string): boolean {
  if (!content) return false;
  // Check for markdown code blocks
  const codeBlockRegex = /```[\s\S]*?```/;
  return codeBlockRegex.test(content);
}

/**
 * Extracts suggestions from a message response
 * Looks for JSON format: {"suggestions": ["...", "...", "..."]}
 * or markdown list format
 * @param content - The message content that may contain suggestions
 * @returns Array of suggestion strings (max 3)
 */
export function extractSuggestions(content: string): string[] {
  if (!content) return [];

  const suggestions: string[] = [];

  // Try to extract from JSON format: {"suggestions": ["...", "...", "..."]}
  try {
    const jsonMatch = content.match(/\{"suggestions":\s*\[([\s\S]*?)\]\}/);
    if (jsonMatch) {
      const suggestionsStr = jsonMatch[1];
      const matches = suggestionsStr.matchAll(/"([^"]+)"/g);
      for (const match of matches) {
        if (match[1]) suggestions.push(match[1]);
      }
      if (suggestions.length > 0) {
        return suggestions.slice(0, 3);
      }
    }
  } catch (e) {
    // JSON parsing failed, try other methods
  }

  // Try to extract from markdown list format
  const listMatch = content.match(/##?\s*Suggestions?\s*\n([\s\S]*?)(?=\n\n|\n##|$)/i);
  if (listMatch) {
    const listContent = listMatch[1];
    const listItems = listContent.match(/^[-*]\s+(.+)$/gm);
    if (listItems) {
      for (const item of listItems) {
        const text = item.replace(/^[-*]\s+/, "").trim();
        if (text) suggestions.push(text);
      }
      if (suggestions.length > 0) {
        return suggestions.slice(0, 3);
      }
    }
  }

  // If no suggestions found, return empty array
  return [];
}

/**
 * Generates mock suggestions based on the last assistant message
 * @param lastMessage - The last assistant message content
 * @returns Array of 3 mock suggestion strings
 */
export function generateMockSuggestions(lastMessage: string): string[] {
  if (!lastMessage) return [];

  // Simple mock suggestions based on common patterns
  const suggestions = [
    "Tell me more about this",
    "Can you explain in simpler terms?",
    "What are the next steps?",
  ];

  // Try to generate more contextual suggestions
  const lowerMessage = lastMessage.toLowerCase();
  
  if (lowerMessage.includes("code") || lowerMessage.includes("function")) {
    return [
      "Show me an example",
      "How do I use this?",
      "Can you optimize this code?",
    ];
  }

  if (lowerMessage.includes("error") || lowerMessage.includes("problem")) {
    return [
      "How do I fix this?",
      "What caused this issue?",
      "Show me the solution",
    ];
  }

  if (lowerMessage.includes("how") || lowerMessage.includes("tutorial")) {
    return [
      "Show me step by step",
      "What do I need to know first?",
      "Give me a practical example",
    ];
  }

  return suggestions;
}
