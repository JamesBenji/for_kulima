"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReGrantAgentAccessButton from "./ReGrantAgentAccessButton";
import RevokeAgentAccessButton from "./RevokeAgentAccessButton";
import { RefreshCcw, TableOfContents } from "lucide-react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { getUserAccType } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function ViewAllParishAgentsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<AccountApplicationData[] | null>(
    null
  );
  const [review, setReview] = useState<string | null>(null);
  
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      if (response.error)
        toast.error("Error: Could not find user data for the session.");
      setUser(response.data.user);
    });
  }, []);

  useEffect(() => {
    if (user?.email)
      getUserAccType(user?.email).then((response) => {
        setRole(response);
      });
  }, [user]);

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
      const requests = await fetch("/api/view-field-agents", {
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
    makeAPIcall();
  }, []);

  useEffect(() => {
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agent_account_requests" },
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
      <div className="w-full mb-4 md:flex md:flex-row ">
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
            {requests?.length}&nbsp;Field agent{requests.length > 1 ? "s" : ""}{" "}
          </h1>
        ) : (
          <h1 className="font-semibold tracking-wide text-lg my-4">
            There are no field agents.
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
                    />
                  )}
                </div>
                <div className="md:flex-1 md:flex md:flex-row md:justify-evenly">
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
                  <Button
                      asChild
                      // className={`${role !== 'district_admin' && role !== 'parish_admin' ? 'ml-auto' : ''} px-5 py-2 mb-3 md:mb-0 hover:bg-blue-700 hover:text-white rounded-lg w-full md:w-fit border-blue-300 border-[1px] shadow-sm hover:underline bg-blue-200 text-blue-800`}
                      className={` px-5 py-2 mb-3 md:mb-0 hover:bg-blue-700 hover:text-white rounded-lg w-full md:w-fit border-blue-300 border-[1px] shadow-sm hover:underline bg-blue-200 text-blue-800`}
                      onClick={() => {
                        toast("Loading", { duration: 2000 });
                        localStorage.setItem(
                          "currentDetails",
                          JSON.stringify(request)
                        );
                        router.push("/protected/details/admin");
                      }}
                    >
                      <div className="flex flex-row align-middle justify-center md:justify-start gap-1">
                        <TableOfContents
                          size={20}
                          className=""
                        />
                        <span>&nbsp;View details</span>
                      </div>
                    </Button>

                    {/* {role === 'parish_admin' && <div className="md:flex md:flex-row  md:align-middle md:justify-evenly"> */}
                    { <div className="md:flex md:flex-row  md:align-middle md:justify-evenly">
                    {request.hasAccess ? (
                      <RevokeAgentAccessButton
                        refresh={makeAPIcall}
                        email={request.email!}
                      />
                    ) : (
                      <ReGrantAgentAccessButton
                        email={request.email!}
                        refresh={makeAPIcall}
                      />
                    )}
                    </div>}
                  </div>
                </div>
                {/* review section */}
              </div>
              <div>
                {review === request.email && (
                  <div className="flex flex-col md:flex-row px-3 border rounded-md animate-accordion-down py-2">
                    <div className="flex basis-1/3 p-5">
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
                          Requests access as:{" "}
                        </span>{" "}
                        {request.requested_position === "district_admin"
                          ? "District administrator"
                          : request.requested_position === "parish_admin"
                            ? "Parish administrator"
                            : "Field agent"}
                      </p>
                      <p className="flex flex-col md:flex-row justify-between align-middle py-1">
                        <span className="font-semibold text-lg tracking-wide">
                          Allocation:{" "}
                        </span>
                        {request.allocation}
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
    //   {isLoading ? "Fetching data..." : "View field agents"}
    // </button>
  );
}
