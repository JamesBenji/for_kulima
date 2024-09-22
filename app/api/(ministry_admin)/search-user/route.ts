import { NextRequest, NextResponse } from "next/server";
import {
  approveAccessRequest,
  isMinAdmin,
  reGrantDistrictAdminAccess,
  revokeDistrictAdminAccess,
  SearchUserGlobal,
} from "@/lib/min_admin_funcs/functions";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // assuming the identity of the user
    const supabase = createClient();
    // getting the auth email of the request
    const mayBeAdminEmail = (await supabase.auth.getUser()).data.user?.email;

    if (mayBeAdminEmail) {
      // checking if request has admin rights
      const isAdmin = await isMinAdmin(mayBeAdminEmail, supabase);

      if (isAdmin.error) {
        throw new Error("You are not authorized to execute this operation.");
      }

      const body = await request.json();
      // operation: Grant district admin access
      const { target_mail } = body;

      if (target_mail) {
        const result = await SearchUserGlobal(target_mail, supabase);

        if (result?.found_user)
          return NextResponse.json(
            {
              message: "User found",
              target_mail,
              user: result?.found_user,
              sys_role: result?.found_user.sys_role,
            },
            { status: 200 }
          );

        return NextResponse.json(
          {
            message: "No user found",
            target_mail,
          },
          { status: 200 }
        );
      } else {
        throw new Error("Invalid request parameters. Target not found");
      }
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
