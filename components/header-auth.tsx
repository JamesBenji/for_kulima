"use client";
import { signOutAction } from "@/app/actions";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { LinearGradient } from "react-text-gradients";
import toast from "react-hot-toast";
import { SupabaseClient } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

const getEmail = async (supabase: SupabaseClient<any, "public", any>) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email;
};

export default function AuthButton() {
  const supabase = createClient();
  const [email, setEmail] = useState<string | null | undefined>(null);
  const [num, setNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    setNum(Math.random() * 5);
  }, [email]);

  useEffect(() => {
    setLoading(true);
    getEmail(supabase)
      .then((response) => {
        setEmail(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading && pathname.includes("/protected")) {
    return <Loader2 size={20} className="animate-spin" />;
  }

  return pathname.includes("/protected") ? (
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
    <div className="flex gap-2 mx-2 md:mx-0">
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
        className="bg-white text-black light:hover:bg-black/5 hover:text-white dark:hover:text-black"
      >
        <a href="/sign-up">Sign up</a>
      </Button>
    </div>
  );
}
