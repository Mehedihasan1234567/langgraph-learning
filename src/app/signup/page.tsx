"use client";

import { useActionState } from "react";
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
import { signup } from "@/actions/auth-actions";
import Link from "next/link";
import { User, Mail, Lock, Loader2, UserPlus, AlertCircle } from "lucide-react";

const initialState = {
  error: "",
};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/80 via-slate-950 to-slate-950 px-4">
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border-slate-800 text-slate-100 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Create Account
          </CardTitle>

          <CardDescription className="text-slate-400 text-base">
            Enter your details to get started.
          </CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="grid gap-6 px-8">
            {state?.error && (
              <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-950/30 p-4 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400" />

                {state.error}
              </div>
            )}

            <div className="grid gap-3">
              <Label htmlFor="name" className="text-slate-200 font-medium">
                Name
              </Label>

              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="pl-10 h-10 bg-slate-950/50 border-slate-700/50 focus:border-violet-500 focus:ring-violet-500/20 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>

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
                  className="pl-10 h-10 bg-slate-950/50 border-slate-700/50 focus:border-violet-500 focus:ring-violet-500/20 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 px-8 pb-8 pt-2">
            <Button
              type="submit"
              className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg shadow-violet-900/20 transition-all hover:scale-[1.01]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up <UserPlus className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-violet-400 hover:text-violet-300 hover:underline underline-offset-4 transition-colors font-medium"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
