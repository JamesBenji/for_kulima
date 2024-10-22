import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import {  NextResponse } from "next/server";

function generateFarmersHTML(farmers: FarmerResponse[]): string {
  const tableRows = farmers?.map(
      (farmer: any) => `
        <tr>
            <td>${farmer?.first_name || "N/A"} ${farmer?.last_name || "N/A"}</td>
            <td>${farmer?.dob || "N/A"}</td>
            <td>${farmer?.gender || "N/A"}</td>
            <td>${farmer?.email || "N/A"}</td>
            <td>${farmer?.tel?.[0] || "N/A"}</td>
            <td>${farmer?.address || "N/A"}</td>
            <td>${farmer?.district || "N/A"}</td>
            <td>${farmer?.parish || ""}</td>
            <td>${farmer?.household_size || "N/A"}</td>
            <td>${farmer?.no_children || "N/A"}</td>
            <td>${farmer?.count_school_going || "N/A"}</td>
            <td>${farmer?.average_income_per_harvest || "N/A"}</td>
            <td>${farmer?.other_income_sources?.map((source: any) => source?.income_name)?.join(", ")}</td>
            <td>${farmer?.farmer_uid || "N/A"}</td>
        </tr>
    `
    )
    .join("");

  return `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.3;
            margin: 10px 30px
        }
        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px
        }
        th, td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <h1>Farmers Data</h1>
    <table id='my-table'>
        <thead>
            <tr>
                <th>Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>District</th>
                <th>Parish</th>
                <th>Household Size</th>
                <th>Children</th>
                <th>School-going</th>
                <th>Avg Income/Harvest</th>
                <th>Other Income Sources</th>
                <th>Farmer UID</th>
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>
</body>
</html>
    `;
}

function generateFarmersPDF(farmers: FarmerResponse[]) {
  try {

    const html = generateFarmersHTML(farmers);

  return {html}

  } catch(error){
    console.error('All-farmers-pdf browser error: ', error)

    return {error}
  }
}

async function getFarmers(
  supabase: SupabaseClient<any, "public", any>,
) {
  const { data, error } = await supabase
    .from("farmers")
    .select("*")

  if (error) return { error };

  return { data };
}

export async function GET() {
  const supabase = createClient();
  try {
      //  fetch farmer data by id
      const farmer_response = await getFarmers(supabase);
      if (farmer_response.error) {
        throw new Error("Error getting farmers");
      }

      const farmers = farmer_response.data as FarmerResponse[] || [];

      const resHTML = generateFarmersPDF(farmers);

      return NextResponse.json({html_text: JSON.stringify(resHTML.html)}, {
        status: 200
      })
    
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
