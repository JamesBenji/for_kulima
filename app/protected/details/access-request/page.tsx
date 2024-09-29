"use client";
import GrantAccessButton from "@/components/client-rej-by-server/ministry_admin/GrantAccessButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LinearGradient } from "react-text-gradients";

const getKeys = (obj: any) => {
  return Object.keys(obj);
};
const headingKeys = ["first_name", "last_name", "requested_as", "image"];

const formattedKey = (key: string) => {
  let temp = key;

  if (temp === "created_at") {
    temp = "Requested since";
  }
  if (temp === "hasAccess") {
    temp = "has access";
  }

  if (temp.includes("_")) {
    temp = temp.split("_").reduce((a, b) => `${a} ${b}`);
  }

  return temp.toLocaleUpperCase();
};

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

const formattedValue = (value: any, key: string) => {
  console.log({ key });
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (key === "created_at") {
    const date = new Date(value);
    const time_with_offset_date = date.getTime() + 3 * 60 * 60 * 1000;
    const time_with_offset = new Date(time_with_offset_date);

    return `${getMonthName(time_with_offset.getMonth())} ${time_with_offset.getDate()}, ${time_with_offset.getFullYear()} at ${time_with_offset.getHours()}:${time_with_offset.getMinutes()}`;
  }

  if (key === "requested_position") {
    return value === "district_admin"
      ? "District administrator"
      : value === "parish_admin"
        ? "Parish administrator"
        : "Field agent";
  }

  if (key === "granted_as") {
    return value === "null" ? "--" : value;
  }

  return value;
};

const generateColumnArrays = (arr: string[]) => {
  const COL_LIMIT = 5;
  if (arr.length > COL_LIMIT) {
    const breakIndex = Math.ceil(arr.length / 2);
    return [arr.slice(0, breakIndex), arr.slice(breakIndex)];
  }
  return [arr];
};

export default function AdministratorDetailsView() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDetailsJSON, setCurrentDetailsJSON] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  useEffect(() => {
    const temp = localStorage.getItem("currentRequest");
    setCurrentDetailsJSON(temp ?? "");
  }, []);

  const currentRequest = currentDetailsJSON
    ? JSON.parse(currentDetailsJSON)
    : {};

  const keys = getKeys(currentRequest);
  const otherKeys = keys
    .filter((key) => !headingKeys.includes(key))
    .sort((a, b) => a.localeCompare(b));

  const columnArrays = generateColumnArrays(otherKeys);
  const router = useRouter();

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      const requests = await fetch("/api/view-access-requests", {
        method: "GET",
      });
      const parsedRequests = await requests.json();

      if (parsedRequests.error) return toast.error(parsedRequests.error);

      if (!parsedRequests.error) {
        toast.success("Access granted");
        window.location.replace("/protected");
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log({ img: currentRequest.image });

  return (
    <div className="w-full overflow-hidden md:min-w-fit md:max-w-80 mx-auto my-5">
      {/* heading */}
      <p className="font-semibold tracking-normal md:text-2xl text-center py-5">
        <LinearGradient gradient={["to left", "#17acff ,#17acff ,#00ff00"]}>
          Administrator Details
        </LinearGradient>
      </p>

      {/* body */}
      <Card className="md:mx-auto w-full overflow-hidden flex flex-col align-middle justify-center">
        <CardHeader>
          <CardTitle className="md:min-w-prose w-full mx-auto rounded-lg shadow-md shadow-gray-300 border-[1px] border-gray-300 bg-gray-100 px-4 py-2">
            {/* image name sys_role */}
            <div className="flex flex-row align-middle justify-between rounded-lg overflow-hidden object-contain md:gap-4">
              <div className="w-[80px] h-[80px] object-contain rounded-lg overflow-hidden text-xs text-gray-300">
                <img
                  src={currentRequest.image}
                  alt="Admin requestor image"
                  height={80}
                  width={80}
                />
              </div>
              <div className="my-auto px-5">
                {/* name and sys_role */}
                <p className="font-semibold text-xl tracking-wide">{`${currentRequest.first_name} ${currentRequest.last_name}`}</p>
                <span className="text-sm font-normal tracking-normal text-black/60">
                  {currentRequest.requested_position === "district_admin"
                    ? "District administrator request"
                    : currentRequest.sys_role === "parish_admin"
                      ? "Parish administrator request"
                      : "Field agent request"}
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex md:flex-row">
            {/* col 1 */}
            <div className="flex flex-col overflow-x-hidden">
              {columnArrays[0].map((key) => (
                <div key={key} className="py-2 px-4 basis-1/2">
                  <div>
                    <p className="text-sm text-gray-500">{formattedKey(key)}</p>
                  </div>
                  <div>
                    <p>{formattedValue(currentRequest[key], key)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* col 2 */}
            <div className="flex flex-col overflow-x-hidden">
              {columnArrays[1].map((key) => (
                <div key={key} className="py-2 px-4 basis-1/2">
                  <div>
                    <p className="text-sm text-gray-500">{formattedKey(key)}</p>
                  </div>
                  <div>
                    <p>{formattedValue(currentRequest[key], key)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="py-2">
            <GrantAccessButton
              refresh={makeAPIcall}
              email={currentRequest.requestor_email}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
