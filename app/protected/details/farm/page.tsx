"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinearGradient } from "react-text-gradients";
import Image from "next/image";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

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

// const generateColumnArrays = (arr: string[] | undefined) => {
//   if (arr) {
//     const COL_LIMIT = 5;
//     if (arr.length > COL_LIMIT) {
//       const breakIndex = Math.ceil(arr.length / 2);
//       return [arr.slice(0, breakIndex), arr.slice(breakIndex)];
//     }
//     return [arr];
//   }
// };

const handleFarmPdfDownload = (farm: FarmResponse) => {
  try {
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function for wrapped text
    const addWrappedText = (text: string, y: number) => {
      const splitText = doc.splitTextToSize(text, contentWidth);
      doc.text(splitText, margin, y);
      return splitText.length * doc.getTextDimensions("Text").h + 2;
    };

    // Helper function for section headers
    const addSectionHeader = (text: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.text(text, margin, y);
      doc.setFont("helvetica", "normal");
      return y + 7;
    };

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const titleText = farm.farm_name || "Farm Report";
    const titleWidth =
      (doc.getStringUnitWidth(titleText) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(titleText, titleX, yPos);
    yPos += 15;

    // Reset font for content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Basic Information
    yPos = addSectionHeader("Basic Information:", yPos);
    const basicInfo = [
      `Farm Type: ${farm.type || "N/A"}`,
      `Farm Owner: ${farm.farm_owner || "N/A"}`,
      `District: ${farm.district || "N/A"}`,
      `Parish: ${farm.parish || "N/A"}`,
      `Location: ${farm.location || "N/A"}`,
      `Land Size: ${farm.land_size || "N/A"} ${farm.land_units || "N/A"}`,
      `Number of Laborers: ${farm.labourers || "N/A"}`,
    ].join("\n");
    yPos += addWrappedText(basicInfo, yPos) + 10;

    // Crops and Land Use
    yPos = addSectionHeader("Crops and Land Use:", yPos);
    if (farm.crops?.length) {
      yPos += addWrappedText(`Crops Grown: ${farm.crops.join(", ")}`, yPos) + 5;
    }
    if (farm.land_use?.length) {
      yPos += 5;
      farm.land_use.forEach((use) => {
        yPos += addWrappedText(
          `• ${use.crop}: ${use.land_size} ${farm.land_units || "units"}`,
          yPos
        );
      });
    }
    yPos += 10;

    // Production Information
    yPos = addSectionHeader("Production Information:", yPos);
    const productionInfo = `Average Quantity Produced: ${farm.average_quantity_produced || "N/A"} ${farm.quantity_units || ""}`;
    yPos += addWrappedText(productionInfo, yPos) + 10;

    // Machinery
    yPos = addSectionHeader("Machinery:", yPos);
    if (farm.is_currently_mechanized) {
      if (farm.current_machinery?.length) {
        yPos += addWrappedText("Current Machinery:", yPos) + 5;
        farm.current_machinery.forEach((machine) => {
          yPos += addWrappedText(
            `• ${machine.machine_name || "N/A"} - ${machine.purpose || "N/A"}`,
            yPos
          );
        });
      }
    }
    if (farm.previously_mechanized && farm.previous_machinery?.length) {
      yPos += 5;
      yPos += addWrappedText("Previous Machinery:", yPos) + 5;
      farm.previous_machinery.forEach((machine) => {
        yPos += addWrappedText(
          `• ${machine.machine_name || "N/A"}} - ${machine.purpose || "N/A"}}`,
          yPos
        );
      });
    }
    yPos += 10;

    // Water Information
    yPos = addSectionHeader("Water Information:", yPos);
    if (farm.water_source) {
      const waterInfo = [
        `Source Type: ${farm.water_source.type || "N/A"}`,
        `Distance from Farm: ${farm.water_source.distance_from_farm || "N/A"} meters`,
      ].join("\n");
      yPos += addWrappedText(waterInfo, yPos) + 5;
    }

    if (farm.is_water_contaminated && farm.water_contaminants?.length) {
      yPos += addWrappedText("Water Contaminants:", yPos) + 5;
      farm.water_contaminants.forEach((contaminant) => {
        yPos += addWrappedText(
          `• ${contaminant.contaminant || "N/A"}} - ${contaminant.effect || "N/A"}}`,
          yPos
        );
      });
    }
    yPos += 10;

    // Pests and Control
    yPos = addSectionHeader("Pests and Control Measures:", yPos);
    if (farm.pests?.length) {
      farm.pests.forEach((pest) => {
        yPos += addWrappedText(
          `• ${pest.pest_name || "N/A"} - ${pest.effect || "N/A"}}`,
          yPos
        );
      });
      yPos += 5;
    }
    if (farm.pest_control?.length) {
      yPos += addWrappedText("Control Measures:", yPos) + 5;
      farm.pest_control.forEach((control) => {
        yPos += addWrappedText(
          `• ${control.pest || "N/A"}: ${control.control_measure || "N/A"}`,
          yPos
        );
      });
    }
    yPos += 10;

    // Fertilizers
    if (farm.fertilizers?.length) {
      yPos = addSectionHeader("Fertilizers:", yPos);
      farm.fertilizers.forEach((fertilizer) => {
        yPos += addWrappedText(
          `• Type: ${fertilizer.type || "N/A"}, Frequency: ${fertilizer.frequency || "N/A"}`,
          yPos
        );
      });
      yPos += 10;
    }

    // Additional Information
    yPos = addSectionHeader("Additional Information:", yPos);
    const geoLocationString = farm.geo_location
      ? farm.geo_location
          .map((coord) => `(${coord.lat}, ${coord.lon})`)
          .join(", ")
      : "N/A";

    const additionalInfo = [
      `Added By: ${farm.added_by || "N/A"}`,
      `Geo-location: ${geoLocationString}`,
    ].join("\n");
    yPos += addWrappedText(additionalInfo, yPos);

    // Add page numbers
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`${farm.farm_name || "farm"}-report.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

export default function FarmCard() {
  const [farm, setFarm] = useState<any | null>(null);
  useEffect(() => {
    const farmJSON = window.localStorage.getItem("currentFarm");

    if (farmJSON) {
      setFarm(JSON.parse(farmJSON));
    }
  }, []);
  const [isMounted, setIsMounted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [mapBtnClicked, setMapBtnClicked] = useState<boolean>(false);
  const router = useRouter();

  const keys = useMemo(() => getKeys(farm), [farm]);
  const otherKeys = useMemo(
    () =>
      keys
        ?.filter((key) => !headingKeys.includes(key) && key !== "agent_id")
        .sort((a: string, b: string) => a.localeCompare(b)),
    [keys]
  );

  const routeToMap = (coordinates: Coordinates) => {
    const searchParams = new URLSearchParams();
    searchParams.set("coords", JSON.stringify(coordinates));
    router.push(`/protected/map?${searchParams.toString()}`);
  };

  const handleDownload = () => {
    try {
      setClicked(true);
      handleFarmPdfDownload(farm);
    } catch (error) {
      toast.error("Could not download farm PDF");
      console.error(error);
    } finally {
      setClicked(false);
    }
  };

  useEffect(() => {
    // Set the mounted state to true once the component is mounted
    setIsMounted(true);
    // setLoading(farm ? true : false);
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
        className="w-full overflow-hidden md:min-w-fit md:max-w-80 mx-auto my-5"
      >
        {/* body */}
        <Card className="mx-auto flex flex-col align-middle justify-center">
          <CardHeader>
            <CardTitle className="max-w-prose mx-auto text-2xl">
              {farm?.farm_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-prose mx-auto ">
              <button
                className="text-blue-500 text-sm my-2 w-full flex align-middle justify-center"
                onClick={() => setShowGallery(!showGallery)}
              >
                {showGallery ? "Hide images" : "Show farm pictures"}
              </button>

              {showGallery && (
                <div className="animate-accordion-down">
                  <h1 className="text-2xl text-gray-600 my-2">Gallery</h1>
                  <div className="flex flex-row gap-3">
                    {farm.images?.map((url: string) => (
                      <div className="flex flex-col flex-wrap align-middle justify-center h-[200px] w-[200px]">
                        <Image
                          alt="Farm image"
                          width={200}
                          height={200}
                          src={url}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="max-w-prose mx-auto">
              <div key={farm?.image_file_name}>
                <div>
                  <div className="flex flex-col px-3 animate-accordion-down animate-in">
                    <div className="flex-col">
                      <p className="flex flex-col justify-between align-middle py-2">
                        {" "}
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          LAND SIZE:&nbsp;
                        </span>
                        {`${farm?.land_size} ${farm?.land_units}` ||
                          "Undefined"}
                      </p>
                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          LOCATION:&nbsp;
                        </span>
                        {farm?.location}
                      </p>
                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          CROPS:&nbsp;
                        </span>
                        {farm?.crops
                          ? farm?.crops.map((crop: any) => (
                              <div className="px-2">
                                <li>{crop}</li>
                              </div>
                            ))
                          : "Undefined"}
                      </p>
                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          AVERAGE QUANTITY PER HARVEST:&nbsp;
                        </span>
                        {farm?.average_quantity_produced} {farm?.quantity_units}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          FARM IS MECHANIZED:&nbsp;
                        </span>
                        {farm?.is_currently_mechanized ? "Yes" : "No"}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          CURRENT MACHINERY:&nbsp;
                        </span>
                        {farm?.current_machinery
                          ? farm?.current_machinery?.map((machine: any) => (
                              <div>
                                <li>
                                  {machine.machine_name.toLocaleUpperCase()} for{" "}
                                  {machine.purpose}
                                </li>
                              </div>
                            ))
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          USED MECHANIZATION:&nbsp;
                        </span>
                        {farm?.previously_mechanized ? "Yes" : "No"}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          PREVIOUS MACHINERY:&nbsp;
                        </span>
                        {farm?.previous_machinery
                          ? farm?.previous_machinery?.map((machine: any) => (
                              <div>
                                <li>
                                  {machine.machine_name.toLocaleUpperCase()} for{" "}
                                  {machine.purpose}
                                </li>
                              </div>
                            ))
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          LABOURERS:{" "}
                        </span>{" "}
                        {farm?.labourers ? farm?.labourers : "Undefined"}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          PESTS:{" "}
                        </span>{" "}
                        {farm?.pests
                          ? farm?.pests?.map((pest: any) => (
                              <div>
                                <li>
                                  {pest.pest_name} causes {pest.effect}
                                </li>
                              </div>
                            ))
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          PEST CONTROL:{" "}
                        </span>{" "}
                        {farm?.pests
                          ? farm?.pest_control?.map((control: any) => (
                              <div>
                                <li>
                                  {control.control_measure} for {control.pest}
                                </li>
                              </div>
                            ))
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          WATER CONTAMINANT{"(s)"}:
                        </span>

                        {!farm?.water_contaminants?.length ? (
                          "Undefined"
                        ) : farm?.water_contaminants?.length === 1 ? (
                          <span></span>
                        ) : (
                          <div>
                            {farm?.water_contaminants?.map(
                              (contaminant: any) => (
                                <li>
                                  {contaminant.contaminant} causes{" "}
                                  {contaminant.effect}
                                </li>
                              )
                            )}
                          </div>
                        )}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          LAND USE:{" "}
                        </span>
                        {farm?.land_use
                          ? farm?.land_use?.map((use: any) => (
                              <li className="flex flex-col justify-between align-middle">
                                <span>
                                  {use.crop}&nbsp;{"\t"}
                                </span>
                                <span>
                                  {use.land_size} {farm.land_units}
                                </span>
                              </li>
                            ))
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        {" "}
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          FERTILIZERS:
                        </span>
                        {!farm?.fertilizers?.length ? (
                          "Undefined"
                        ) : farm?.fertilizers?.length === 1 ? (
                          <span>
                            {farm?.fertilizers?.[0].type ? (
                              <li>
                                <span>
                                  {farm?.fertilizers?.[0].type} {"\t"}
                                </span>
                                <span>{farm?.fertilizers?.[0].frequency}</span>
                              </li>
                            ) : (
                              "Undefined"
                            )}{" "}
                          </span>
                        ) : (
                          farm?.fertilizers?.map((source: any) => (
                            <>
                              <span key={source.type}>
                                {source.type ? (
                                  <li>
                                    <span>{source.type}</span> {"\t"}
                                    <span>{source.frequency}</span>
                                  </li>
                                ) : (
                                  "Undefined"
                                )}
                              </span>{" "}
                            </>
                          ))
                        )}
                      </p>

                      <p className="flex flex-col justify-between align-middle py-2">
                        <span className="font-semibold text-base tracking-normal text-gray-500">
                          ADDED BY:{" "}
                        </span>
                        {farm?.added_by ? farm?.added_by : "Undefined"}
                      </p>

                      <Button
                        onClick={() => {
                          routeToMap(farm.geo_location);
                          setMapBtnClicked(true);
                        }}
                        className="my-2 w-full"
                      >
                        {mapBtnClicked ? "Opening map" : "See on map"}
                      </Button>

                      <div>
                        <Button
                          className="bg-rose-600 my-4 rounded-lg w-full text-white hover:bg-rose-600/50 hover:ring-2 hover:ring-white"
                          onClick={handleDownload}
                        >
                          {clicked ? "Downloading" : "Download data as pdf"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
