"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isLoading?: boolean;
}

export function SuggestionChips({ suggestions, onSelect, isLoading = false }: SuggestionChipsProps) {
  // Don't show during loading, but show if we have suggestions
  if (isLoading || !suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium",
            "bg-purple-900/20 border-purple-700/30 text-purple-200",
            "hover:bg-purple-800/30 hover:border-purple-600/50 hover:text-purple-100",
            "transition-colors duration-200",
            "max-w-[calc(33.333%-0.5rem)] truncate"
          )}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}

