import { createFarmerHTML } from "@/lib/shared/functions";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

async function generateFarmerPDF(farmer: FarmerResponse): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");
  const Chromium = await import("chrome-aws-lambda");
  let browser = null;

  try {
    let executablePath = await Chromium.default.executablePath;

    if (!executablePath) {
      // Fallback for environments where chrome-aws-lambda doesn't work
      console.log(
        "Chrome executable path not found, falling back to default Chrome path"
      );
      executablePath = process.env.CHROME_PATH || "/usr/bin/google-chrome";
    }

    browser = await puppeteer.default.launch({
      args: Chromium.default.args,
      executablePath: executablePath,
      headless: Chromium.default.headless,
    });
    
    const page = await browser.newPage();
    const html = createFarmerHTML(farmer);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfArray = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      printBackground: true,
    });

    return Buffer.from(pdfArray);
  } finally {
    if (browser) await browser.close();
  }
}

async function getFarmer(
  supabase: SupabaseClient<any, "public", any>,
  id: number
) {
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("farmer_uid", id)
    .single();
  if (error) return { error };

  return { data };
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const receivedJSON = await req.json();
    const id = receivedJSON.farmer_id;

    if (id) {
      //  fetch farmer data by id
      const farmer_response = await getFarmer(supabase, id);
      if (farmer_response.error) {
        throw new Error("Error finding farmer with id " + String(id));
      }

      const farmer = farmer_response.data as FarmerResponse;

      const pdfBuffer = await generateFarmerPDF(farmer);

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="farmer_report_${id}.pdf"`,
        },
      });
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
