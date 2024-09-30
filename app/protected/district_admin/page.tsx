
import VerifiedDistrictAdmin from "@/components/district-admin/VerifiedDistrictAdmin";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import React from "react";


const adminHasAccess = async (
  supabase: SupabaseClient<any, "public", any>,
  email: string
) => {
  const { data } = await supabase
    .from("district_admin")
    .select("hasAccess")
    .eq("email", email)
    .single();
  if (data?.hasAccess === false) {
    return false;
  }
  return true;
};

async function DistrictAdmin() {
  const supabase = createClient();

  const email = (await supabase.auth.getUser()).data.user?.email;
  const hasAccess = await adminHasAccess(supabase, email!);

  if (!hasAccess) {
    return <div>Your access has been revoked</div>;
  }
  
  return (
    <div className="flex-1 h-full flex flex-col">
      <VerifiedDistrictAdmin />
    </div>
  );
}

export default DistrictAdmin;
