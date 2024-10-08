import { createClient } from "@/utils/supabase/client";
import { useEffect, useMemo, useState } from "react";
import useRole from "./useRole";
import toast from "react-hot-toast";

export default function useUser() {
  const supabase = createClient();
  const role = useRole();

  const [user, setUser] = useState<any | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const table = useMemo(
    () =>
      `${role === "district_admin" ? "district_admin" : role === "parish_admin" ? "parish_admin" : "field_agents"}`,
    [role]
  );

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      setEmail(response!.data!.user!.email!);
    });
  }, []);

  useEffect(() => {
    supabase
      .from(table)
      .select("*")
      .eq("email", email)
      .single()
      .then((response) => {
        if (response.error) console.log({ error: response.error });
        setUser(response.data);
      });
  }, [email, table]);

  useEffect(() => {
    console.log({ user, email, role, table });
  }, [user, email, role, table]);

  

  return user;
}
