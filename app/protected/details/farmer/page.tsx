"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Loader2 } from "lucide-react";
import { LinearGradient } from "react-text-gradients";
import Image from "next/image";
import { cleanHtml } from "@/lib/shared/functions";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const getKeys = (obj: any) => {
  if (obj) return typeof obj === "object" ? Object.keys(obj) : [];
};

const headingKeys = [
  "first_name",
  "last_name",
  "sys_role",
  "image",
  "other_income_sources",
  "tel",
  "farmer_uid",
];

const formattedKey = (key: string) => {
  let temp = key;

  if (temp === "created_at") {
    temp = "User since";
  }
  if (temp === "hasAccess") {
    temp = "has access";
  }

  if (temp.includes("_")) {
    temp = temp.split("_").reduce((a, b) => `${a} ${b}`);
  }

  return temp.toLocaleUpperCase();
};

function getMonthName(monthNumber: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthNames[monthNumber];
}

const formattedValue = (value: any, key: string) => {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (key === "created_at" || key === "granted_on") {
    const date = new Date(value);
    const time_with_offset_date = date.getTime() + 3 * 60 * 60 * 1000;
    const time_with_offset = new Date(time_with_offset_date);

    return `${getMonthName(time_with_offset.getMonth())} ${time_with_offset.getDate()}, ${time_with_offset.getFullYear()} at ${time_with_offset.getHours()}:${time_with_offset.getMinutes()}`;
  }

  if (key === "district") {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return value;
};

const generateColumnArrays = (arr: string[] | undefined) => {
  if (arr) {
    const COL_LIMIT = 5;
    if (arr.length > COL_LIMIT) {
      const breakIndex = Math.ceil(arr.length / 2);
      return [arr.slice(0, breakIndex), arr.slice(breakIndex)];
    }
    return [arr];
  }
};

export default function FarmerCard() {
  const [farms, setFarms] = useState<any | null>(null);
  useEffect(() => {
    const farmsJSON = window.localStorage.getItem("currentFarmer");

    if (farmsJSON) {
      setFarms(JSON.parse(farmsJSON));
      console.log({ keys: Object.keys(JSON.parse(farmsJSON)) });
    }
  }, []);
  const [isMounted, setIsMounted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keys = useMemo(() => getKeys(farms), [farms]);
  const otherKeys = useMemo(
    () =>
      keys
        ?.filter((key) => !headingKeys.includes(key) && key !== "agent_id")
        .sort((a: string, b: string) => a.localeCompare(b)),
    [keys]
  );

  const columnArrays = useMemo(
    () => generateColumnArrays(otherKeys),
    [otherKeys]
  );

  const handleReportDownload = async () => {
    try {
      if (!farms?.farmer_uid) {
        toast.error(
          "The farmer ID has not been found. Please close this page and try again."
        );
        return;
      }
      // generate pdf

      const doc = new jsPDF();
      let yPos = 20; // Starting Y position
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Helper function to add wrapped text
      const addWrappedText = (text: string, y: number) => {
        const splitText = doc.splitTextToSize(text, contentWidth);
        doc.text(splitText, margin, y);
        return splitText.length * doc.getTextDimensions("Text").h + 2; // Return height used
      };

      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const titleText = "Farmer Data";
      const titleWidth =
        (doc.getStringUnitWidth(titleText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(titleText, titleX, yPos);
      yPos += 10;

      // Reset font
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      if (farms.image) {
        try {
          const imgWidth = 50;
          const imgHeight = 50;
          const imgX = (pageWidth - imgWidth) / 2;
          doc.addImage(farms.image, "JPEG", imgX, yPos, imgWidth, imgHeight);
          yPos += imgHeight + 10;
        } catch (error) {
          console.error("Error adding image:", error);
        }
      }

      // Personal Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Personal Information:", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");

      const personalInfo = [
        `Name: ${farms.first_name || "N/A"} ${farms.last_name || "N/A"}`,
        `Date of Birth: ${farms.dob || "N/A"}`,
        `Gender: ${farms.gender || "N/A"}`,
        `NIN: ${farms.nin || "N/A"}`,
        `Email: ${farms.email || "N/A"}`,
        `Phone: ${farms.tel?.[0] || "N/A"}`,
        `Address: ${farms.address || "N/A"}`,
        `District: ${farms.district || "N/A"}`,
        `Parish: ${farms.parish || "N/A"}`,
      ].join("\n");

      yPos += addWrappedText(personalInfo, yPos);
      yPos += 10;

      // Household Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Household Information:", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");

      const householdInfo = [
        `Household Size: ${farms.household_size || "N/A"}`,
        `Number of Children: ${farms.no_children || "N/A"}`,
        `Number of School-going Children: ${farms.count_school_going || "N/A"}`,
      ].join("\n");

      yPos += addWrappedText(householdInfo, yPos);
      yPos += 10;

      // Income Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Income Information:", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");

      const incomeInfo = `Average Income per Harvest: ${farms.average_income_per_harvest || "N/A"}`;
      yPos += addWrappedText(incomeInfo, yPos);
      yPos += 5;

      // Other Income Sources
      if (farms.other_income_sources?.length > 0) {
        doc.text("Other Income Sources:", margin, yPos);
        yPos += 7;

        farms.other_income_sources.forEach((source: any) => {
          const sourceText = `• ${source.income_name || "N/A"}`;
          yPos += addWrappedText(sourceText, yPos);
        });
      }
      yPos += 10;

      // Additional Information Section
      doc.setFont("helvetica", "bold");
      doc.text("Additional Information:", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");

      const additionalInfo = [
        `Farmer UID: ${farms.farmer_uid || "N/A"}`,
        `Added By: ${farms.added_by || "N/A"}`,
      ].join("\n");

      yPos += addWrappedText(additionalInfo, yPos);

      // Add page numbers
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      doc.save(`farmer-${farms.farmer_uid || "data"}.pdf`);

      return true;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Set the mounted state to true once the component is mounted
    setIsMounted(true);
    // setLoading(farms ? true : false);
  }, []);

  if (!isMounted) {
    return false;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* heading */}
      <p className="font-semibold tracking-normal md:text-2xl text-center py-5">
        <LinearGradient gradient={["to left", "#17acff ,#17acff ,#00ff00"]}>
          Farmer Details
        </LinearGradient>
      </p>

      <div
        key={Math.random() * 10}
        className="w-full overflow-hidden md:min-w-fit md:max-w-screen-md mx-auto my-5"
      >
        {/* body */}
        <Card className="md:mx-auto w-full overflow-hidden flex flex-col align-middle justify-center">
          <CardHeader>
            <CardTitle className="md:min-w-prose w-full mx-auto rounded-lg shadow-md  light:shadow-gray-300 border-[1px] border-gray-300 bg-gray-100 px-4 py-2">
              {/* image name sys_role */}
              <div className="flex flex-row align-middle justify-between rounded-lg overflow-hidden object-contain md:gap-4">
                {farms?.image && (
                  <div className="w-[80px] h-[80px] object-contain rounded-lg overflow-hidden">
                    <Image
                      src={farms?.image}
                      alt="Field agent image"
                      height={80}
                      width={80}
                      layout="responsive"
                      quality={80} // Adjust quality for smaller devices
                    />
                  </div>
                )}

                <div className="my-auto px-5 dark:text-gray-900">
                  {/* name and sys_role */}
                  <p className="font-semibold text-xl tracking-wide">{`${farms?.first_name} ${farms?.last_name}`}</p>
                  <span className="text-sm font-normal tracking-normal text-black/60">
                    Farmer
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex md:flex-row md:justify-between">
              {/* col 1 */}
              <div className="flex flex-col overflow-x-hidden">
                {columnArrays?.[0]?.map((key) => (
                  <div key={key} className="py-2 px-4 basis-1/2">
                    <div>
                      <p className="text-sm text-gray-500">
                        {formattedKey(key)}
                      </p>
                    </div>
                    <div>
                      <p>{formattedValue(farms?.[key], key)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* col 2 */}
              <div className="flex flex-col overflow-x-hidden">
                {columnArrays?.[1]?.map((key) => (
                  <div key={key} className="py-2 px-4 basis-1/2">
                    <div>
                      <p className="text-sm text-gray-500">
                        {formattedKey(key)}
                      </p>
                    </div>
                    <div>
                      <p>{formattedValue(farms?.[key], key)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {
              <div key={Math.random() * 10}>
                <div className="py-2 px-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formattedKey("other_income_sources")}
                    </p>
                  </div>

                  <div>
                    {farms?.other_income_sources?.map((source: any) => (
                      <div className="px-2">
                        <div>
                          <p className="text-xs text-gray-500">
                            {formattedKey("income_name")}
                          </p>
                        </div>

                        <div>
                          <p>
                            {formattedValue(source.income_name, "income_name")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-2 px-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formattedKey("tel")}
                    </p>
                  </div>
                </div>
              </div>
            }
            <div className="w-full flex align-middle justify-center">
              <a
                href={`/protected/deep-retrieval/${farms?.farmer_uid}`}
                className="text-blue-500 flex align-middle justify-center py-2 gap-1"
              >
                {" "}
                <Link size={20} />
                See linked farms
              </a>
            </div>

            <div>
              <Button
                className="bg-rose-600 my-4 rounded-lg w-full text-white hover:bg-rose-600/50 hover:ring-2 hover:ring-white"
                onClick={handleReportDownload}
              >
                {clicked ? "Downloading" : "Download data as pdf"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
