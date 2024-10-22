"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Dashboard from "@/components/protected_dashboard/dashboard";
import ViewAllFarmersButton from "../client-rej-by-server/parish_admin/ViewAllFarmersButton";
import ViewAllFarmsButton from "../client-rej-by-server/parish_admin/ViewAllFarmsButton";
import ViewParishAdminsButton from "../client-rej-by-server/district_admin/ViewParishAdminsButton";
import ViewParishAccessRequestsButton from "../client-rej-by-server/district_admin/ViewParishAccessRequestsButton";
import StatsDashboard from "../dashboard/Dashboard";
import { useAdminDetails } from "@/utils/global_state/Store";
import { cleanHtml } from "@/lib/shared/functions";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

import { jsPDF } from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

const ExportDistrictFarmers = () => {
  const adminData = useAdminDetails((state) => state.admin_details);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isFarmsLoading, setIsFarmsLoading] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleReportDownload = async () => {
    setIsLoading(true);
    try {
      if (!adminData?.district) {
        throw new Error(
          "The system failed to get your district. Please try again"
        );
      }
      const response = await fetch("/api/all-district-farmers-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ district: adminData?.district }),
      });
      const res = await response.json();

      const cleaned_html = cleanHtml(res.html_text);

      if (res.error) {
        throw new Error("Failed to generate PDF");
      }

      const doc = new jsPDF("l", "mm", "a4");
      const pageWidth = doc.internal.pageSize.width;

      // Add title
      doc.setFontSize(18);
      const titleText = `Kulima System Report: ${adminData.district} District Farmers`;
      const titleWidth =
        (doc.getStringUnitWidth(titleText) * doc.getFontSize()) /
        doc.internal.scaleFactor;

      // Calculate the x position to center the text
      const xPos = (pageWidth - titleWidth) / 2;
      doc.text(titleText, xPos, 10);

      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(cleaned_html, "text/html");

      const table =
        htmlDoc.getElementById("#my-table") || htmlDoc.querySelector("table");

      if (!table) {
        console.error("HTML content:", res.html);
        throw new Error("No table data found");
      }

      const headers = Array.from(table.querySelectorAll("thead tr th")).map(
        (th) => th.textContent || ""
      );
      const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
        Array.from(tr.querySelectorAll("td")).map((td) => td.textContent || "")
      );

      if (headers.length === 0 || rows.length === 0) {
        console.error("Headers:", headers);
        console.error("Rows:", rows);
        throw new Error("Table data is empty");
      }

      const tableSettings: UserOptions = {
        head: [headers],
        body: rows,
        startY: 20,
        styles: {
          fontSize: 7,
          cellPadding: 1,
          overflow: "linebreak" as const,
          cellWidth: "auto" as const,
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Name
          1: { cellWidth: 15 }, // DOB
          2: { cellWidth: 12 }, // Gender
          3: { cellWidth: 25 }, // Email
          4: { cellWidth: 15 }, // Phone
          5: { cellWidth: 25 }, // Address
          6: { cellWidth: 15 }, // District
          7: { cellWidth: 15 }, // Parish
          8: { cellWidth: 15 }, // Household Size
          9: { cellWidth: 12 }, // Children
          10: { cellWidth: 15 }, // School-going
          11: { cellWidth: 20 }, // Avg Income
          12: { cellWidth: 25 }, // Other Income
          13: { cellWidth: 20 }, // Farmer UID
        },
        didDrawPage: (data) => {
          // Add page number at the bottom
          doc.setFontSize(12);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },

        margin: { top: 20, right: 5, bottom: 20, left: 5 },

        horizontalPageBreak: true,

        showHead: "everyPage",
      };

      // Generate PDF
      autoTable(doc, tableSettings);

      doc.save(`${adminData.district}_farmers_report.pdf`);

      setIsLoading(false);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsLoading(false);
    }
  };

  const handleFarmsReport = async () => {
    setIsFarmsLoading(true);
    try {
      if (!adminData?.district) {
        throw new Error(
          "The system failed to get your district. Please try again"
        );
      }
      const response = await fetch("/api/all-district-farms-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ district: adminData?.district }),
      });
      const res = await response.json();

      const cleaned_html = cleanHtml(res.html_text);

      if (res.error) {
        throw new Error("Failed to generate PDF");
      }

      const doc = new jsPDF("l", "mm", "a4");
      const pageWidth = doc.internal.pageSize.width;

      // Add title
      doc.setFontSize(18);
      const titleText = `Kulima System Report: ${adminData.district} District Farms`;
      const titleWidth =
        (doc.getStringUnitWidth(titleText) * doc.getFontSize()) /
        doc.internal.scaleFactor;

      // Calculate the x position to center the text
      const xPos = (pageWidth - titleWidth) / 2;
      doc.text(titleText, xPos, 10);

      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(cleaned_html, "text/html");

      const table =
        htmlDoc.getElementById("#my-table") || htmlDoc.querySelector("table");

      if (!table) {
        console.error("HTML content:", res.html);
        throw new Error("No table data found");
      }

      const headers = Array.from(table.querySelectorAll("thead tr th")).map(
        (th) => th.textContent || ""
      );
      const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
        Array.from(tr.querySelectorAll("td")).map((td) => td.textContent || "")
      );

      if (headers.length === 0 || rows.length === 0) {
        console.error("Headers:", headers);
        console.error("Rows:", rows);
        throw new Error("Table data is empty");
      }

      const tableSettings: UserOptions = {
        head: [headers],
        body: rows,
        startY: 20,
        styles: {
          fontSize: 7,
          cellPadding: 1,
          overflow: "linebreak" as const,
          cellWidth: "auto" as const,
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Name
          1: { cellWidth: 15 }, // DOB
          2: { cellWidth: 12 }, // Gender
          3: { cellWidth: 25 }, // Email
          4: { cellWidth: 15 }, // Phone
          5: { cellWidth: 25 }, // Address
          6: { cellWidth: 15 }, // District
          7: { cellWidth: 15 }, // Parish
          8: { cellWidth: 15 }, // Household Size
          9: { cellWidth: 12 }, // Children
          10: { cellWidth: 15 }, // School-going
          11: { cellWidth: 20 }, // Avg Income
          12: { cellWidth: 25 }, // Other Income
          13: { cellWidth: 20 }, // Farmer UID
        },
        didDrawPage: (data) => {
          // Add page number at the bottom
          doc.setFontSize(12);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },

        margin: { top: 20, right: 5, bottom: 20, left: 5 },

        horizontalPageBreak: true,

        showHead: "everyPage",
      };

      // Generate PDF
      autoTable(doc, tableSettings);

      doc.save(`${adminData.district}_farms_report.pdf`);

      setIsFarmsLoading(false);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsFarmsLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full flex flex-col md:flex md:flex-row items-center justify-center gap-4 md:gap-10">
      <Button
        className="bg-rose-600 my-4 rounded-lg w-full md:w-fit text-white hover:bg-rose-600/50 hover:ring-2 hover:ring-white"
        onClick={handleReportDownload}
      >
        {isLoading ? "Downloading PDF" : `Download data for ${adminData?.district} farmers (PDF)`}
      </Button>

      <Button
        className="bg-rose-600 my-4 rounded-lg w-full md:w-fit text-white hover:bg-rose-600/50 hover:ring-2 hover:ring-white"
        onClick={handleFarmsReport}
        disabled={isFarmsLoading}
      >
        {isFarmsLoading
          ? "Downloading PDF..."
          : `Download data for ${adminData?.district} farms (PDF)`}
      </Button>
    </div>
  );
};

const supabase = createClient();

function VerifiedDistrictAdmin() {
  const router = useRouter();
  const role = useAdminDetails((state) => state.role);
  const [myData, setMyData] = useState<AdminType | null>(null);
  const setAdminDetails = useAdminDetails((state) => state.setAdminDetails);
  const setRole = useAdminDetails((state) => state.setRole);

  useEffect(() => {
    setRole("district_admin");
  }, []);

  useEffect(() => {
    const channels = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "district_admin" },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.new.hasAccess === false) {
            supabase.auth.signOut().then(() => {
              return router.replace("/");
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  useEffect(() => {
    supabase
      .from(`${role}`)
      .select("*")
      .single()
      .then((response) => {
        setMyData(response.data);
      });
  }, [role]);

  useEffect(() => {
    setAdminDetails(myData ? myData : null);
  }, [myData]);

  const actions: Actions[] = [
    {
      name: "Dashboard",
      component: <StatsDashboard />,
    },
    {
      name: "View parish admins",
      component: <ViewParishAdminsButton />,
    },
    {
      name: "View access requests",
      component: <ViewParishAccessRequestsButton />,
    },
    {
      name: "View farmers",
      component: <ViewAllFarmersButton />,
    },
    {
      name: "View farms",
      component: <ViewAllFarmsButton />,
    },
    {
      name: "Export data",
      component: <ExportDistrictFarmers />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full dark:bg-black">
      <Dashboard
        actions={actions}
        title="District Administrator Dashboard"
        location={{
          district: myData?.district,
          parish: myData?.parish,
          allocation: myData?.allocation,
        }}
      />
      {/* <div className="flex-1 flex flex-col h-full"> hello</div> */}
    </div>
  );
}

export default VerifiedDistrictAdmin;
