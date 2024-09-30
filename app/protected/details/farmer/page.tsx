"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Loader2 } from "lucide-react";
import { LinearGradient } from "react-text-gradients";
import Image from "next/image";

const getKeys = (obj: any) => {
  if (obj) return typeof obj === "object" ? Object.keys(obj) : [];
};

const headingKeys = [
  "first_name",
  "last_name",
  "sys_role",
  "image",
  "other_income_sources",
  "tel",
  "farmer_uid",
];

const formattedKey = (key: string) => {
  let temp = key;

  if (temp === "created_at") {
    temp = "User since";
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
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (key === "created_at" || key === "granted_on") {
    const date = new Date(value);
    const time_with_offset_date = date.getTime() + 3 * 60 * 60 * 1000;
    const time_with_offset = new Date(time_with_offset_date);

    return `${getMonthName(time_with_offset.getMonth())} ${time_with_offset.getDate()}, ${time_with_offset.getFullYear()} at ${time_with_offset.getHours()}:${time_with_offset.getMinutes()}`;
  }

  return value;
};

const generateColumnArrays = (arr: string[] | undefined) => {
  if (arr) {
    const COL_LIMIT = 5;
    if (arr.length > COL_LIMIT) {
      const breakIndex = Math.ceil(arr.length / 2);
      return [arr.slice(0, breakIndex), arr.slice(breakIndex)];
    }
    return [arr];
  }
};

export default function FarmerCard() {
  // const farms = farmsJSON ? JSON.parse(farmsJSON) : {};

  // useEffect(() => {console.log({farms: JSON.stringify(farms, null, 2)})
  // }, [farms])

  const [farms, setFarms] = useState<any | null>(null);
  useEffect(() => {
    const farmsJSON = window.localStorage.getItem("currentFarmer");

    if (farmsJSON) {
      setFarms(JSON.parse(farmsJSON));
      console.log({ keys: Object.keys(JSON.parse(farmsJSON)) });
    }
  }, []);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keys = useMemo(() => getKeys(farms), [farms]);
  const otherKeys = useMemo(
    () =>
      keys
        ?.filter((key) => !headingKeys.includes(key) && key !== "agent_id")
        .sort((a: string, b: string) => a.localeCompare(b)),
    [keys]
  );

  const columnArrays = useMemo(
    () => generateColumnArrays(otherKeys),
    [otherKeys]
  );

  useEffect(() => {
    // Set the mounted state to true once the component is mounted
    setIsMounted(true);
    // setLoading(farms ? true : false);
  }, []);

  if (!isMounted) {
    return false;
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
      {/* heading */}
      <p className="font-semibold tracking-normal md:text-2xl text-center py-5">
        <LinearGradient gradient={["to left", "#17acff ,#17acff ,#00ff00"]}>
          Farmer Details
        </LinearGradient>
      </p>

      <div
        key={Math.random() * 10}
        className="w-full overflow-hidden md:min-w-fit md:max-w-80 mx-auto my-5"
      >
        {/* body */}
        <Card className="md:mx-auto w-full overflow-hidden flex flex-col align-middle justify-center">
          <CardHeader>
            <CardTitle className="md:min-w-prose w-full mx-auto rounded-lg shadow-md shadow-gray-300 border-[1px] border-gray-300 bg-gray-100 px-4 py-2">
              {/* image name sys_role */}
              <div className="flex flex-row align-middle justify-between rounded-lg overflow-hidden object-contain md:gap-4">
                {farms?.image && (
                  <div className="w-[80px] h-[80px] object-contain rounded-lg overflow-hidden">
                    <Image
                      src={farms?.image}
                      alt="Field agent image"
                      height={80}
                      width={80}
                      layout="responsive"
                      quality={80} // Adjust quality for smaller devices
                    />
                  </div>
                )}

                <div className="my-auto px-5">
                  {/* name and sys_role */}
                  <p className="font-semibold text-xl tracking-wide">{`${farms?.first_name} ${farms?.last_name}`}</p>
                  <span className="text-sm font-normal tracking-normal text-black/60">
                    Farmer
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex md:flex-row">
              {/* col 1 */}
              <div className="flex flex-col overflow-x-hidden">
                {columnArrays?.[0]?.map((key) => (
                  <div key={key} className="py-2 px-4 basis-1/2">
                    <div>
                      <p className="text-sm text-gray-500">
                        {formattedKey(key)}
                      </p>
                    </div>
                    <div>
                      <p>{formattedValue(farms?.[key], key)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* col 2 */}
              <div className="flex flex-col overflow-x-hidden">
                {columnArrays?.[1]?.map((key) => (
                  <div key={key} className="py-2 px-4 basis-1/2">
                    <div>
                      <p className="text-sm text-gray-500">
                        {formattedKey(key)}
                      </p>
                    </div>
                    <div>
                      <p>{formattedValue(farms?.[key], key)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {
              <div key={Math.random() * 10}>
                <div className="py-2 px-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formattedKey("other_income_sources")}
                    </p>
                  </div>

                  <div>
                    {farms?.other_income_sources?.map((source: any) => (
                      <div className="px-2">
                        <div>
                          <p className="text-xs text-gray-500">
                            {formattedKey("income_name")}
                          </p>
                        </div>

                        <div>
                          <p>
                            {formattedValue(source.income_name, "income_name")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-2 px-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formattedKey("tel")}
                    </p>
                  </div>

                  {/* <div>
                    {farms?.tel?.length > 0 && farms?.tel?.map((tel: any) => (
                      <div>
                        <div>
                          <p className="text-xs text-gray-500">
                            {formattedKey("Telephone")}
                          </p>
                        </div>

                        <div>
                          <p>{formattedValue(tel, "tel")}</p>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            }
            <div className="w-full flex align-middle justify-center">
              <a
                href={`/protected/deep-retrieval/${farms?.farmer_uid}`}
                className="text-blue-500 flex align-middle justify-center py-2 gap-1"
              >
                {" "}
                <Link size={20} />
                See linked farms
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
