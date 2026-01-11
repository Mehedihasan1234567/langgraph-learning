import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserChats } from "@/lib/db/actions";
import { formatTimeBengali } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { handleNewChatAction } from "./ChatSidebarActions";
import { DeleteChatButton } from "./DeleteChatButton";
import type { Chat } from "@/db/schema";

interface ChatSidebarProps {
  userId: string;
  currentChatId?: string;
}

// Group chats by date
function groupChatsByDate(chats: Chat[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: {
    today: Chat[];
    yesterday: Chat[];
    week: Chat[];
    older: Chat[];
  } = {
    today: [],
    yesterday: [],
    week: [],
    older: [],
  };

  chats.forEach((chat) => {
    const chatDate = new Date(chat.updatedAt);
    if (chatDate >= today) {
      groups.today.push(chat);
    } else if (chatDate >= yesterday) {
      groups.yesterday.push(chat);
    } else if (chatDate >= weekAgo) {
      groups.week.push(chat);
    } else {
      groups.older.push(chat);
    }
  });

  return groups;
}

export async function ChatSidebar({ userId, currentChatId }: ChatSidebarProps) {
  const chats = await getUserChats(userId);
  const groupedChats = groupChatsByDate(chats);

  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-2 border-b border-gray-200">
        <form action={handleNewChatAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </Button>
        </form>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-4">
          {/* Today */}
          {groupedChats.today.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                Today
              </h3>
              <div className="space-y-1">
                {groupedChats.today.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChatId === chat.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday */}
          {groupedChats.yesterday.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                Yesterday
              </h3>
              <div className="space-y-1">
                {groupedChats.yesterday.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChatId === chat.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Previous 7 Days */}
          {groupedChats.week.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                Previous 7 Days
              </h3>
              <div className="space-y-1">
                {groupedChats.week.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChatId === chat.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Older */}
          {groupedChats.older.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                Older
              </h3>
              <div className="space-y-1">
                {groupedChats.older.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChatId === chat.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {chats.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-8">
              No chat history yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Chat Item Component
function ChatItem({ chat, isActive }: { chat: Chat; isActive: boolean }) {
  return (
    <div
      className={cn(
        "group relative flex items-center p-2 rounded-lg transition-colors",
        "hover:bg-gray-100 border border-transparent hover:border-gray-200",
        isActive && "bg-violet-50 border-violet-200",
      )}
    >
      <Link
        href={`/chat/${chat.id}`}
        className="flex-1 flex items-start gap-2 min-w-0 pr-8"
      >
        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-900 truncate">
            {chat.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-gray-500">
              {formatTimeBengali(chat.updatedAt)}
            </span>
          </div>
        </div>
      </Link>
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <DeleteChatButton chatId={chat.id} />
      </div>
    </div>
  );
}
