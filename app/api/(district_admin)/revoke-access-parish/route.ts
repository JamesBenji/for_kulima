import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isDistrictAdmin, revokeParishAdminAccess } from "@/lib/district_admin_funcs/functions";

export async function POST(request: NextRequest) {
  try {
    // assuming the identity of the user
   const supabase = createClient()
    // getting the auth email of the request
    const mayBeDistrictAdminEmail = (await supabase.auth.getUser()).data.user?.email;

    if (mayBeDistrictAdminEmail) {
      // checking if request has admin rights
      const isAdmin = await isDistrictAdmin(mayBeDistrictAdminEmail, supabase);
      console.log({isAdmin});
      

      if(!isAdmin.isDistrictAdmin){
        throw new Error('You are not authorized to execute this operation.')
      }

      const body = await request.json();
      // operation: Grant district admin access
      const { target_mail } = body;
      
      if(target_mail){
        const result = await revokeParishAdminAccess(target_mail, supabase)

        if(result.error){
          throw new Error('Failed to revoke access')
        }

        return NextResponse.json(
          {
            message: "Access to system revoked",
            target_mail,
            revoked: result.revoked,
          },
          { status: 200 }
        );
      } else {
        throw new Error('Invalid request parameters. Target not found')
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
