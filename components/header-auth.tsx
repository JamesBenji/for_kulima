"use client";
import { Button } from "./ui/button";
import { LinearGradient } from "react-text-gradients";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

export default function AuthButton() {
  // const supabase = createClient()
  const supabase = createClient();
  const [sessionData, setSession] = useState<Session | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(response => {
      if(response.error){
        setSession(null)
        return;
      }
      setSession(response.data.session)
    })
  }, [])

  const email = sessionData?.user.email;
  
  return sessionData && pathname.includes('/protected') ? (
    <div className="flex items-center md:gap-4 mr-2">
      <span className="hidden md:block">
        <LinearGradient gradient={["to left", "#17acff ,#17acff ,#00ff00"]}>
          Hey, {email}!
        </LinearGradient>
      </span>

      <form action={signOutAction} method="post">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2 mx-2 md:mx-0">
      <Button
        asChild
        size="sm"
        variant="outline"
        className="bg-gradient-to-tr to-[#17acff] from-[#00ff00] text-white"
      >
        <a href={`/sign-in`}>Sign in</a>
      </Button>
      <Button
        asChild
        size="sm"
        variant="default"
        className="bg-white text-black light:hover:bg-black/5 hover:text-white dark:hover:text-black"
      >
        <a href={`/sign-up`}>Sign up</a>
      </Button>
    </div>
  );
}
