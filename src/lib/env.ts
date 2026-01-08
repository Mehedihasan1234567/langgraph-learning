import { z } from "zod";

/**
 * Defines the schema for server-side environment variables.
 * Using Zod to validate the environment variables at build time.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL."),
  OPENROUTER_API_KEY: z
    .string()
    .min(1, "OPENROUTER_API_KEY is a required environment variable."),

  // Variables for NextAuth.js
  AUTH_SECRET: z
    .string()
    .min(1, "AUTH_SECRET is a required environment variable for NextAuth.js."),
  AUTH_URL: z.string().url().optional(),
});

/**
 * This object holds the validated server-side environment variables.
 *
 * We use a proxy to lazily validate the environment variables only when they are first accessed.
 * This ensures that the validation runs early and prevents the app from starting
 * with a missing or invalid configuration.
 *
 * If an environment variable is missing or invalid, an error will be thrown.
 */
export const env = new Proxy(process.env, {
  get(target, prop: string) {
    const validatedEnv = serverEnvSchema.safeParse(target);

    if (!validatedEnv.success) {
      const errorMessages = validatedEnv.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(`❌ Invalid environment variables:\n${errorMessages}`);
    }

    if (prop in validatedEnv.data) {
      return validatedEnv.data[prop as keyof typeof validatedEnv.data];
    }

    return target[prop];
  },
});
