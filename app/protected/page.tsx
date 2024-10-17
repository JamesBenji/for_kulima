import { isMinAdmin } from "@/lib/min_admin_funcs/functions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserAccType } from "../actions";
import VerifiedMinAdmin from "@/components/min-admin/VerifiedMinAdmin";
import { useAdminDetails } from "@/utils/global_state/Store";

export default async function ProtectedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const is_min_admin = await isMinAdmin(user?.email!, supabase);

  const userAccType = await getUserAccType(user.email!);  

  if (is_min_admin?.isMinAdmin === false || is_min_admin.error?.code === 'PGRST116') {
    if (!userAccType) {
      return redirect("/protected/user_details");
    }

    if (userAccType === "field_agent") {
      return redirect("/protected/field_agent");
    }

    if (userAccType === "district_admin") {
      return redirect("/protected/district_admin");
    }

    if (userAccType === "parish_admin") {
      return redirect("/protected/parish_admin");
    }

    return (
      <div>You are not authorized to view the contents of this route.</div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col">
      <VerifiedMinAdmin />
    </div>
  );
}
