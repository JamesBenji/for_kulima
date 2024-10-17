"use client";

import { createClient } from "@/utils/supabase/client";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RefreshCcw, TableOfContents } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserAccType } from "@/app/actions";
import FilterByDistrict from "@/components/filter/FilterByDistrict";

export default function ViewAllFarmsButton() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<FarmResponse[] | null>(null);
  const [requests_data, setRequestsData] = useState<FarmResponse[] | null>(
    null
  );
  const [review, setReview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>();
  const [role, setRole] = useState<string>("");
  const [filterDistrict, setFilterDistrict] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      const email = res.data.user?.email;
      if (email) {
        getUserAccType(email).then((_role) => setRole(_role));
      }
    });
  }, []);

  const clearDistrictFilter = () => {
    setFilterDistrict("");
  };

  const router = useRouter();

  const routeToMaps = (coordinates: Coordinates) => {
    const searchParams = new URLSearchParams();
    searchParams.set("coords", JSON.stringify(coordinates));
    router.push(`/map?${searchParams.toString()}`);
  };

  useEffect(() => {
    setRequests(requests_data);
  }, [requests_data]);

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      const requests = await fetch("/api/view-farms", {
        method: "GET",
      });

      const parsedRequests = await requests.json();

      if (parsedRequests.error) return toast.error(parsedRequests.error);

      if (!parsedRequests.error) {
        setRequestsData(parsedRequests.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    makeAPIcall();
  }, []);

  useEffect(() => {
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "farmers" },
        (payload) => {
          console.log("Change received!", payload);
          makeAPIcall();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  useEffect(() => {
    if (firstName && filterDistrict === "") {
      setRequests(
        requests_data &&
          requests_data?.filter((item) =>
            item.farm_name.toLowerCase().includes(firstName.toLowerCase())
          )
      );
    } else if (firstName && filterDistrict) {
      setRequests(
        requests_data &&
          requests_data?.filter((item) => {
            item.farm_name === firstName && item.district === filterDistrict;
          })
      );
    } else if (!firstName && filterDistrict) {
      setRequests(
        requests_data &&
          requests_data.filter((item) => item.district === filterDistrict)
      );
    } else {
      setRequests(requests_data);
    }
  }, [firstName, filterDistrict]);

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row justify-between  mb-3">
        <div className="flex-1 mb-4 md:mb-0 md:pr-5">
          <input
            type="text"
            name="first_name"
            onChange={handleFirstNameChange}
            placeholder="Enter the farm name"
            className="w-full border-2 border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          className="bg-gray-300 text-gray-500 w-fit px-5 py-2 rounded-lg"
          onClick={makeAPIcall}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className=" flex flex-row">
              <span>
                <RefreshCcw className="animate-spin" />
              </span>
              &nbsp;&nbsp;Refreshing
            </span>
          ) : (
            <span className=" flex flex-row">
              <RefreshCcw />
              &nbsp;&nbsp;Refresh
            </span>
          )}
        </button>
      </div>

      <div className="w-full flex align-middle gap-4 my-2">
        <FilterByDistrict state={filterDistrict} setState={setFilterDistrict} />
        <Button
          className="bg-gray-300 text-black hover:bg-white"
          onClick={clearDistrictFilter}
        >
          Clear filter
        </Button>
      </div>

      <div>
        {requests && requests?.length > 0 ? (
          <h1 className="font-semibold tracking-wide text-lg mb-4">
            {requests?.length}&nbsp;Farm{requests.length > 1 ? "s" : ""}{" "}
          </h1>
        ) : (
          <h1 className="font-semibold tracking-wide text-lg my-4">
            There are no farms
          </h1>
        )}
        {requests
          ?.sort((a, b) => a?.farm_name?.localeCompare(b.farm_name))
          .map((request) => (
            <div key={request?.image_file_name}>
              <div className="flex flex-row justify-between border-2 rounded-md p-3 mt-1">
                <div className="flex-1 flex flex-col md:flex-row justify-evenly">
                  {/* requestor name and requested position */}
                  <div className="flex-1 py-1 px-2">
                    <h1 className="font-semibold tracking-normal text-lg">
                      {request?.farm_name}
                    </h1>
                    <h2 className="font-light text-sm">
                      {request?.location || "District, Parish, Village"}
                    </h2>
                  </div>
                  {/* Review button */}
                  <div className="flex flex-row basis-2/3  justify-end p-2">
                    <Button
                      asChild
                      className={`${role !== "district_admin" ? "ml-auto" : ""} px-5 py-2 mb-3 md:mb-0 hover:bg-blue-700 hover:text-white rounded-lg w-full md:w-fit border-blue-300 border-[1.5px] shadow-sm hover:underline bg-blue-200 text-blue-800`}
                      onClick={() => {
                        toast("Loading", { duration: 2000 });
                        localStorage.setItem(
                          "currentFarm",
                          JSON.stringify(request)
                        );
                        router.push("/protected/details/farm");
                      }}
                    >
                      <div className=" flex flex-row align-middle justify-center md:justify-start gap-1">
                        <TableOfContents size={20} className="" />
                        <span>&nbsp;View details</span>
                      </div>
                    </Button>
                  </div>
                </div>
                {/* review section */}
              </div>
              <div>
                {/* {review === `${request?.image_file_name}` && (
                  <div className="flex flex-col md:flex-row px-3 border rounded-md animate-accordion-down animate-in">
                    <div className="flex basis-1/3">
                      {request?.images?.length > 0 && (
                        <div className="py-5">
                          {request?.images?.map((image) => (
                            <div className="flex flex-col md:flex-row flex-wrap flex-1 rounded-md overflow-hidden">
                              <Image
                                src={image}
                                alt="Field agent image"
                                width={50}
                                height={50}
                                layout="responsive"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-col basis-2/3 p-8">
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        {" "}
                        <span className="font-semibold text-lg tracking-wide">
                          Land size:&nbsp;
                        </span>
                        {`${request?.land_size} ${request?.land_units}` ||
                          "Undefined"}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Location:&nbsp;
                        </span>
                        {request?.location}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
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
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Average quantity produced per harvest:&nbsp;
                        </span>
                        {request?.average_quantity_produced}{" "}
                        {request?.quantity_units}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Uses mechanization:&nbsp;
                        </span>
                        {request?.is_currently_mechanized
                          ? request?.is_currently_mechanized
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Current machinery:&nbsp;
                        </span>
                        {request?.current_machinery
                          ? request?.current_machinery?.map((machine) => (
                              <div>
                                <span>
                                  {machine.machine_name.toLocaleUpperCase()} for{" "}
                                  {machine.purpose}
                                </span>
                              </div>
                            ))
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Used mechanization:&nbsp;
                        </span>
                        {request?.previously_mechanized || "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Previous machinery:&nbsp;
                        </span>
                        {request?.previous_machinery
                          ? request?.previous_machinery?.map((machine) => (
                              <div>
                                <span>
                                  {machine.machine_name.toLocaleUpperCase()} for{" "}
                                  {machine.purpose}
                                </span>
                              </div>
                            ))
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Labourers:{" "}
                        </span>{" "}
                        {request?.labourers ? request?.labourers : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
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

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Pest control:{" "}
                        </span>{" "}
                        {request?.pests
                          ? request?.pest_control?.map((control) => (
                              <div>
                                <span>
                                  {control.control_measure} for {control.pest}
                                </span>
                              </div>
                            ))
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Water contaminant{"(s)"}:
                        </span>

                        {!request?.water_contaminants?.length ? (
                          "Undefined"
                        ) : request?.water_contaminants?.length === 1 ? (
                          <span></span>
                        ) : (
                          <div>
                            {request?.water_contaminants?.map((contaminant) => (
                              <span>
                                {contaminant.contaminant} causes{" "}
                                {contaminant.effect}
                              </span>
                            ))}
                          </div>
                        )}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
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

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
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
                                <span>{request?.fertilizers?.[0].type}</span>
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

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Added by:{" "}
                        </span>
                        {request?.added_by ? request?.added_by : "Undefined"}
                      </p>

                      {request.geo_location ? (
                        <p>
                          <Button
                            onClick={() => routeToMaps(request?.geo_location)}
                          >
                            <span>See on map</span>
                          </Button>
                        </p>
                      ) : (
                        <Button variant={"destructive"}>
                          No map data available
                        </Button>
                      )}
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          ))}
      </div>
    </div>
    // <button onClick={makeAPIcall} disabled={isLoading}>
    //   {isLoading ? "Fetching data..." : "View field agents"}
    // </button>
  );
}
