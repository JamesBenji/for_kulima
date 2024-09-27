import { isMinAdmin, viewAccessRequests } from "@/lib/min_admin_funcs/functions";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    const mayBeAdminEmail = (await supabase.auth.getUser()).data.user?.email;

    if (mayBeAdminEmail) {
      // checking if request has admin rights
      const isAdmin = await isMinAdmin(mayBeAdminEmail, supabase);

      if (isAdmin.error) {
        throw new Error("You are not authorized to execute this operation.");
      }

      const accessRequests = await viewAccessRequests(supabase)

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
