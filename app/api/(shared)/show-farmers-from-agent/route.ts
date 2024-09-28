import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const receivedJSON = await req.json();

    // console.log({receivedJSON});
    
    
    if (receivedJSON.email) {
      const { data, error } = await supabase
        .from("farmers")
        .select("*")
        .eq("added_by", decodeURIComponent(receivedJSON.email));

      if (error) {        
        console.log({error});
        
        throw new Error(error.message);
      }

      // console.log({data});
      

      return NextResponse.json({data}, {status: 200});
    } else {
      throw new Error("No data was passed into the request.");
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
