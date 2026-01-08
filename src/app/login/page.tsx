"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signIn("credentials", {
        redirect: false, // We handle the redirect manually
        email: formData.get("email"),
        password: formData.get("password"),
        callbackUrl: "/", // Redirect to home page on success
      });

      setLoading(false);

      if (result?.error) {
        // We got an error, likely invalid credentials
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        // Successful sign-in
        window.location.href = result.url || "/";
      }
    } catch (e) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign-in error:", e);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#1a0d2e] px-4">
      <Card className="w-full max-w-sm bg-slate-900/50 border-purple-800/50 text-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access your chats.
            <br />
            <em className="text-xs text-slate-500">
              (Demo: test@example.com / password)
            </em>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <div className="rounded-md border border-red-500/50 bg-red-950 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="test@example.com"
                required
                disabled={loading}
                className="bg-slate-900/80 border-slate-700/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
                className="bg-slate-900/80 border-slate-700/50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-violet-400 hover:text-violet-300"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
