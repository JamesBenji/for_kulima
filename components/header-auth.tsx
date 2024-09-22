"use client";
import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthError, User } from "@supabase/supabase-js";

const fetchUser = async () => {
  return await createClient().auth.getUser();
};

export default function AuthButton() {
  const pathname = usePathname();
  const isProtectedRoute = pathname.includes("/protected");

  const [user, setUser] = useState<User | null>(null);
  const [authHeaderError, setAuthHeaderError] = useState<AuthError | null>(
    null
  );

  // setting user
  useEffect(() => {
    if (isProtectedRoute && user === null) {
      fetchUser().then((response) => {
        if (response.error) {
          setUser(null);
          setAuthHeaderError(response.error);
        }
        if (response.data) setUser(response.data.user);
      });
    }
  }, [user]);

  if (authHeaderError) {
    console.error("Error fetching user:", authHeaderError);
    return (
      <div className="w-full flex flex-row align-middle justify-center">
        Error retrieving user information. Please try again
      </div>
    );
  }

  return user && isProtectedRoute ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button
        asChild
        size="sm"
        variant={"outline"}
        className="bg-gradient-to-tr to-[#17acff] from-[#00ff00] text-white"
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button
        asChild
        size="sm"
        variant={"default"}
        className="bg-white text-black hover:bg-black/5"
      >
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
