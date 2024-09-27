import { SupabaseClient } from "@supabase/supabase-js";

export async function hasMadeRequest(
  supabase: SupabaseClient<any, "public", any>,
  applicant_email: string
) {
  const { data, error } = await supabase
    .from("has_made_request")
    .select("id, requested_position")
    .eq("id", applicant_email);

  if (error?.code === "PGRST116") {
    return false;
  }

  if (data === null) return false;

  if (error) return { error };

  if (data[0]?.id === applicant_email) {
    return true;
  }

  return false;
}
export async function hasRequestedRole(
  supabase: SupabaseClient<any, "public", any>,
  applicant_email: string
) {
  const { data, error } = await supabase
    .from("has_made_request")
    .select("id, requested_position")
    .eq("id", applicant_email)
    .single();

  if (error?.code === "PGRST116") {
    return false;
  }
  
  if (error) return { error };

  return { id: data.id, requested_position: data.requested_position };
}

export async function submitAccountRequest(
  supabase: SupabaseClient<any, "public", any>,
  data: AccountApplicationData
) {
  const row: AccountApplicationData = {
    first_name: data.first_name,
    last_name: data.last_name,
    requestor_email: data.requestor_email,
    phone_number: data.phone_number,
    organization: data.organization,
    position: data.position,
    gender: data.gender,
    allocation: data.allocation,
    requested_position: data.requested_position,
  };

  const hasPreviouslyRequested = await hasMadeRequest(
    supabase,
    row.requestor_email
  );

  if (hasPreviouslyRequested === true) return { alreadyApplied: true };

  if (row.requested_position === "district_admin") {
    const { error } = await supabase
      .from("district_account_requests")
      .insert([row]);
    if (error) return { error };
    return { submitted: true };
  }

  if (row.requested_position === "parish_admin") {
    const { error } = await supabase
      .from("parish_account_requests")
      .insert([row]);
    if (error) return { error };
    return { submitted: true };
  }
}
