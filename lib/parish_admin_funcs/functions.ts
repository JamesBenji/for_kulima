import { SupabaseClient } from "@supabase/supabase-js";

// isDistrictAdmin?
export async function isParishAdmin(
  email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data, error } = await supabase
    .from("parish_admin")
    .select("email")
    .eq("email", email)
    .single();
  if (error?.code === "PGRST116") return { isParishAdmin: false };
  if (data) return { isParishAdmin: true };
  return { isParishAdmin: false, extra: "Not PGRST116" };
}

// view access requests
export async function viewAgentAccessRequests(
  supabase: SupabaseClient<any, "public", any>
) {
  // add my email later
  const { data: accessRequests, error } = await supabase
    .from("field_agent_account_requests")
    .select(
      "created_at, image,requestor_email, requested_position, first_name, last_name, phone_number, organization, position, gender, granted_as"
    )
    .eq("granted_as", "null");

  if (error) return { error };

  return { accessRequests };
}

// approve access request
export async function approveAgentAccessRequest(
  requestor_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const granted_by = (await supabase.auth.getUser()).data.user?.email;
  const { error } = await supabase
    .from("field_agent_account_requests")
    .update([
      {
        granted_as: "field_agent",
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
export async function revokeAgentAccess(
  email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { error } = await supabase
    .from("field_agents")
    .update([{ hasAccess: false }])
    .eq("email", email);
  if (error) {
    console.log({ revokeAgentAccessError: error });
    return { error };
  }
  return { revoked: true };
}

// reGrant access
export async function reGrantAgentAccess(
  email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { error } = await supabase
    .from("field_agents")
    .update([{ hasAccess: true }])
    .eq("email", email);
  if (error) {
    console.log({ reGrantAgentAccessError: error });
    return { error };
  }
  return { regranted: true };
}

// view all parish admins
export async function viewAllParishAgents(
  supabase: SupabaseClient<any, "public", any>
) {
  const { data: allParishAgents, error } = await supabase
    .from("field_agents")
    .select(
      "created_at, email, first_name, last_name, phone_number, organization, position, gender, allocation, granted_by, hasAccess, image"
    );
  if (error) return { error };
  return { allParishAgents };
}


export async function viewSingleParishAgent(
  supabase: SupabaseClient<any, "public", any>,
  email: string
){
  const { data: parishAgent, error } = await supabase
    .from("field_agents")
    .select(
      "created_at, email, first_name, last_name, phone_number, organization, position, gender, allocation, granted_by, hasAccess"
    ).eq('email', email)
  if (error) return { error };
  return { parishAgent };
}
export async function viewSingleParishAgentByFName(
  supabase: SupabaseClient<any, "public", any>,
  name: string
){
  const { data: parishAgent, error } = await supabase
    .from("field_agents")
    .select(
      "created_at, email, first_name, last_name, phone_number, organization, position, gender, allocation, granted_by, hasAccess"
    ).eq('first_name', name)
  if (error) return { error };
  return { parishAgent };
}
// view field agents added by parish admins

// view all farmers added, details

// view all farms

// graph of farmers and farms added per month

// recieve notification for pending approvals

// see NIN details
