import { SupabaseClient } from "@supabase/supabase-js";

// view field agents
export async function viewFieldAgents(
  supabase: SupabaseClient<any, "public", any>
) {
  const { data: allFieldAgents, error } = await supabase
    .from("field_agents")
    .select(
      "created_at, email, first_name, last_name, phone_number, organization, gender, allocation, granted_by, hasAccess, sys_role"
    );
  if (error) return { error };

  return { allFieldAgents };
}

// view all parish admins and their details
export async function viewAllParishAdmins(
  supabase: SupabaseClient<any, "public", any>,
  isMin?: boolean
) {
  if (isMin) {
    const { data: allParishAdmins, error } = await supabase
      .from("parish_admin")
      .select(
        "created_at, email, first_name, last_name, sys_role, phone_number, organization, position, gender, allocation, granted_by, hasAccess"
      );

    if (error) return { error };

    return { allParishAdmins };
  }

  const { data: myDist, error: MyDistError } = await supabase
    .from("district_admin")
    .select("district")
    .single();

  const { data: allParishAdmins, error } = await supabase
    .from("parish_admin")
    .select(
      "created_at, email, first_name, last_name, sys_role, phone_number, organization, position, gender, allocation, granted_by, hasAccess"
    )
    .eq("district", myDist?.district);

  if (error) return { error };

  return { allParishAdmins };
}

// view one Parish admin
export async function viewOneParishAdmin(
  district_admin_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data: parishAdmin, error } = await supabase
    .from("parish_admin")
    .select(
      "created_at, email, first_name, last_name, phone_number, organization, position, gender, allocation, granted_by, hasAccess, sys_role"
    )
    .eq("email", district_admin_email)
    .single();

  if (error) return { error };

  return { parishAdmin };
}
