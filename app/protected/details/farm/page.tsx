"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Loader2 } from "lucide-react";
import { LinearGradient } from "react-text-gradients";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function FarmCard() {
  const [farm, setFarm] = useState<any | null>(null);
  useEffect(() => {
    const farmJSON = window.localStorage.getItem("currentFarm");

    if (farmJSON) {
      setFarm(JSON.parse(farmJSON));
    }
  }, []);
  const [isMounted, setIsMounted] = useState(false);
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
                          setMapBtnClicked(true)
                        }}
                        className="my-2"
                      >
                        {mapBtnClicked ? 'Opening map' : 'See on map'}
                      </Button>
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
