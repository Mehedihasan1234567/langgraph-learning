"use server";

import { db } from "@/db";
import { chats } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Chat } from "@/db/schema";

/**
 * Fetch all chats for a specific user, ordered by updatedAt descending
 * @param userId - The user ID to fetch chats for
 * @returns Array of chats or empty array if none found
 */
export async function getUserChats(userId: string): Promise<Chat[]> {
  try {
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid userId provided");
    }

    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));

    return userChats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    // Return empty array on error to prevent UI breakage
    return [];
  }
}

/**
 * Create a new chat entry and return the id (which will be used as thread_id)
 * @param userId - The user ID to create the chat for
 * @returns The created chat's id (UUID) or null if creation failed
 */
export async function createChat(userId: string): Promise<string | null> {
  try {
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid userId provided");
    }

    const [newChat] = await db
      .insert(chats)
      .values({
        userId,
        title: "New Chat",
        // createdAt and updatedAt will be set automatically by defaultNow()
      })
      .returning({ id: chats.id });

    if (!newChat || !newChat.id) {
      throw new Error("Failed to create chat - no ID returned");
    }

    return newChat.id;
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
}

/**
 * Verify if a chat exists by its ID
 * @param chatId - The chat ID (UUID) to verify
 * @returns The chat object if it exists, null otherwise
 */
export async function getChat(chatId: string): Promise<Chat | null> {
  try {
    if (!chatId || typeof chatId !== "string") {
      throw new Error("Invalid chatId provided");
    }

    const [chat] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId))
      .limit(1);

    return chat || null;
  } catch (error) {
    console.error("Error fetching chat:", error);
    return null;
  }
}

/**
 * Update chat title and/or updatedAt timestamp
 * @param chatId - The chat ID to update
 * @param title - Optional new title for the chat
 * @returns Updated chat object or null if update failed
 */
export async function updateChat(
  chatId: string,
  title?: string
): Promise<Chat | null> {
  try {
    if (!chatId || typeof chatId !== "string") {
      throw new Error("Invalid chatId provided");
    }

    const updateData: Partial<{ title: string; updatedAt: Date }> = {
      updatedAt: new Date(),
    };

    if (title && typeof title === "string") {
      updateData.title = title;
    }

    const [updatedChat] = await db
      .update(chats)
      .set(updateData)
      .where(eq(chats.id, chatId))
      .returning();

    return updatedChat || null;
  } catch (error) {
    console.error("Error updating chat:", error);
    return null;
  }
}

/**
 * Delete a chat by its ID
 * @param chatId - The chat ID to delete
 * @returns true if deletion was successful, false otherwise
 */
export async function deleteChat(chatId: string): Promise<boolean> {
  try {
    if (!chatId || typeof chatId !== "string") {
      throw new Error("Invalid chatId provided");
    }

    const result = await db.delete(chats).where(eq(chats.id, chatId));

    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Error deleting chat:", error);
    return false;
  }
}

