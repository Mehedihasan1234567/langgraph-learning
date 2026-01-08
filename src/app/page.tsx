import { handleNewChatAction } from "@/components/chat/ChatSidebarActions";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The root page of the application.
 * It automatically creates a new chat for the logged-in user and redirects to it.
 * This ensures that the user always lands in an active chat session.
 */
export default async function HomePage() {
  // Server action that gets the user ID from the session, creates a new chat in the DB, and then redirects.
  await handleNewChatAction();

  // This fallback UI is displayed briefly while the redirect is processed by the browser.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#1a0d2e]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-lg font-medium text-slate-200">
          Preparing a new chat session...
        </div>
        <div className="flex w-80 flex-col gap-3 rounded-xl bg-slate-900/50 p-4">
          <Skeleton className="h-5 w-3/5 bg-slate-700" />
          <Skeleton className="h-4 w-full bg-slate-700" />
          <Skeleton className="h-4 w-4/5 bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
