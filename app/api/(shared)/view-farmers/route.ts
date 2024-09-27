import { isDistrictAdmin } from "@/lib/district_admin_funcs/functions";
import { isMinAdmin } from "@/lib/min_admin_funcs/functions";
import { isParishAdmin } from "@/lib/parish_admin_funcs/functions";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    const mayBeAdmin = (await supabase.auth.getUser()).data.user?.email;

    if (mayBeAdmin) {
      // checking if request has admin rights
      const isMin_admin = await isMinAdmin(mayBeAdmin, supabase);
      const isDistrict_admin = await isDistrictAdmin(mayBeAdmin, supabase);
      const isParish_admin = await isParishAdmin(mayBeAdmin, supabase);

      if (isMin_admin.isMinAdmin) {
        // view all farmers
        const { data, error } = await supabase
          .from("farmers")
          .select(
            "first_name, last_name, dob, email, tel, gender, household_size, no_children, count_school_going, average_income_per_harvest, other_income_sources, added_by, address"
          );

        if (error) {
          console.log({ MinAdminFetchError: error });
          throw new Error("Error: Authorized but failed to fetch the data");
        }

        return NextResponse.json(
          {
            data,
          },
          { status: 200 }
        );
      }

      if (isDistrict_admin.isDistrictAdmin) {
        // view district farmers
        // fetch my district
        const { data: myDistrict, error: districtError } = await supabase
          .from("district_admin")
          .select("district")
          .single();
        if (districtError) {
          console.log({ DistFetchError: districtError });
          throw new Error("Error finding your district");
        }
        const district = myDistrict.district;

        // fetch corresponding data
        const { data, error } = await supabase
          .from("farmers")
          .select(
            "first_name, last_name, dob, email, tel, gender, household_size, no_children, count_school_going, average_income_per_harvest, other_income_sources, added_by, address"
          )
          .eq("district", district);

        if (error) {
          console.log({ DistrictAdminError: error });
          throw new Error("Error: Authorized but failed to fetch the data");
        }

        return NextResponse.json(
          {
            data,
          },
          { status: 200 }
        );
      }
      if (isParish_admin.isParishAdmin) {
        // view parish farmers
        // fetch my parish and district
        const { data: myArea, error: myAreaError } = await supabase
          .from("parish_admin")
          .select("district, parish")
          .single();
        if (myAreaError) {
          console.log({ DistFetchError: myAreaError });
          throw new Error("Error finding your district and parish");
        }

        // fetch corresponding data
        const { data, error } = await supabase
          .from("farmers")
          .select(
            "first_name, last_name, dob, email, tel, gender, household_size, no_children, count_school_going, average_income_per_harvest, other_income_sources, added_by, address"
          )
          .eq("district", myArea.district)
          .eq("parish", myArea.parish);

        if (error) {
          console.log({ ParishAdminError: error });
          throw new Error("Error: Authorized but failed to fetch the data");
        }

        console.log({data})

        return NextResponse.json(
          {
            data,
          },
          { status: 200 }
        );
      }

      if (isMin_admin.error && isDistrict_admin.extra && isParish_admin.extra) {
        throw new Error("You are not authorized to execute this operation.");
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
