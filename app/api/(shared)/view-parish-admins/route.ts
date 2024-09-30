import { isDistrictAdmin } from "@/lib/district_admin_funcs/functions";
import { isMinAdmin } from "@/lib/min_admin_funcs/functions";
import { viewAllParishAdmins } from "@/lib/shared/functions";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    const mayBeAdminEmail = (await supabase.auth.getUser()).data.user?.email;

    if (mayBeAdminEmail) {
      // is ministry admin
      const isAdmin = await isMinAdmin(mayBeAdminEmail, supabase);
      const isDistAdmin = await isDistrictAdmin(mayBeAdminEmail, supabase);

      // identifying unauthorized users
      if (isAdmin.error && isDistAdmin.extra) {
        throw new Error("You are not authorized to execute this operation.");
      }

      // making custom calls
      if (isAdmin.isMinAdmin) {
        // see all admins
        const response = await viewAllParishAdmins(
          supabase,
          isAdmin.isMinAdmin
        );
        if (response.error) {
          throw new Error("Error fetching all district admins");
        }

        return NextResponse.json(
          {
            data: response.allParishAdmins,
          },
          { status: 200 }
        );
      }

      const response = await viewAllParishAdmins(supabase);

      if (response.error) {
        throw new Error("Error fetching all district admins");
      }

      return NextResponse.json(
        {
          data: response.allParishAdmins,
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
