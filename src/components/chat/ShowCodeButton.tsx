"use client";

import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowCodeButtonProps {
  onClick: () => void;
  codeBlockCount?: number;
}

export function ShowCodeButton({ onClick, codeBlockCount = 1 }: ShowCodeButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="mt-2 flex items-center gap-2 text-xs"
    >
      <Code2 className="w-3.5 h-3.5" />
      Show Code {codeBlockCount > 1 && `(${codeBlockCount})`}
    </Button>
  );
}

