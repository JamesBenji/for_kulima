import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type FarmsFromFarmerProps = {
  farmer_uid: number;
};

export default function FarmsFromFarmer({ farmer_uid }: FarmsFromFarmerProps) {
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {farms.length > 0 &&
        farms?.map((farm, index) => (
          <Card key={index} className="mx-auto flex flex-col align-middle justify-center">
            <CardHeader>
              <CardTitle className="max-w-prose mx-auto">{farm?.farm_name}</CardTitle>
            </CardHeader>
            <CardContent>
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
                              <span className="font-semibold text-lg tracking-wide">
                                Land size:&nbsp;
                              </span>
                              {`${request?.land_size} ${request?.land_units}` ||
                                "Undefined"}
                            </p>
                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Location:&nbsp;
                              </span>
                              {request?.location}
                            </p>
                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Crops:&nbsp;
                              </span>
                              {request?.crops
                                ? request?.crops.map((crop) => (
                                    <div>
                                      <span>{crop}</span>
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>
                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Average quantity produced per harvest:&nbsp;
                              </span>
                              {request?.average_quantity_produced}{" "}
                              {request?.quantity_units}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Uses mechanization:&nbsp;
                              </span>
                              {request?.is_currently_mechanized
                                ? request?.is_currently_mechanized
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Current machinery:&nbsp;
                              </span>
                              {request?.current_machinery
                                ? request?.current_machinery?.map((machine) => (
                                    <div>
                                      <span>
                                        {machine.machine_name.toLocaleUpperCase()}{" "}
                                        for {machine.purpose}
                                      </span>
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Used mechanization:&nbsp;
                              </span>
                              {request?.previously_mechanized || "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Previous machinery:&nbsp;
                              </span>
                              {request?.previous_machinery
                                ? request?.previous_machinery?.map(
                                    (machine) => (
                                      <div>
                                        <span>
                                          {machine.machine_name.toLocaleUpperCase()}{" "}
                                          for {machine.purpose}
                                        </span>
                                      </div>
                                    )
                                  )
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Labourers:{" "}
                              </span>{" "}
                              {request?.labourers
                                ? request?.labourers
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Pests:{" "}
                              </span>{" "}
                              {request?.pests
                                ? request?.pests?.map((pest) => (
                                    <div>
                                      <span>
                                        {pest.pest_name} causes {pest.effect}
                                      </span>
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Pest control:{" "}
                              </span>{" "}
                              {request?.pests
                                ? request?.pest_control?.map((control) => (
                                    <div>
                                      <span>
                                        {control.control_measure} for{" "}
                                        {control.pest}
                                      </span>
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Water contaminant{"(s)"}:
                              </span>

                              {!request?.water_contaminants?.length ? (
                                "Undefined"
                              ) : request?.water_contaminants?.length === 1 ? (
                                <span></span>
                              ) : (
                                <div>
                                  {request?.water_contaminants?.map(
                                    (contaminant) => (
                                      <span>
                                        {contaminant.contaminant} causes{" "}
                                        {contaminant.effect}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Land use:{" "}
                              </span>
                              {request?.land_use
                                ? request?.land_use?.map((use) => (
                                    <div className="flex flex-col justify-between align-middle">
                                      <span>{use.crop}&nbsp;</span>
                                      <span>
                                        {use.land_size} {request.land_units}
                                      </span>
                                      <br />
                                    </div>
                                  ))
                                : "Undefined"}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              {" "}
                              <span className="font-semibold text-lg tracking-wide">
                                Other income sources:
                              </span>
                              {!request?.fertilizers?.length ? (
                                "Undefined"
                              ) : request?.fertilizers?.length === 1 ? (
                                <span>
                                  {request?.fertilizers?.[0].type ? (
                                    <div>
                                      <span>
                                        {request?.fertilizers?.[0].type}
                                      </span>
                                      <span>
                                        {request?.fertilizers?.[0].frequency}
                                      </span>
                                    </div>
                                  ) : (
                                    "Undefined"
                                  )}{" "}
                                </span>
                              ) : (
                                request?.fertilizers?.map((source) => (
                                  <>
                                    <span key={source.type}>
                                      {source.type ? (
                                        <div>
                                          <span>{source.type}</span>
                                          <span>{source.frequency}</span>
                                        </div>
                                      ) : (
                                        "Undefined"
                                      )}
                                    </span>{" "}
                                    <br />
                                  </>
                                ))
                              )}
                            </p>

                            <p className="flex flex-col justify-between align-middle py-2">
                              <span className="font-semibold text-lg tracking-wide">
                                Added by:{" "}
                              </span>
                              {request?.added_by
                                ? request?.added_by
                                : "Undefined"}
                            </p>
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
