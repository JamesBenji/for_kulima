"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { RefreshCcw, TableOfContents } from "lucide-react";
import Image from "next/image";
import RevokeAccessButton from "./RevokeAccessButton";
import ReGrantAccessButton from "./ReGrantAccessButton";

const supabase = createClient();

export default function ViewDistrictAdminsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<ParishAdminResponse[] | null>(null);
  const [review, setReview] = useState<string | null>(null);

  const toggleReviewSection = (id: string) => {
    if (review) {
      setReview((prev) => {
        return prev === id ? null : id;
      });
    } else {
      setReview(id);
    }
  };

  const makeAPIcall = async () => {
    setIsLoading(true);

    try {
      const loader = toast.loading("Processing your request", {
        duration: 10000,
      });

      const requests = await fetch("/api/view-district-admins", {
        method: "GET",
      });

      const parsedRequests = await requests.json();

      if (parsedRequests.error) return toast.error(parsedRequests.error);

      if (!parsedRequests.error) {
        setRequests(parsedRequests.data);
      }

      toast.dismiss(loader);
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
        { event: "*", schema: "public", table: "parish_admin" },
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

  return (
    <div>
      <div className="w-full mb-4 md:mb-0 md:flex md:flex-row md:justify-end">
        <button
          className="bg-gray-300 text-gray-500 px-5 py-2 rounded-lg"
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
            {requests?.length}&nbsp;District administrator
            {requests.length > 1 ? "s" : ""}{" "}
          </h1>
        ) : (
          <h1 className="font-semibold tracking-wide text-lg my-4">
            There are no district administrators.
          </h1>
        )}
        {requests
          ?.sort((a, b) => a.first_name.localeCompare(b.first_name))
          .map((request) => (
            <div key={request.email} className="my-2">
              <div className="block md:flex md:flex-row md:justify-around border-2 rounded-md p-2">
                <div className="flex w-[50px] h-[50px] rounded-full overflow-hidden object-contain mr-5">
                  {/* Requestor image */}
                  {request.image && (
                    <Image
                      src={request.image}
                      alt="Field agent image"
                      width={50}
                      height={50}
                      objectFit="contain"
                    />
                  )}
                </div>
                <div className="md:flex-1  md:flex md:flex-row md:justify-evenly">
                  {/* requestor name and requested position */}
                  <div className="flex-1 py-1 px-2">
                    <h1 className="font-semibold tracking-normal text-lg">
                      {request.first_name} {request.last_name}
                    </h1>
                    <h2 className="font-light text-sm">
                      {request.allocation || "Disrict, Parish, Village"}
                    </h2>
                  </div>
                  {/* Review button */}
                  <div className="md:flex md:flex-row md:basis-2/3 md:align-middle md:justify-evenly p-2">
                    <div className="bg-blue-800 mb-4 md:mb-0 w-full md:w-fit p-[1.5px] rounded-lg">
                      <button
                        className="px-5 py-2 rounded-lg w-full md:w-fit border-white border-[1px] shadow-sm hover:underline bg-blue-200 text-blue-800"
                        onClick={() => toggleReviewSection(request.email!)}
                      >
                        <div className="flex flex-row align-middle justify-center md:justify-start">
                          <TableOfContents className="text-blue-800" />
                          &nbsp;View details
                        </div>
                      </button>
                    </div>

                    {request.hasAccess ? (
                      <RevokeAccessButton
                        refresh={makeAPIcall}
                        email={request.email!}
                      />
                    ) : (
                      <ReGrantAccessButton
                        email={request.email!}
                        refresh={makeAPIcall}
                      />
                    )}
                  </div>
                </div>
                {/* review section */}
              </div>
              
              <div>
                {review === request.email && (
                  <div className="flex flex-col md:flex-row md:px-3 border rounded-md animate-accordion-down md:py-2">
                    <div className="hidden md:flex basis-1/3 p-5">
                      {request.image && (
                        <Image
                          src={request.image}
                          alt="Field agent image"
                          width={50}
                          height={50}
                          layout="responsive"
                        />
                      )}
                    </div>
                    <div className="flex-col basis-2/3 p-8">
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Name:&nbsp;
                        </span>
                        <span>
                          {request.first_name} {request.last_name}
                        </span>
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        {" "}
                        <span className="font-semibold text-lg tracking-wide">
                          Email:&nbsp;
                        </span>
                        {request.email}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Gender:&nbsp;
                        </span>
                        {request.gender}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Organization:&nbsp;
                        </span>
                        {request.organization}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        {" "}
                        <span className="font-semibold text-lg tracking-wide">
                          Phone number{"(s)"}:
                        </span>
                        {request.phone_number.length === 1 ? (
                          <span>{request.phone_number[0]} </span>
                        ) : (
                          request.phone_number.map((tel) => (
                            <>
                              <span key={tel}>{tel} </span> <br />
                            </>
                          ))
                        )}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Allocation:{" "}
                        </span>{" "}
                        {`${request.district} ${request.parish}`}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Allocation:{" "}
                        </span>
                        {request.allocation}
                      </p>

                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Granted by:{" "}
                        </span>
                        {request.granted_by}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Has system access:{" "}
                        </span>
                        {request.hasAccess ? "True" : "False"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
    // <button onClick={makeAPIcall} disabled={isLoading}>
    //   {isLoading ? "Fetching data..." : "View district admins"}
    // </button>
  );
}