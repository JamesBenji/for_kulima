
import { isParishAdmin, viewAgentAccessRequests } from "@/lib/parish_admin_funcs/functions";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    const mayBeDistrictAdminEmail = (await supabase.auth.getUser()).data.user?.email;

    if (mayBeDistrictAdminEmail) {
      // checking if request has admin rights
      const isAdmin = await isParishAdmin(mayBeDistrictAdminEmail, supabase);

      if (!isAdmin.isParishAdmin) {
        throw new Error("You are not authorized to execute this operation.");
      }

      const accessRequests = await viewAgentAccessRequests(supabase)

      return NextResponse.json({
        accessRequests,
      }, {status: 200})
    } else {
      throw new Error("Failed to get user session data");
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
