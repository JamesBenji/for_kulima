import { isDistrictAdmin } from "@/lib/district_admin_funcs/functions";
import { viewOneParishAdmin } from "@/lib/shared/functions";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    const body = await request.json();

    const { target_mail } = body;

    if (!target_mail) {
      throw new Error("No district admin email was provided");
    }

    const mayBeAdminEmail = (await supabase.auth.getUser()).data.user?.email;

    if (mayBeAdminEmail) {
      // checking if request has admin rights
      const isAdmin = await isDistrictAdmin(mayBeAdminEmail, supabase);

      if (!isAdmin.isDistrictAdmin) {
        throw new Error("You are not authorized to execute this operation.");
      }

      const response = await viewOneParishAdmin(target_mail, supabase);

      if (response.error) {
        throw new Error("Error fetching all district admins");
      }

      return NextResponse.json(
        {
          parishAdmin: response.parishAdmin,
        },
        { status: 200 }
      );
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
