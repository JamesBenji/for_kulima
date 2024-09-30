"use client";

import { createClient } from "@/utils/supabase/client";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RefreshCcw, TableOfContents } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserAccType } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const supabase = createClient();

export default function ViewAllFarmersButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<FarmerResponse[] | null>(null);
  const [requests_data, setRequestsData] = useState<FarmerResponse[] | null>(
    null
  );
  const [review, setReview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    setRequests(requests_data);
  }, [requests_data]);

  const [role, setRole] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      const email = res.data.user?.email;
      if (email) {
        getUserAccType(email).then((_role) => setRole(_role));
      }
    });
  }, []);

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      const requests = await fetch("/api/view-farmers", {
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
    setFirstName(event.target.value.trim());
  };

  useEffect(() => {
    if (firstName) {
      setRequests((prev) => {
        return prev
          ? prev?.filter((item) =>
              item.first_name.toLowerCase().includes(firstName.toLowerCase())
            )
          : null;
      });
    } else {
      setRequests(requests_data);
    }
  }, [firstName]);


  return (
    <div>
      <div className="w-full flex flex-col md:flex-row justify-between  mb-3">
        <div className="flex-1 mb-4 md:mb-0 md:pr-5">
          <input
            type="text"
            name="first_name"
            onChange={handleFirstNameChange}
            placeholder="Search by name"
            className="w-full border-2 border-gray-300 rounded-md p-2"
          />
          {/* <Input
          id="first_name"
          name="first_name"
          placeholder="Search by name"
          maxLength={20}
          onChange={handleFirstNameChange}
          type="text"
        /> */}
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

      <div>
        {requests && requests?.length > 0 ? (
          <h1 className="font-semibold tracking-wide text-lg mb-4">
            {requests?.length}&nbsp;Farmer{requests.length > 1 ? "s" : ""}{" "}
          </h1>
        ) : (
          <h1 className="font-semibold tracking-wide text-lg my-4">
            There are no farmers in your region.
          </h1>
        )}
        {requests
          ?.sort((a, b) => a.first_name.localeCompare(b.first_name))
          .map((request) => (
            <div key={request?.tel?.[0]}>
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
    // <button onClick={makeAPIcall} disabled={isLoading}>
    //   {isLoading ? "Fetching data..." : "View field agents"}
    // </button>
  );
}
