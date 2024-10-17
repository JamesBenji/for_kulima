import { SupabaseClient } from "@supabase/supabase-js";

// view field agents
export async function viewFieldAgents(
  supabase: SupabaseClient<any, "public", any>
) {
  const { data: allFieldAgents, error } = await supabase
    .from("field_agents")
    .select(
      "created_at, email, first_name, last_name, phone_number, organization, gender, allocation, granted_by, hasAccess, sys_role"
    );
  if (error) return { error };

  return { allFieldAgents };
}

// view all parish admins and their details
export async function viewAllParishAdmins(
  supabase: SupabaseClient<any, "public", any>,
  isMin?: boolean
) {
  if (isMin) {
    const { data: allParishAdmins, error } = await supabase
      .from("parish_admin")
      .select(
        "created_at, email, first_name, last_name, sys_role, phone_number, organization, position, gender, allocation, granted_by, hasAccess"
      );

    if (error) return { error };

    return { allParishAdmins };
  }

  const { data: myDist, error: MyDistError } = await supabase
    .from("district_admin")
    .select("district")
    .single();

  const { data: allParishAdmins, error } = await supabase
    .from("parish_admin")
    .select(
      "created_at, email, first_name, last_name, sys_role, phone_number, organization, position, gender, allocation, granted_by, hasAccess"
    )
    .eq("district", myDist?.district);

  if (error) return { error };

  return { allParishAdmins };
}

// view one Parish admin
export async function viewOneParishAdmin(
  district_admin_email: string,
  supabase: SupabaseClient<any, "public", any>
) {
  const { data: parishAdmin, error } = await supabase
    .from("parish_admin")
    .select(
      "created_at, email, first_name, last_name, phone_number, organization, position, gender, allocation, granted_by, hasAccess, sys_role"
    )
    .eq("email", district_admin_email)
    .single();

  if (error) return { error };

  return { parishAdmin };
}

export function createFarmerHTML(farmer: FarmerResponse): string {
    const telString = farmer?.tel?.[0] || 'N/A';
    const otherIncomeSources = farmer?.other_income_sources
        .map(source => `<li>${source?.income_name}</li>`)
        .join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farmer: ${farmer?.first_name} ${farmer?.last_name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            color: #2980b9;
        }
        .farmer-image {
            max-width: 200px;
            max-height: 200px;
            border-radius: 50%;
            display: block;
            margin: 20px auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Farmer Data</h1>
    
    ${farmer?.image ? `<img src="${farmer?.image}" alt="Farmer's Image" class="farmer-image">` : ''}
    
    <div class="section">
        <span class="section-title">Personal Information:</span>
        <p>
            Name: ${farmer?.first_name || 'N/A'} ${farmer?.last_name || 'N/A'}<br>
            Date of Birth: ${farmer?.dob || 'N/A'}<br>
            Gender: ${farmer?.gender || 'N/A'}<br>
            NIN: ${farmer?.nin || 'N/A'}<br>
            Email: ${farmer?.email}<br>
            Phone: ${telString || 'N/A'}<br>
            Address: ${farmer?.address || 'N/A'}<br>
            District: ${farmer?.district || 'N/A'}<br>
            Parish: ${farmer?.parish || 'N/A'}
        </p>
    </div>

    <div class="section">
        <span class="section-title">Household Information:</span>
        <p>
            Household Size: ${farmer?.household_size || 'N/A'}<br>
            Number of Children: ${farmer?.no_children || 'N/A'}<br>
            Number of School-going Children: ${farmer?.count_school_going || 'N/A'}
        </p>
    </div>

    <div class="section">
        <span class="section-title">Income Information:</span>
        <p>
            Average Income per Harvest: ${farmer?.average_income_per_harvest || 'N/A'}
        </p>
        <p>Other Income Sources:</p>
        <ul>
            ${otherIncomeSources || 'N/A'}
        </ul>
    </div>

    <div class="section">
        <span class="section-title">Additional Information:</span>
        <p>
            Farmer UID: ${farmer?.farmer_uid || 'N/A'}<br>
            Added By: ${farmer?.added_by}
        </p>
    </div>
</body>
</html>
    `;

    return html;
}

export const DownloadFarmerReport = async ( farmerId: number) => {
    try {
      const response = await fetch('/api/farmer-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farmer_id: farmerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the response as a Blob (PDF file)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `KULIMA REPORT- Farmer_${farmerId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return {downloaded: true}
    } catch (error) {
      console.error('Error downloading PDF:', error);
      return {error}
    }
  
}

export const DownloadAllFarmersReport = async () => {
    try {
      const response = await fetch('/api/all-farmers-pdf');

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the response as a Blob (PDF file)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `KULIMA REPORT- All Farmers.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return {downloaded: true}
    } catch (error) {
      console.error('Error downloading PDF:', error);
      return {error}
    }
  
}

export const DownloadDistrictFarmersReport = async (district: string) => {
    try {
      const response = await fetch('/api/all-district-farmers-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({district: district})
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the response as a Blob (PDF file)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `KULIMA REPORT- ${district}_farmers.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return {downloaded: true}
    } catch (error) {
      console.error('Error downloading PDF:', error);
      return {error}
    }
 
}