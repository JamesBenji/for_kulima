import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function generateFarmsHTML(farms: FarmResponse[]): string {
  // Helper functions
  const formatArrayItems = (items: any[], keyField: string) => 
    items?.map(item => item[keyField]).join(", ") || "N/A";

  const formatNestedItems = (items: any[], nameField: string, descField: string) =>
    items?.map(item => `${item[nameField]}: ${item[descField]}`).join("; ") || "N/A";

  const formatCoordinates = (coords: { lat: number; lon: number }[]) =>
    coords
      ?.map(
        (coord, idx) => `<p>${idx + 1}: (${coord.lat}, ${coord.lon})</p>\n`
      )
      .join('') || "N/A";

  // Generate table rows
  const tableRows = farms?.map(farm => `
    <tr>
      <td>${farm?.farm_name || "N/A"}</td>
      <td>${farm?.type || "N/A"}</td>
      <td>${farm?.farm_owner || "N/A"}</td>
      <td>${farm?.district || "N/A"}</td>
      <td>${farm?.parish || "N/A"}</td>
      <td>${farm?.location || "N/A"}</td>
      <td>${farm?.land_size || "N/A"} ${farm?.land_units || ""}</td>
      <td>${farm?.crops?.join(", ") || "N/A"}</td>
      <td>${farm?.land_use?.map(use => `${use.crop}: ${use.land_size}`).join(", ") || "N/A"}</td>
      <td>${farm?.average_quantity_produced || "N/A"} ${farm?.quantity_units || ""}</td>
      <td>${farm?.labourers || "N/A"}</td>
      <td>${formatNestedItems(farm?.current_machinery || [], "machine_name", "purpose")}</td>
      <td>${formatNestedItems(farm?.previous_machinery || [], "machine_name", "purpose")}</td>
      <td>${farm?.water_source?.type || "N/A"} (${farm?.water_source?.distance_from_farm || "N/A"}m)</td>
      <td>${farm?.is_water_contaminated ? "Yes" : "No"}</td>
      <td>${formatNestedItems(farm?.pests || [], "pest_name", "effect")}</td>
      <td>${formatNestedItems(farm?.pest_control || [], "pest", "control_measure")}</td>
      <td>${farm?.fertilizers?.map(f => `${f.type} (${f.frequency})`).join(", ") || "N/A"}</td>
      <td class="coordinates">${formatCoordinates(farm?.geo_location || [])}</td>
      <td>${farm?.added_by || "N/A"}</td>
    </tr>
  `).join("");

  return `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farms Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.3;
            margin: 10px 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: left;
            vertical-align: top;
            font-size: 8px;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .coordinates {
            white-space: pre-line;
        }
    </style>
</head>
<body>
    <h1>Farms Report</h1>
    <table id='my-table'>
        <thead>
            <tr>
                <th>Farm Name</th>
                <th>Type</th>
                <th>Owner</th>
                <th>District</th>
                <th>Parish</th>
                <th>Location</th>
                <th>Land Size</th>
                <th>Crops</th>
                <th>Land Use</th>
                <th>Avg Quantity</th>
                <th>Laborers</th>
                <th>Current Machinery</th>
                <th>Previous Machinery</th>
                <th>Water Source</th>
                <th>Contaminated</th>
                <th>Pests</th>
                <th>Pest Control</th>
                <th>Fertilizers</th>
                <th>Coordinates</th>
                <th>Added By</th>
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>
</body>
</html>`;
}

async function getFarms(supabase: SupabaseClient<any, "public", any>, district: string) {
  const { data, error } = await supabase
    .from("farms")
    .select("*").eq("district", district);
    
  if (error) return { error };
  return { data };
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const receivedJSON = await req.json();
    const district = receivedJSON.district;

    if(!district){
      throw new Error('No district supplied')
    }

    const farms_response = await getFarms(supabase, district);
    
    if (farms_response.error) {
      throw new Error("Error getting farms data");
    }

    const farms = farms_response.data as FarmResponse[] || [];
    const resHTML = generateFarmsHTML(farms);

    return NextResponse.json(
      { html_text: resHTML },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}