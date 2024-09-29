"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GrantAccessButton from "./GrantAccessButton";
import Image from "next/image";
import { BadgeAlert, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Span } from "next/dist/trace";

const supabase = createClient();

export default function ViewAccessRequestsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<AccountApplicationData[] | null>(
    null
  );
  const [review, setReview] = useState<string | null>(null);
  const router = useRouter();

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
      const requests = await fetch("/api/view-access-requests", {
        method: "GET",
      });
      const parsedRequests = await requests.json();

      if (parsedRequests.error) return toast.error(parsedRequests.error);

      if (!parsedRequests.error) {
        setRequests(parsedRequests.accessRequests.accessRequests);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "district_account_requests" },
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

  useEffect(() => {
    makeAPIcall();
  }, []);

  return (
    <div>
      <div className="w-full flex flex-row justify-end">
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
            District Administrator access requests ({requests?.length})
          </h1>
        ) : (
          <h1 className="font-semibold tracking-wide text-lg my-4">
            There are currently no requests.
          </h1>
        )}
        {requests?.map((request) => (
          <div key={request.requestor_email}>
            <div className="flex flex-row justify-around border-2 rounded-md p-2">
              <div className="flex w-[50px] h-[50px] rounded-full overflow-hidden object-contain mr-5">
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
              <div className="flex-1  flex flex-row justify-evenly">
                {/* requestor name and requested position */}
                <div className="flex-1 py-1 px-2">
                  <h1 className="font-semibold tracking-wide text-lg">
                    {request.first_name} {request.last_name}
                  </h1>
                  <h2 className="font-light text-sm">
                    {request.allocation || "Disrict, Parish, Village"}
                  </h2>
                </div>
                {/* Review button */}
                <div className="flex basis-1/4 align-middle justify-center p-2">
                  <button
                    className="border-2 px-4 bg-blue-500 rounded-lg"
                    onClick={() => {
                      // toggleReviewSection(request.requestor_email);
                      setIsLoading(true);
                      localStorage.setItem(
                        "currentRequest",
                        JSON.stringify(request)
                      );
                      router.push("/protected/details/access-request");
                    }}
                  >
                    <div className="flex flex-row justify-around align text-white">
                      {isLoading ? (
                        "Opening"
                      ) : (
                        <span className="flex flex-row justify-around align text-white">
                          <BadgeAlert className="text-white" />
                          &nbsp;&nbsp; Review request
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              {/* review section */}
            </div>
            <div>
              {review === request.requestor_email && (
                <div className="flex flex-row px-3 border rounded-md animate-accordion-down py-2">
                  <div className="flex basis-1/3">
                    {request.image && (
                      <div className="rounded-lg overflow-hidden">
                        <Image
                          src={request.image}
                          alt="Field agent image"
                          width={50}
                          height={50}
                          layout="responsive"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-col basis-2/3">
                    <p className="flex flex-row justify-between align-middle py-1">
                      <span className="font-semibold text-lg tracking-wide">
                        Name:&nbsp;
                      </span>
                      <span>
                        {request.first_name} {request.last_name}
                      </span>
                    </p>
                    <p className="flex flex-row justify-between align-middle py-1">
                      {" "}
                      <span className="font-semibold text-lg tracking-wide">
                        Email:&nbsp;
                      </span>
                      {request.requestor_email}
                    </p>
                    <p className="flex flex-row justify-between align-middle py-1">
                      <span className="font-semibold text-lg tracking-wide">
                        Gender:&nbsp;
                      </span>
                      {request.gender}
                    </p>
                    <p className="flex flex-row justify-between align-middle py-1">
                      <span className="font-semibold text-lg tracking-wide">
                        Organization:&nbsp;
                      </span>
                      {request.organization}
                    </p>
                    <p className="flex flex-row justify-between align-middle py-1">
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
                    <p className="flex flex-row justify-between align-middle py-1">
                      <span className="font-semibold text-lg tracking-wide">
                        Requests access as:{" "}
                      </span>{" "}
                      {request.requested_position === "district_admin"
                        ? "District administrator"
                        : request.requested_position === "parish_admin"
                          ? "Parish administrator"
                          : "Field agent"}
                    </p>
                    <p className="flex flex-row justify-between align-middle py-1">
                      <span className="font-semibold text-lg tracking-wide">
                        Allocation:{" "}
                      </span>
                      {request.allocation}
                    </p>
                    <div>
                      <GrantAccessButton
                        refresh={makeAPIcall}
                        email={request.requestor_email}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    // <button onClick={makeAPIcall} disabled={isLoading}>
    //   {isLoading ? "Fetching data..." : "View access requests"}
    // </button>
  );
}
