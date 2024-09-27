
import { isParishAdmin, viewSingleParishAgent, viewSingleParishAgentByFName } from "@/lib/parish_admin_funcs/functions";
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
      const isAdmin = await isParishAdmin(mayBeAdminEmail, supabase);

      if (!isAdmin.isParishAdmin) {
        throw new Error("You are not authorized to execute this operation.");
      }

      const response = await viewSingleParishAgentByFName(supabase, target_mail); //rather target name

      if (response.error) {
        throw new Error("Error fetching all district admins");
      }

      return NextResponse.json(
        {
          parishAgent: response.parishAgent,
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
