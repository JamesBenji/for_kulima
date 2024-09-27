import VerifiedParishAdmin from "@/components/parish-admin/VerifiedParishAdmin";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import React from "react";

const supabase = createClient();

const adminHasAccess = async (
  supabase: SupabaseClient<any, "public", any>,
  email: string
) => {
  const { data } = await supabase
    .from("parish_admin")
    .select("hasAccess")
    .eq("email", email)
    .single();
  if (data?.hasAccess === false) {
    return false;
  }
  return true;
};

async function ParishAdmin() {
  const email = (await supabase.auth.getUser()).data.user?.email;
  const hasAccess = await adminHasAccess(supabase, email!);

  if (!hasAccess) {
    return <div>Your access has been revoked</div>;
  }
  return (
    <div className="flex-1 h-full flex flex-col">
      <VerifiedParishAdmin />
    </div>
  );
}

export default ParishAdmin;
