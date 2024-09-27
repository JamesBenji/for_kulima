import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LinearGradient } from "react-text-gradients";

export default function Signup({ searchParams }: { searchParams: Message }) {
  if ("message" in searchParams || "error" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="m-auto w-full mt-10 md:flex md:flex-row md:justify-center md:align-middle md:mt-10 md:mx-auto md:pl-20 md:h-[60vh]  p-10 md:p-0">
        <div>
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
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
            />
           
            <SubmitButton formAction={signUpAction} pendingText="Signing up...">
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
