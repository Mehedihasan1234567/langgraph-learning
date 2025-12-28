import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { Pool } from "pg";

// আপনার ডাটাবেস কানেকশন পুল তৈরি করা হচ্ছে
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// এই লাইনটি জরুরি: checkpointer এক্সপোর্ট করা হচ্ছে
export const checkpointer = new PostgresSaver(pool);

// টেবিল সেটআপ ফাংশন এক্সপোর্ট করা হচ্ছে
export async function ensureCheckpointerSetup() {
    await checkpointer.setup();
}