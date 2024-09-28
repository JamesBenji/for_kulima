import { isMinAdmin } from "@/lib/min_admin_funcs/functions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserAccType } from "../actions";
import VerifiedMinAdmin from "@/components/min-admin/VerifiedMinAdmin";

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
  // console.log({userAccType, is_min_admin});
  

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
    // <div className="flex-1 w-full flex flex-col gap-12">
    //   <div className="w-full">
    //     {/* <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
    //       <InfoIcon size="16" strokeWidth={2} />
    //       This is a protected page that you can only see as an authenticated
    //       user
    //     </div> */}
    //   </div>

    //   <GrantAccessButton />

    //   <ViewAccessRequestsButton />

    //   <RevokeAccessButton />

    //   <ReGrantAccessButton />

    //   <ViewDistrictAdminsButton />

    //   <ViewSingleDistrictAdminButton />

    //   <ViewParishAdminsButton />

    //   <SearchUserButton />

    //   <ViewFieldAgentsButton />
    // </div>
  );
}
