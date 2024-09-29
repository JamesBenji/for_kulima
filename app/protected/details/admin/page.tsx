"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "react-text-gradients";

const getKeys = (obj: any) => {
  return Object.keys(obj);
};
const headingKeys = ["first_name", "last_name", "sys_role", "image"];

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
  //   const currentDetails = useDetailsCardState((state) => state.currentDetails);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set the mounted state to true once the component is mounted
    setIsMounted(true);
  }, []);

  // Only render the content once the component is mounted
  if (!isMounted) {
    return null; // or return a loading spinner if desired
  }
  const currentDetailsJSON = localStorage.getItem("currentDetails");
  const currentDetails = currentDetailsJSON
    ? JSON.parse(currentDetailsJSON)
    : {};

  const keys = getKeys(currentDetails);
  const otherKeys = keys
    .filter((key) => !headingKeys.includes(key))
    .sort((a: string, b: string) => a.localeCompare(b));

  const columnArrays = generateColumnArrays(otherKeys);

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
              <div className="w-[80px] h-[80px] object-contain rounded-lg overflow-hidden">
                <Image
                  src={currentDetails.image}
                  alt="Admin image"
                  height={80}
                  width={80}
                  layout="responsive"
                  quality={80} // Adjust quality for smaller devices
                />
              </div>
              <div className="my-auto px-5">
                {/* name and sys_role */}
                <p className="font-semibold text-xl tracking-wide">{`${currentDetails.first_name} ${currentDetails.last_name}`}</p>
                <span className="text-sm font-normal tracking-normal text-black/60">
                  {currentDetails.sys_role === "district_admin"
                    ? "District administrator"
                    : currentDetails.sys_role === "parish_admin"
                      ? "Parish administrator"
                      : "Field agent"}
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
                    <p>{formattedValue(currentDetails[key], key)}</p>
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
                    <p>{formattedValue(currentDetails[key], key)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex align-middle justify-center">
            {currentDetails.sys_role === 'district_admin' && <a
              href={`/protected/district_email/${currentDetails.email}`}
              className="text-blue-500 flex align-middle justify-center py-2 gap-1"
            > <Link size={20}/>
              See linked parish administrators
            </a>}
          </div>
        </CardContent>
      </Card>
    </div>
    // <div className="w-full overflow-hidden md:min-w-fit md:max-w-80 mx-auto my-5">
    //   {/* heading */}
    //   <p className=" font-semibold tracking-normal md:text-2xl text-center py-5">
    //     <LinearGradient gradient={["to left", "#17acff ,#17acff ,#00ff00"]}>
    //       Administrator Details
    //     </LinearGradient>
    //   </p>

    //   {/* body */}
    //   <Card className="mx-auto flex flex-col align-middle justify-center">
    //     <CardHeader>
    //       <CardTitle className="md:min-w-prose w-full mx-auto rounded-lg shadow-md shadow-gray-300 border-[1px] border-gray-300 bg-gray-100 px-4 py-2">
    //         {/* image name sys_role  */}
    //         <div className="flex flex-row align-middle justify-between rounded-lg overflow-hidden object-contain md:gap-4">
    //           <div className="w-[80px] h-[80px] object-contain rounded-lg overflow-hidden">
    //             <Image
    //               src={currentDetails.image}
    //               alt="Admin image"
    //               height={80}
    //               width={80}
    //               layout="responsive"
    //             />
    //           </div>
    //           <div className="my-auto px-5">
    //             {/* name and sys_role */}
    //             <p className="font-semibold text-xl tracking-wide">{`${currentDetails.first_name} ${currentDetails.last_name}`}</p>
    //             <span className="text-sm font-normal tracking-normal text-black/60">
    //               {currentDetails.sys_role === "district_admin"
    //                 ? "District administrator"
    //                 : currentDetails.sys_role === "parish_admin"
    //                   ? "Parish administrator"
    //                   : "Field agent"}
    //             </span>
    //           </div>
    //         </div>
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="md:flex md:flex-row">
    //         {/* col 1 */}
    //         <div>
    //           {columnArrays[0].map((key) => (
    //             <div key={key} className=" py-2 px-4 basis-1/2">
    //               <div>
    //                 <p className="text-sm text-gray-500">{formattedKey(key)}</p>
    //               </div>
    //               <div>
    //                 <p>{formattedValue(currentDetails[key], key)}</p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>

    //         <div>
    //           {columnArrays[1].map((key) => (
    //             <div key={key} className=" py-2 px-4 basis-1/2">
    //               <div>
    //                 <p className="text-sm text-gray-500">{formattedKey(key)}</p>
    //               </div>
    //               <div>
    //                 <p>{formattedValue(currentDetails[key], key)}</p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}
