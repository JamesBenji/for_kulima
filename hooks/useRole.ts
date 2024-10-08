import { getUserAccType } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useRole() {
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      setEmail(response.data.user!.email!);
    });
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      const email = res.data.user?.email;
      if (email) {
        getUserAccType(email).then((_role) => setRole(_role));
      }
    });
  }, [email]);

  return role;
}
