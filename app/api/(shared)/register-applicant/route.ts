import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Convert FormData to a plain object (optional)
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const imageFile = formData.get("image") as File | null;

    const supabase = createClient();
    const email = (await supabase.auth.getUser()).data.user?.email;


    const imageUploadRes = await supabase.storage
      .from("applicants")
      .upload(`/private/${imageFile?.name}`, imageFile!, {
        contentType: "image/*",
      });

    if (imageUploadRes?.error) {
      console.error("error", imageUploadRes.error);
    }

    const { data: publicUrlData } = supabase.storage
      .from("applicants")
      .getPublicUrl(`/private/${imageFile?.name}`);

    const imageUrl = publicUrlData.publicUrl;

    // write to db
    if (data.requested_position === "district_admin") {
      const { error } = await supabase
        .from("district_account_requests")
        .insert([
          {
            first_name: data.first_name,
            last_name: data.last_name,
            image: imageUrl,
            organization: data.organization,
            position: data.position,
            gender: data.gender,
            district: data.district,
            parish: data.parish,
            requested_position: data.requested_position,
            phone_number: [data.phone_number],
            requestor_email: email,
          },
        ]);

        if(error){
            console.log({error});
            throw new Error(error.message)            
        }
        return NextResponse.json({saved: true}, { status: 200 });
    }
    if (data.requested_position === "parish_admin") {
        const { error } = await supabase
        .from("parish_account_requests")
        .insert([
          {
            first_name: data.first_name,
            last_name: data.last_name,
            image: imageUrl,
            organization: data.organization,
            position: data.position,
            gender: data.gender,
            district: data.district,
            parish: data.parish,
            requested_position: data.requested_position,
            phone_number: [data.phone_number],
            requestor_email: email,
          },
        ]);

        if(error){
            console.log({error});
            throw new Error(error.message)            
        }
        return NextResponse.json({saved: true}, { status: 200 });
    }
    if (data.requested_position === "field_agent") {
        const { error } = await supabase
        .from("field_agent_account_requests")
        .insert([
          {
            first_name: data.first_name,
            last_name: data.last_name,
            image: imageUrl,
            organization: data.organization,
            position: data.position,
            gender: data.gender,
            district: data.district,
            parish: data.parish,
            requested_position: data.requested_position,
            phone_number: [data.phone_number],
            requestor_email: data.email,
          },
        ]);

        if(error){
            console.log({error});
            throw new Error(error.message)            
        }
        return NextResponse.json({saved: true}, { status: 200 });
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
