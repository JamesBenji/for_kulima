"use client";

import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { RefreshCcw, SlidersHorizontal, TableOfContents } from "lucide-react";
import Image from "next/image";
import RevokeAccessButton from "./RevokeAccessButton";
import ReGrantAccessButton from "./ReGrantAccessButton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterByDistrict from "@/components/filter/FilterByDistrict";

export default function ViewDistrictAdminsButton() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<ParishAdminResponse[] | null>(null);
  const [displayReqs, setDisplayReqs] = useState<
    ParishAdminResponse[] | null | undefined
  >(null);
  const [review, setReview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState<string>("");

  const makeAPIcall = async () => {
    setIsLoading(true);

    try {
      const requests = await fetch("/api/view-district-admins", {
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

  const clearDistrictFilter = () => {
    setFilterDistrict("");
  };

  useEffect(() => {
    setDisplayReqs(requests);
  }, [requests]);

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

  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFirstName(value.trim());
    return;
  };


  useEffect(() => {
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
            (item.first_name.toLowerCase().includes(firstName.toLowerCase()) ||
              item.last_name.toLowerCase().includes(firstName.toLowerCase())) &&
            item.district === filterDistrict
        )
      );
    } else if (!firstName && filterDistrict) {
      setDisplayReqs(
        requests?.filter((item) => item.district === filterDistrict)
      );
    } else {
      console.log("4th condition");
      setDisplayReqs(requests);
    }
  }, [firstName, filterDistrict]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="w-full mb-4 md:flex md:flex-row md:mb-4 gap-2">
        <Input
          id="first_name"
          name="first_name"
          placeholder="Search by name"
          maxLength={20}
          onChange={handleInputChange}
          type="text"
        />
        <button
          className="bg-gray-300 text-gray-500 px-5 py-2 rounded-lg mt-3 md:mt-0"
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
        {displayReqs && displayReqs?.length > 0 ? (
          <h1 className="font-semibold tracking-wide text-lg mb-4">
            {displayReqs?.length}&nbsp;District administrator
            {displayReqs.length > 1 ? "s" : ""}{" "}
          </h1>
        ) : (
          <h1 className="font-semibold tracking-wide text-lg my-4">
            No district administrators found.
          </h1>
        )}
        {displayReqs
          ?.sort((a, b) => a.first_name.localeCompare(b.first_name))
          .map((request) => (
            <div key={request.email} className="my-2">
              <div className="block md:flex md:flex-row md:justify-around border-2 rounded-md py-5 px-4">
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
                    <h1 className="font-semibold tracking-wide text-xl">
                      {request.first_name} {request.last_name}
                    </h1>
                    <h2 className="font-light text-sm text-gray-500">
                      {request?.allocation}
                    </h2>
                  </div>
                  {/* Review button */}
                  <div className="md:flex md:flex-row md:basis-2/3 md:align-middle md:justify-evenly p-2">
                    <Button
                      asChild
                      className="px-5 py-2 mb-3 md:mb-0 hover:bg-blue-700 hover:text-white rounded-lg w-full md:w-fit border-blue-300 border-[1px] shadow-sm hover:underline bg-blue-200 text-blue-800"
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
                        <TableOfContents size={20} className="" />
                        <span>&nbsp;View details</span>
                      </div>
                    </Button>

                    {request.hasAccess ? (
                      <div>
                        <RevokeAccessButton
                          refresh={makeAPIcall}
                          email={request.email!}
                        />
                      </div>
                    ) : (
                      <div>
                        <ReGrantAccessButton
                          email={request.email!}
                          refresh={makeAPIcall}
                        />
                      </div>
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

                      <a
                        href={`/protected/district_email/${request.email}`}
                        className="text-blue-500 py-1"
                      >
                        See linked parish administrators
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
    //   {isLoading ? "Fetching data..." : "View district admins"}
    // </button>
  );
}
