import { isMinAdmin} from "@/lib/min_admin_funcs/functions";
import { viewFieldAgents } from "@/lib/shared/functions";
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

      const response = await viewFieldAgents(supabase)

      if(response.error){
        throw new Error('Error fetching all field agents')
      }

      return NextResponse.json({
        allFieldAgents: response.allFieldAgents,
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
