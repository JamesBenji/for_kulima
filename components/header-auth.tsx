"use client";
import { signOutAction } from "@/app/actions";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { LinearGradient } from "react-text-gradients";
import toast from "react-hot-toast";

const supabase = createClient();

export default function AuthButton() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const pathname = usePathname();
  const isProtectedRoute = pathname.includes("/protected");
  const email = useMemo(() => user?.email, [user]);

  return isProtectedRoute ? (
    <div className="flex items-center md:gap-4 mr-2">
      <span className="hidden md:block">
        <LinearGradient gradient={["to left", "#17acff ,#17acff ,#00ff00"]}>
          Hey, {email}!
        </LinearGradient>
      </span>

      <form action={signOutAction}>
        <Button
          type="submit"
          variant={"outline"}
          onClick={() => toast("Signing you out", { duration: 3500 })}
        >
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
        <a href="/sign-in">Sign in</a>
      </Button>
      <Button
        asChild
        size="sm"
        variant={"default"}
        className="bg-white text-black hover:bg-black/5"
      >
        <a href="/sign-up">Sign up</a>
      </Button>
    </div>
  );
}
