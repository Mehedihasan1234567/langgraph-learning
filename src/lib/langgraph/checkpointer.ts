import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env";

// Create a new connection pool for the checkpointer
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Export the checkpointer instance
export const checkpointer = new PostgresSaver(pool);

// Export a function to set up the checkpointer tables
export async function ensureCheckpointerSetup() {
  await checkpointer.setup();
}
