"use client";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LinearGradient } from "react-text-gradients";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Signup({ searchParams }: { searchParams: Message }) {
  const [showPassword, setShowPassword] = useState(false);

  if ("message" in searchParams || "error" in searchParams) {
    return (
      <div className="mx-auto w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 flex align-middle justify-center ">
        <div className="m-auto w-full px-6 md:p-5 md:max-w-fit">
          <form className="flex-1 flex flex-col md:min-w-96 max-w-96 ">
            <div className="flex flex-row justify-between align-middle">
              <h1 className="text-2xl font-medium">
                Sign up for{" "}
                <LinearGradient gradient={["to left", "#17acff ,#00ff00"]}>
                  Kulima
                </LinearGradient>
              </h1>
            </div>
            <p className="text-sm text text-foreground">
              Already have an account?{" "}
              <Link
                className="text-primary font-medium underline"
                href="/sign-in"
              >
                Sign in
              </Link>
            </p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" required />
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Your password (at least 6 characters)"
                  minLength={6}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <SubmitButton
                formAction={signUpAction}
                pendingText="Signing up..."
              >
                Sign up
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
