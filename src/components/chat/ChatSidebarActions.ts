"use server";

import { createChat, deleteChat } from "@/lib/db/actions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

export async function handleNewChatAction() {
  const session = await auth();
  if (!session?.user?.id) {
    // This should not happen if middleware is set up correctly,
    // but as a safeguard, we redirect to login.
    redirect("/login");
  }
  const userId = session.user.id;

  const chatId = await createChat(userId);
  if (chatId) {
    redirect(`/chat/${chatId}`);
  }
  // Optional: handle case where chat creation fails
}

export async function handleDeleteChatAction(chatId: string) {
  // TODO: Add check to ensure the user deleting the chat is the owner.
  await deleteChat(chatId);
  revalidatePath("/", "layout");
}
