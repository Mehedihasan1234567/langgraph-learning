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
import { Loader2, Mail, Lock, LogIn, AlertCircle } from "lucide-react";

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
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/80 via-slate-950 to-slate-950 px-4">
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border-slate-800 text-slate-100 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </CardTitle>

          <CardDescription className="text-slate-400 text-base">
            Enter your credentials to access your chats.
            <br />
            <em className="text-sm text-slate-500 not-italic block mt-2">
              (Demo: test@example.com / password)
            </em>
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-6 px-8">
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-950/30 p-4 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400" />

                {error}
              </div>
            )}

            <div className="grid gap-3">
              <Label htmlFor="email" className="text-slate-200 font-medium">
                Email
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="test@example.com"
                  required
                  disabled={loading}
                  className="pl-10 h-10 bg-slate-950/50 border-slate-700/50 focus:border-violet-500 focus:ring-violet-500/20 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password" className="text-slate-200 font-medium">
                Password
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={loading}
                  className="pl-10 h-10 bg-slate-950/50 border-slate-700/50 focus:border-violet-500 focus:ring-violet-500/20 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 px-8 pb-8 pt-2">
            <Button
              type="submit"
              className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg shadow-violet-900/20 transition-all hover:scale-[1.01]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <LogIn className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-violet-400 hover:text-violet-300 hover:underline underline-offset-4 transition-colors font-medium"
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
