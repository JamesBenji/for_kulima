import { SupabaseClient } from "@supabase/supabase-js";

// isDistrictAdmin?
export async function isDistrictAdmin(
  email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data, error } = await supabase
    .from("district_admin")
    .select("email")
    .eq("email", email)
    .single();
  if (error?.code === "PGRST116") return { isDistrictAdmin: false };
  if (data) return { isDistrictAdmin: true };
  return { isDistrictAdmin: false, extra: "Not PGRST116" };
}

// view access requests
export async function viewParishAccessRequests(
  supabase: SupabaseClient<any, "public", any>
) {
  // add my email later
  const myEmail = (await supabase.auth.getUser()).data.user?.email;
  const { data: myDistrict, error: district_error } = await supabase
    .from("district_admin")
    .select("district")
    .eq("email", myEmail)
    .single();    

    const dist = myDistrict?.district

  if (district_error) return { error: district_error };

  const { data: accessRequests, error } = await supabase
    .from("parish_account_requests")
    .select(
      "created_at, requestor_email, image, requested_position, first_name, last_name, phone_number, organization, position, gender, granted_as"
    )
    .eq("district", dist)
    .eq("granted_as", "null");

  if (error) return { error };  

  return { accessRequests };
}

// approve access request
export async function approveParishAccessRequest(
  requestor_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const granted_by = (await supabase.auth.getUser()).data.user?.email;
  const { error } = await supabase
    .from("parish_account_requests")
    .update([
      {
        granted_as: "parish_admin",
        granted_by,
        granted_on: new Date().toISOString(),
      },
    ])
    .eq("requestor_email", requestor_email);

  if (error) {
    console.log({ approveParishAccessRequestError: error });
    return { error };
  }
}

// revoke account access
export async function revokeParishAdminAccess(
  parish_admin_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { error } = await supabase
    .from("parish_admin")
    .update([{ hasAccess: false }])
    .eq("email", parish_admin_email);
  if (error) {
    console.log({ revokeParishAdminAccessError: error });
    return { error };
  }
  return { revoked: true };
}

// reGrant access
export async function reGrantParishAdminAccess(
  parish_admin_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { error } = await supabase
    .from("parish_admin")
    .update([{ hasAccess: true }])
    .eq("email", parish_admin_email);
  if (error) {
    console.log({ reGrantParishAdminAccessError: error });
    return { error };
  }
  return { regranted: true };
}

// view all parish admins
export async function viewAllParishAdmins(
  supabase: SupabaseClient<any, "public", any>,
  isMin?: boolean
) {
  const myEmail = (await supabase.auth.getUser()).data.user?.email;

  if (!isMin) {
    const { data, error } = await supabase
      .from("parish_admin")
      .select(
        "created_at, email, first_name, last_name, phone_number, organization, position, gender, allocation, granted_by, district, parish, sys_role, hasAccess"
      )
      .eq("granted_by", myEmail);
    if (error) return { error };
    return { data };
  } else {
    const { data, error } = await supabase
      .from("parish_admin")
      .select(
        "created_at, email, first_name, last_name, phone_number, organization, position, gender, allocation, granted_by, district, parish, sys_role, hasAccess"
      );
    if (error) return { error };
    return { data };
  }
}

// view field agents added by parish admins

// view all farmers added, details

// view all farms

// graph of farmers and farms added per month

// recieve notification for pending approvals

// see NIN details
