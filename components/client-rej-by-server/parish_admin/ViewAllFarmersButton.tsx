"use client";

import { createClient } from "@/utils/supabase/client";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, RefreshCcw, TableOfContents } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserAccType } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import FilterByDistrict from "@/components/filter/FilterByDistrict";
import FilterByParish from "@/components/filter/FilterByParish";
import useUser from "@/hooks/useUser";
import { User } from "@supabase/supabase-js";
interface MyDataProps {
  district: string;
}

export default function ViewAllFarmersButton() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<FarmerResponse[] | null>(null);
  const [displayReqs, setDisplayReqs] = useState<
    FarmerResponse[] | null | undefined
  >(null);
  const [review, setReview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState<string>("");
  const [filterParish, setFilterParish] = useState<string>("");
  const [myData, setMyData] = useState<MyDataProps | null>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    supabase
      .from(
        `${role === "district_admin" ? "district_admin" : role === "parish_admin" ? "parish_admin" : "field_agents"}`
      )
      .select("district")
      .single().then((response) => {
        console.log({responseData: response.data});
        setMyData(response.data)
      })
  }, [role]);

  const myDistrict = useMemo(() => myData?.district, [myData]);

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

  const makeAPIcall = async () => {
    setIsLoading(true);

    try {
      const requests = await fetch("/api/view-farmers", {
        method: "GET",
      });

      const parsedRequests = await requests.json();

      if (parsedRequests.error) return toast.error(parsedRequests.error);

      if (!parsedRequests.error) {
        setRequests(parsedRequests.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setDisplayReqs(requests);
  }, [requests]);

  useEffect(() => {
    makeAPIcall();
  }, []);

  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFirstName(value.trim());
    return;
  };

  useEffect(() => {
    if (role === "ministry_admin") {
      if (firstName && filterDistrict === "") {
        setDisplayReqs(
          requests?.filter(
            (item) =>
              item.first_name.toLowerCase().includes(firstName.toLowerCase()) ||
              item.last_name.toLowerCase().includes(firstName.toLowerCase())
          )
        );
      } else if (firstName && filterDistrict) {
        setDisplayReqs(
          requests?.filter(
            (item) =>
              (item.first_name
                .toLowerCase()
                .includes(firstName.toLowerCase()) ||
                item.last_name
                  .toLowerCase()
                  .includes(firstName.toLowerCase())) &&
              item.district === filterDistrict
          )
        );
      } else if (!firstName && filterDistrict) {
        setDisplayReqs(
          requests?.filter((item) => item.district === filterDistrict)
        );
      } else {
        setDisplayReqs(requests);
      }
    }

    if (role === "district_admin") {
      if (firstName && filterParish === "") {
        setDisplayReqs(
          requests?.filter(
            (item) =>
              item.first_name.toLowerCase().includes(firstName.toLowerCase()) ||
              item.last_name.toLowerCase().includes(firstName.toLowerCase())
          )
        );
      } else if (firstName && filterParish) {
        setDisplayReqs(
          requests?.filter(
            (item) =>
              (item.first_name
                .toLowerCase()
                .includes(firstName.toLowerCase()) ||
                item.last_name
                  .toLowerCase()
                  .includes(firstName.toLowerCase())) &&
              item.parish === filterParish
          )
        );
      } else if (!firstName && filterParish) {
        setDisplayReqs(
          requests?.filter((item) => item.parish === filterParish)
        );
      } else {
        setDisplayReqs(requests);
      }
    }
  }, [firstName, filterDistrict, filterParish]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }


  return (
    <div>
      <div className="w-full flex flex-col md:flex-row justify-between  mb-3">
        <div className="flex-1 mb-4 md:mb-0 md:pr-5">
          <Input
            id="first_name"
            name="first_name"
            placeholder="Search by name"
            maxLength={20}
            onChange={handleInputChange}
            type="text"
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
        {role !== "district_admin" ? (
          <FilterByDistrict
            state={filterDistrict}
            setState={setFilterDistrict}
          />
        ) : (
          <FilterByParish
            state={filterParish}
            setState={setFilterParish}
            district={myDistrict}
          />
        )}
        <Button
          className="bg-gray-300 text-black hover:bg-white"
          onClick={clearDistrictFilter}
        >
          Clear filter
        </Button>
      </div>

      <div>
        {displayReqs && displayReqs?.length > 0 ? (
          <h1 className="font-semibold tracking-wide text-lg mb-4">
            {displayReqs?.length}&nbsp;Farmer{displayReqs.length > 1 ? "s" : ""}{" "}
          </h1>
        ) : (
          <h1 className="font-semibold tracking-wide text-lg my-4">
            There are no farmers in your region.
          </h1>
        )}
        {displayReqs
          ?.sort((a, b) => a.first_name.localeCompare(b.first_name))
          ?.map((request) => (
            <div key={request.farmer_uid}>
              <div className="flex flex-row justify-between border-2 rounded-md p-3 mt-1">
                <div className="flex-1 flex flex-col md:flex-row justify-evenly">
                  {/* requestor name and requested position */}
                  <div className="flex-1 py-1 px-2">
                    <h1 className="font-semibold tracking-normal text-lg">
                      {request?.first_name} {request?.last_name}
                    </h1>
                    <h2 className="font-light text-sm">
                      {request?.address || "Disrict, Parish, Village"}
                    </h2>
                  </div>
                  {/* Review button */}
                  <div className="flex flex-row basis-2/3  justify-end p-2">
                    <Button
                      asChild
                      className={`${role !== "district_admin" ? "ml-auto" : ""} px-5 py-2 mb-3 md:mb-0 hover:bg-blue-700 hover:text-white rounded-lg w-full md:w-fit border-blue-300 border-[1.5px] shadow-sm hover:underline bg-blue-200 text-blue-800`}
                      onClick={() => {
                        toast("Loading", { duration: 2000 });
                        console.log({ request: Object.keys(request) });

                        localStorage.setItem(
                          "currentFarmer",
                          JSON.stringify(request)
                        );
                        router.push("/protected/details/farmer");
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
                {review === `${request?.first_name} ${request?.last_name}` && (
                  <div className="flex flex-col md:flex-row md:px-3 border rounded-md animate-accordion-down md:py-2">
                    <div className="hidden md:flex basis-1/3 p-5"></div>
                    <div className="flex-col basis-2/3 p-8">
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Name:&nbsp;
                        </span>
                        <span>
                          {request?.first_name} {request?.last_name}
                        </span>
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        {" "}
                        <span className="font-semibold text-lg tracking-wide">
                          Email:&nbsp;
                        </span>
                        {request?.email || "Undefined"}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Gender:&nbsp;
                        </span>
                        {request?.gender}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Date of birth:&nbsp;
                        </span>
                        {request?.dob ? request?.dob : "Undefined"}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Address:&nbsp;
                        </span>
                        {request?.address}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          size:&nbsp;
                        </span>
                        {request?.household_size
                          ? request?.household_size
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Number of children:{" "}
                        </span>{" "}
                        {request?.no_children
                          ? request?.no_children
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          School going children:{" "}
                        </span>{" "}
                        {request?.count_school_going
                          ? request?.count_school_going
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        {" "}
                        <span className="font-semibold text-lg tracking-wide">
                          Phone number{"(s)"}:
                        </span>
                        {!request?.tel?.length ? (
                          "Undefined"
                        ) : request?.tel?.length === 1 ? (
                          <span>
                            {request.tel[0] ? request.tel[0] : "Undefined"}{" "}
                          </span>
                        ) : (
                          Array.isArray(request?.tel) &&
                          request.tel.map((tel) => (
                            <li>
                              <span key={tel}>{tel}</span> <br />
                            </li>
                          ))
                        )}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        <span className="font-semibold text-lg tracking-wide">
                          Average income per harvest:{" "}
                        </span>
                        {request.average_income_per_harvest
                          ? request.average_income_per_harvest
                          : "Undefined"}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
                        {" "}
                        <span className="font-semibold text-lg tracking-wide">
                          Other income sources:
                        </span>
                        {!request?.other_income_sources?.length ? (
                          "Undefined"
                        ) : request?.other_income_sources?.length === 1 ? (
                          <span>
                            {request?.tel?.[0]
                              ? request?.tel?.[0]
                              : "Undefined"}{" "}
                          </span>
                        ) : (
                          request?.other_income_sources?.map((source) => (
                            <>
                              <span key={source.income_name}>
                                {source.income_name
                                  ? source.income_name
                                  : "Undefined"}
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

                      <a
                        href={`/protected/deep-retrieval/${request.farmer_uid}`}
                      >
                        See farms
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
