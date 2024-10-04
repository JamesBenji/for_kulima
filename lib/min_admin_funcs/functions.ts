// the ministry admin can approve district admins request to join the platform, revoke access to the web platform ie locked access.

import { SupabaseClient } from "@supabase/supabase-js";
import { viewOneParishAdmin } from "../shared/functions";

// the ministry admin can view all district admins he has added, when he added them, where they are working and how many parish admins they have added and who the parish admins are; and how many they are

/** FUNCTIONS */

// isMinAdmin?
export async function isMinAdmin(
  email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data, error } = await supabase
    .from("ministry_admin")
    .select("email")
    .eq("email", email)
    .single();
  if (error) {
    // console.log({ isAdminError: error });
    return { error };
  }
  if (data) {
    return { isMinAdmin: true };
  } else {
    return { isMinAdmin: false };
  }
}

// view access requests
export async function viewAccessRequests(
  supabase: SupabaseClient<any, "public", any>
) {
  // add my email later
  const { data: accessRequests, error } = await supabase
    .from("district_account_requests")
    .select(
      "created_at, requestor_email,image, requested_position, first_name, last_name, phone_number, organization, position, gender, granted_as"
    )
    .eq("granted_as", "null");

  if (error) return { error };

  return { accessRequests };
}

// approve access request
export async function approveAccessRequest(
  requestor_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const granted_by = (await supabase.auth.getUser()).data.user?.email;
  const { data, error } = await supabase
    .from("district_account_requests")
    .update([
      {
        granted_as: "district_admin",
        granted_by,
        granted_on: new Date().toISOString(),
      },
    ])
    .eq("requestor_email", requestor_email)
    .select("*");

  if (error) {
    // console.log({ approveAccessRequestError: error });
    return { error };
  }
  return { data };
}

// revoke account access
export async function revokeDistrictAdminAccess(
  district_admin_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data, error } = await supabase
    .from("district_admin")
    .update([{ hasAccess: false }])
    .eq("email", district_admin_email)
    .select("hasAccess");
  if (error) {
    // console.log({ revokeDistrictAdminAccessError: error });

    return { error };
  }

  return { revoked: true, data };
}

// reGrant access
export async function reGrantDistrictAdminAccess(
  district_admin_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data, error } = await supabase
    .from("district_admin")
    .update([{ hasAccess: true }])
    .eq("email", district_admin_email)
    .select("hasAccess");
  if (error) {
    // console.log({ revokeDistrictAdminAccessError: error });

    return { error };
  }

  return { regranted: true, data };
}

// view all district admins
export async function viewAllDistrictAdmins(
  supabase: SupabaseClient<any, "public", any>
) {
  const { data: allDistrictAdmins, error } = await supabase
    .from("district_admin")
    .select(
      "created_at, email, first_name, sys_role, image, last_name, phone_number, organization, position, gender, allocation, granted_by, hasAccess, district, parish"
    );

  if (error) return { error };

  return { allDistrictAdmins };
}

// view district admin personal and allocation data
export async function viewOneDistrictAdmin(
  district_admin_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data: districtAdmin, error } = await supabase
    .from("district_admin")
    .select(
      "created_at, email, first_name, last_name, phone_number, organization, position, gender, allocation, granted_by, hasAccess, sys_role"
    )
    .eq("email", district_admin_email)
    .single();

  if (error) return { error };

  return { districtAdmin };
}

// search for any system user
export async function SearchUserGlobal(
  user_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const found_user_district = await viewOneDistrictAdmin(user_email, supabase);

  if (found_user_district.districtAdmin)
    return { found_user: found_user_district.districtAdmin };

  const found_user_parish = await viewOneParishAdmin(user_email, supabase);

  if (found_user_parish.parishAdmin)
    return { found_user: found_user_parish.parishAdmin };

  // checking in field agents - later
}

// view field agents added by parish admins

// view all farmers added, details

// view all farms

// graph of farmers and farms added per month

// recieve notification for pending approvals

// see NIN details
