import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type FarmsFromFarmerProps = {
  farmer_uid: number;
};

export default function FarmsFromFarmer({ farmer_uid }: FarmsFromFarmerProps) {
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const router = useRouter();
  const [mapBtnClicked, setMapBtnClicked] = useState<boolean>(false);

  const routeToMaps = (coordinates: Coordinates) => {
    const searchParams = new URLSearchParams();
    searchParams.set("coords", JSON.stringify(coordinates));
    router.push(`/map?${searchParams.toString()}`);
  };

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch("/api/show-farmer-farms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ farmer_uid }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch farms");
        }

        const data = await response.json();
        console.log({ FarmsFromFarmerError: error });

        setFarms(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [farmer_uid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-5">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (farms.length <= 0) {
    return (
      <div className="text-center my-auto text-red-500 mt-5">
        <p>This farmer has no farms</p>
        <Button onClick={() => window.history.back()} className="mt-4">
          Go back
        </Button>
      </div>
    );
  }
  return (
    <div>
      {farms.length > 0 &&
        farms?.map((farm, index) => (
          <Card
            key={index}
            className="mx-auto flex flex-col align-middle justify-center"
          >
            <CardHeader>
              <CardTitle className="max-w-prose mx-auto text-3xl">
                {farm?.farm_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-prose mx-auto">
                <button
                  className="text-blue-500 my-2"
                  onClick={() => setShowGallery(!showGallery)}
                >
                  {showGallery ? "Hide images" : "Show farm pictures"}
                </button>
                {showGallery && (
                  <div className="animate-accordion-down">
                    <h1 className="text-2xl text-gray-600 my-2">Gallery</h1>
                    <div className="flex flex-row gap-5">
                      {farm.images?.map((url) => (
                        <div className="flex flex-col flex-wrap align-middle justify-center h-[200px] w-[200px] bg-gray-300">
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
                {farms
                  ?.sort((a, b) => a?.farm_name?.localeCompare(b.farm_name))
                  .map((request) => (
                    <div key={request?.image_file_name}>
                      <div>
                        <div className="flex flex-col px-3 animate-accordion-down animate-in">
                          <div className="flex-col">
                            <p className="flex flex-col justify-between align-middle py-2">
                              {" "}
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                LAND SIZE:&nbsp;
                              </span>
                              {`${request?.land_size} ${request?.land_units}` ||
                                "Undefined"}
                            </p>
                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                LOCATION:&nbsp;
                              </span>
                              {request?.location}
                            </p>
                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                CROPS:&nbsp;
                              </span>
                              {request?.crops
                                ? request?.crops.map((crop) => (
                                    <div className="px-2">
                                      <li>{crop}</li>
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>
                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                AVERAGE QUANTITY PER HARVEST:&nbsp;
                              </span>
                              {request?.average_quantity_produced}{" "}
                              {request?.quantity_units}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                FARM IS MECHANIZED:&nbsp;
                              </span>
                              {request?.is_currently_mechanized ? "Yes" : "No"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                CURRENT MACHINERY:&nbsp;
                              </span>
                              {request?.current_machinery
                                ? request?.current_machinery?.map((machine) => (
                                    <div>
                                      <li>
                                        {machine.machine_name.toLocaleUpperCase()}{" "}
                                        for {machine.purpose}
                                      </li>
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                USED MECHANIZATION:&nbsp;
                              </span>
                              {request?.previously_mechanized ? "Yes" : "No"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                PREVIOUS MACHINERY:&nbsp;
                              </span>
                              {request?.previous_machinery
                                ? request?.previous_machinery?.map(
                                    (machine) => (
                                      <div>
                                        <li>
                                          {machine.machine_name.toLocaleUpperCase()}{" "}
                                          for {machine.purpose}
                                        </li>
                                      </div>
                                    )
                                  )
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                LABOURERS:{" "}
                              </span>{" "}
                              {request?.labourers
                                ? request?.labourers
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                PESTS:{" "}
                              </span>{" "}
                              {request?.pests
                                ? request?.pests?.map((pest) => (
                                    <div>
                                      <li>
                                        {pest.pest_name} causes {pest.effect}
                                      </li>
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                PEST CONTROL:{" "}
                              </span>{" "}
                              {request?.pests
                                ? request?.pest_control?.map((control) => (
                                    <div>
                                      <li>
                                        {control.control_measure} for{" "}
                                        {control.pest}
                                      </li>
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                WATER CONTAMINANT{"(s)"}:
                              </span>

                              {!request?.water_contaminants?.length ? (
                                "Undefined"
                              ) : request?.water_contaminants?.length === 1 ? (
                                <span></span>
                              ) : (
                                <div>
                                  {request?.water_contaminants?.map(
                                    (contaminant) => (
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
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                LAND USE:{" "}
                              </span>
                              {request?.land_use
                                ? request?.land_use?.map((use) => (
                                    <li className="flex flex-col justify-between align-middle">
                                      <span>
                                        {use.crop}&nbsp;{"\t"}
                                      </span>
                                      <span>
                                        {use.land_size} {request.land_units}
                                      </span>
                                    </li>
                                  ))
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              {" "}
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                FERTILIZERS:
                              </span>
                              {!request?.fertilizers?.length ? (
                                "Undefined"
                              ) : request?.fertilizers?.length === 1 ? (
                                <span>
                                  {request?.fertilizers?.[0].type ? (
                                    <li>
                                      <span>
                                        {request?.fertilizers?.[0].type} {"\t"}
                                      </span>
                                      <span>
                                        {request?.fertilizers?.[0].frequency}
                                      </span>
                                    </li>
                                  ) : (
                                    "Undefined"
                                  )}{" "}
                                </span>
                              ) : (
                                request?.fertilizers?.map((source) => (
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
                              <span className="font-semibold text-lg tracking-normal text-gray-500">
                                ADDED BY:{" "}
                              </span>
                              {request?.added_by
                                ? request?.added_by
                                : "Undefined"}
                            </p>

                            <Button
                              onClick={() => {
                                routeToMaps(request.geo_location);
                                setMapBtnClicked(true);
                              }}
                              className="my-2"
                            >
                              {mapBtnClicked ? "Opening map" : "See on map"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
