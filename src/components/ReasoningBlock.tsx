"use client";

import { useState } from "react";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface ReasoningBlockProps {
  reasoning: string;
  isStreaming?: boolean;
}

export function ReasoningBlock({ reasoning, isStreaming = false }: ReasoningBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasContent = reasoning && reasoning.trim().length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="rounded-lg border border-purple-800/30 bg-purple-950/20 overflow-hidden">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 p-3 hover:bg-purple-900/20 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Brain
                className={cn(
                  "w-4 h-4 text-purple-400 shrink-0",
                  (isStreaming || !hasContent) && "animate-pulse"
                )}
              />
              <span className="text-sm text-purple-300 font-medium">
                চিন্তা করা হচ্ছে...
              </span>
            </div>
            {hasContent && (
              <>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-purple-400 shrink-0" />
                )}
              </>
            )}
          </div>
        </CollapsibleTrigger>
        {hasContent && (
          <CollapsibleContent className="px-3 pb-3">
            <div className="pt-2 border-t border-purple-800/20">
              <pre className="text-xs text-purple-200/80 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                {reasoning}
              </pre>
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}

