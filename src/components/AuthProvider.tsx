"use client";

import { SessionProvider } from "next-auth/react";

/**
 * A client-side component that wraps its children in NextAuth's SessionProvider.
 * This makes the session context available throughout the application.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
