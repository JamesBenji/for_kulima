import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Loader2, TableOfContents } from "lucide-react";
import { LinearGradient } from "react-text-gradients";
import Image from "next/image";

type ParishAdminFromDistrictAdminProps = {
  email: string;
};

let objectValue: {
  key: string;
  entries: { key: string; value: string | number }[];
}[] = [];

const getKeys = (obj: any) => {
  return typeof obj === "object" ? (Object.keys(obj)) : [];
};

const headingKeys = [
  "first_name",
  "last_name",
  "sys_role",
  "image",
  "other_income_sources",
  "tel",
  'farmer_uid'
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

const generateColumnArrays = (arr: string[]) => {
  const COL_LIMIT = 5;
  if (arr.length > COL_LIMIT) {
    const breakIndex = Math.ceil(arr.length / 2);
    return [arr.slice(0, breakIndex), arr.slice(breakIndex)];
  }
  return [arr];
};

export default function FarmersFromAgents({
  email,
}: ParishAdminFromDistrictAdminProps) {
  const [farms, setFarms] = useState<FarmerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const keys = useMemo(() => getKeys(farms?.[0]), [farms]);
  const otherKeys = useMemo(
    () =>
      keys
        .filter((key) => !headingKeys.includes(key) && key !== "agent_id")
        .sort((a: string, b: string) => a.localeCompare(b)),
    [keys]
  );

  const columnArrays = useMemo(
    () => generateColumnArrays(otherKeys),
    [otherKeys]
  );

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch("/api/show-farmers-from-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch farms");
        }

        const data = await response.json();
        setFarms(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [email]);

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
      {/* heading */}
      <p className="font-semibold tracking-normal md:text-2xl text-center py-5">
        <LinearGradient gradient={["to left", "#17acff ,#17acff ,#00ff00"]}>
        {`${farms?.length} `}Farmer{`${farms?.length > 1 ? 's' : ''} `}
        </LinearGradient>
      </p>
      

      {farms?.length > 0 &&
        farms
          ?.sort((a, b) => a?.first_name?.localeCompare(b.last_name))
          ?.map((currentDetails: any, index) => (
            <div
              key={currentDetails.email}
              className="w-full overflow-hidden md:min-w-fit md:max-w-screen-md mx-auto my-5"
            >
              {/* body */}
              <Card className="md:mx-auto w-full overflow-hidden flex flex-col align-middle justify-center">
                <CardHeader>
                  <CardTitle className="md:min-w-prose w-full mx-auto rounded-lg shadow-md shadow-gray-300 border-[1px] border-gray-300 bg-gray-100 px-4 py-2">
                    {/* image name sys_role */}
                    <div className="flex flex-row align-middle justify-between rounded-lg overflow-hidden object-contain md:gap-4">
                      {currentDetails?.image && (
                        <div className="w-[80px] h-[80px] object-contain rounded-lg overflow-hidden">
                          <Image
                            src={currentDetails?.image}
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
                        <p className="font-semibold text-xl tracking-wide">{`${currentDetails?.first_name} ${currentDetails?.last_name}`}</p>
                        <span className="text-sm font-normal tracking-normal text-black/60">
                          Farmer
                        </span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex md:flex-row md:justify-between">
                    {/* col 1 */}
                    <div className="flex flex-col overflow-x-hidden">
                      {columnArrays[0].map((key) => (
                        <div key={key} className="py-2 px-4 basis-1/2">
                          <div>
                            <p className="text-sm text-gray-500">
                              {formattedKey(key)}
                            </p>
                          </div>
                          <div>
                            <p>{formattedValue(currentDetails?.[key], key)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* col 2 */}
                    <div className="flex flex-col overflow-x-hidden">
                      {columnArrays[1].map((key) => (
                        <div key={key} className="py-2 px-4 basis-1/2">
                          <div>
                            <p className="text-sm text-gray-500">
                              {formattedKey(key)}
                            </p>
                          </div>
                          <div>
                            <p>{formattedValue(currentDetails?.[key], key)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {
                    <div key={index}>
                      <div className="py-2 px-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {formattedKey("other_income_sources")}
                          </p>
                        </div>

                        <div>
                          {currentDetails.other_income_sources.map((source: any) => (
                            <div className="px-2">
                              <div>
                                <p className="text-xs text-gray-500">
                                  {formattedKey("income_name")}
                                </p>
                              </div>

                              <div>
                                <p>
                                  {formattedValue(
                                    source.income_name,
                                    "income_name"
                                  )}
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

                        <div>
                          {currentDetails?.tel?.map((tel: any) => (
                            <div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  {formattedKey("income_name")}
                                </p>
                              </div>

                              <div>
                                <p>{formattedValue(tel, "tel")}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  }
                  <div className="w-full flex align-middle justify-center">
                    <a
                      href={`/protected/deep-retrieval/${currentDetails?.farmer_uid}`}
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
          ))}
    </div>
    // <div>
    //   {/* {farms.length > 0 &&
    //     farms?.map((farm, index) => ( */}
    //   <Card className="mx-auto flex flex-col align-middle justify-center">
    //     <CardHeader>
    //       <CardTitle className="max-w-prose mx-auto">
    //         Farmers added by this user ({farms.length})
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       {farms
    //         ?.sort((a, b) => a.first_name.localeCompare(b.first_name))
    //         .map((request) => (
    //           <div key={request?.tel?.[0]}>
    //             <div className="flex flex-row justify-between w-fit max-w-prose mx-auto p-3 mt-1">
    //               <div className="flex-1 flex flex-col md:flex-row justify-evenly">
    //                 {/* requestor name and requested position */}
    //                 <div className="flex-1 py-1 px-2">
    //                   <h1 className="font-semibold tracking-normal text-lg">
    //                     {request?.first_name} {request?.last_name}
    //                   </h1>
    //                   <h2 className="font-light text-sm">
    //                     {request?.address || "Disrict, Parish, Village"}
    //                   </h2>
    //                 </div>
    //               </div>
    //               {/* review section */}
    //             </div>
    //             <div>
    //               {
    //                 <div className="flex flex-col md:flex-row align-middle max-w-prose mx-auto justify-center md:px-3 border rounded-md animate-accordion-down md:py-2">

    //                   <div className="flex-col p-8">
    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Name:&nbsp;
    //                       </span>
    //                       <span>
    //                         {request?.first_name} {request?.last_name}
    //                       </span>
    //                     </p>
    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       {" "}
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Email:&nbsp;
    //                       </span>
    //                       {request?.email || "Undefined"}
    //                     </p>
    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Gender:&nbsp;
    //                       </span>
    //                       {request?.gender}
    //                     </p>
    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Date of birth:&nbsp;
    //                       </span>
    //                       {request?.dob ? request?.dob : "Undefined"}
    //                     </p>
    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Address:&nbsp;
    //                       </span>
    //                       {request?.address}
    //                     </p>
    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         size:&nbsp;
    //                       </span>
    //                       {request?.household_size
    //                         ? request?.household_size
    //                         : "Undefined"}
    //                     </p>

    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Number of children:{" "}
    //                       </span>{" "}
    //                       {request?.no_children
    //                         ? request?.no_children
    //                         : "Undefined"}
    //                     </p>

    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         School going children:{" "}
    //                       </span>{" "}
    //                       {request?.count_school_going
    //                         ? request?.count_school_going
    //                         : "Undefined"}
    //                     </p>

    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       {" "}
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Phone number{"(s)"}:
    //                       </span>
    //                       {!request?.tel?.length ? (
    //                         "Undefined"
    //                       ) : request?.tel?.length === 1 ? (
    //                         <span>
    //                           {request.tel[0] ? request.tel[0] : "Undefined"}{" "}
    //                         </span>
    //                       ) : (
    //                         request?.tel?.map((tel) => (
    //                           <>
    //                             <span key={tel}>{tel}</span> <br />
    //                           </>
    //                         ))
    //                       )}
    //                     </p>

    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Average income per harvest:{" "}
    //                       </span>
    //                       {request.average_income_per_harvest
    //                         ? request.average_income_per_harvest
    //                         : "Undefined"}
    //                     </p>

    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       {" "}
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Other income sources:
    //                       </span>
    //                       {!request?.other_income_sources?.length ? (
    //                         "Undefined"
    //                       ) : request?.other_income_sources?.length === 1 ? (
    //                         <span>
    //                           {request?.tel?.[0]
    //                             ? request?.tel?.[0]
    //                             : "Undefined"}{" "}
    //                         </span>
    //                       ) : (
    //                         request?.other_income_sources?.map((source) => (
    //                           <>
    //                             <span key={source.income_name}>
    //                               {source.income_name
    //                                 ? source.income_name
    //                                 : "Undefined"}
    //                             </span>{" "}
    //                             <br />
    //                           </>
    //                         ))
    //                       )}
    //                     </p>

    //                     <p className="flex flex-col md:flex-row justify-between align-middle py-[2px]">
    //                       <span className="font-semibold text-lg tracking-wide">
    //                         Added by:{" "}
    //                       </span>
    //                       {request?.added_by ? request?.added_by : "Undefined"}
    //                     </p>

    //                     <a
    //                       href={`/protected/deep-retrieval/${request.farmer_uid}`}
    //                       className="text-blue-500 py-2"
    //                     >
    //                       See linked farm
    //                     </a>
    //                   </div>
    //                 </div>
    //               }
    //             </div>
    //           </div>
    //         ))}
    //     </CardContent>
    //   </Card>
    //   {/* ))} */}
    // </div>
  );
}
