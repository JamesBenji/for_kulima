import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { submitAccountRequest } from "@/lib/request-account/functions";
import { error } from "console";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const applicant_email = (await supabase.auth.getUser()).data.user?.email;

    if (!applicant_email)
      throw new Error("Unauthorized. Please log in to your account");

    const body = await request.json();

    const { applicant_data } = body;

    if(!applicant_data) throw new Error('Missing data')

    const response = await submitAccountRequest(supabase, applicant_data)

    if(response?.alreadyApplied) return NextResponse.json({
      message: "You have already applied for an account",
    }, {status: 200})

    console.log({error: response?.error});
    
    if(response?.error) throw new Error('Error submitting account data')

    return NextResponse.json({
      message: "Account Request success"
    }, {status: 200})
    
    
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
