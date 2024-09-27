// import GrantParishAccessButton from "@/components/client-rej-by-server/district_admin/GrantParishAccessButton";
// import ReGrantParishAccessButton from "@/components/client-rej-by-server/district_admin/ReGrantParishAccessButton";
// import RevokeParishAccessButton from "@/components/client-rej-by-server/district_admin/RevokeParishAccessButton";
// import ViewParishFieldAgentsButton from "@/components/client-rej-by-server/district_admin/ViewParishFieldAgentsButton";
// import ViewParishAdminsButton from "@/components/client-rej-by-server/district_admin/ViewParishAdminsButton";
// import React from "react";
// import ViewMyDistrictFieldAgentsButton from "@/components/client-rej-by-server/district_admin/ViewMyDistrictFieldAgentsButton";
// import ViewParishAccessRequestsButton from "@/components/client-rej-by-server/district_admin/ViewParishAccessRequestsButton";
// import ViewSingleParishAdminButton from "@/components/client-rej-by-server/district_admin/ViewSingleParishAdminButton";

// function DistrictAdminDashboard() {
//   // return (
//   //   <>
//   //     <h1>District Admin Dashboard</h1>

//   //     {/* // view parish access requests */}
//   //     <ViewParishAccessRequestsButton />

//   //     {/* // grant parish access */}
//   //     <GrantParishAccessButton />

//   //     {/* // revoke parish access */}
//   //     <RevokeParishAccessButton />

//   //     {/* // re-grant access */}
//   //     <ReGrantParishAccessButton />

//   //     {/* // view all active parish admins */}
//   //     <ViewParishAdminsButton />

//   //     {/* view single parish admin */}
//   //     <ViewSingleParishAdminButton />

//   //     {/* following undone  */}
//   //     {/* // view each field agent added by parish admin added by district admin */}
//   //     <ViewParishFieldAgentsButton />

//   //     {/* // view field agents in district */}
//   //     <ViewMyDistrictFieldAgentsButton />
//   //   </>
//   // );
// }

// export default DistrictAdminDashboard;

import VerifiedDistrictAdmin from "@/components/district-admin/VerifiedDistrictAdmin";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import React from "react";

const supabase = createClient();

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
