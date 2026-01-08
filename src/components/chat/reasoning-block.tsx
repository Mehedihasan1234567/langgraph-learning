"use client";

import { useState } from "react";
import { Brain, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ReasoningBlockProps {
  content: string;
  isLoading?: boolean;
  defaultOpen?: boolean;
}

export function ReasoningBlock({
  content,
  isLoading = false,
  defaultOpen = false,
}: ReasoningBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasContent = content && content.trim().length > 0;

  // Determine the text to display based on loading state
  const statusText = isLoading ? "চিন্তা করা হচ্ছে..." : "চিন্তা সম্পন্ন";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="rounded-lg border border-purple-800/30 bg-purple-950/20 overflow-hidden transition-all duration-200">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 p-2.5 hover:bg-purple-900/20 transition-colors duration-200 cursor-pointer">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Brain
                className={cn(
                  "w-4 h-4 text-purple-400 shrink-0 transition-opacity duration-200",
                  isLoading && "animate-pulse",
                )}
              />
              <span
                className={cn(
                  "text-xs text-purple-300 font-medium transition-all duration-300",
                  !isLoading && "opacity-80",
                )}
              >
                {statusText}
              </span>
            </div>
            {hasContent && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-purple-400 shrink-0 transition-transform duration-300 ease-in-out",
                  isOpen && "transform rotate-180",
                )}
              />
            )}
          </div>
        </CollapsibleTrigger>
        {hasContent && (
          <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="px-3 pb-3 pt-2 border-t border-purple-800/20">
              <ScrollArea className="max-h-[300px]">
                <pre className="text-xs text-purple-200/80 whitespace-pre-wrap font-mono leading-relaxed">
                  {content}
                </pre>
              </ScrollArea>
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}
