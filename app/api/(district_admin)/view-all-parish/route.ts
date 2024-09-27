
import { isDistrictAdmin, viewAllParishAdmins } from "@/lib/district_admin_funcs/functions";
import { isMinAdmin } from "@/lib/min_admin_funcs/functions";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    const mayBeAdminEmail = (await supabase.auth.getUser()).data.user?.email;

    if (mayBeAdminEmail) {
      // checking if request has admin rights
      const isAdmin = await isDistrictAdmin(mayBeAdminEmail, supabase);
      const isMin_admin = await isMinAdmin(mayBeAdminEmail, supabase);

      if (!isAdmin.isDistrictAdmin && !isMin_admin.isMinAdmin) {
        throw new Error("You are not authorized to execute this operation.");
      }

      const response = await viewAllParishAdmins(supabase, isMin_admin.isMinAdmin)

      if(response.error){
        throw new Error('Error fetching all district admins')
      }

      return NextResponse.json({
        data: response.data,
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
