"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleDeleteChatAction } from "./ChatSidebarActions";

interface DeleteChatButtonProps {
  chatId: string;
}

export function DeleteChatButton({ chatId }: DeleteChatButtonProps) {
  return (
    <form
      action={handleDeleteChatAction.bind(null, chatId)}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 h-6 w-6 shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
      </Button>
    </form>
  );
}
