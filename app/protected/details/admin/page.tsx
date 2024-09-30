"use client";
import { getUserAccType } from "@/app/actions";
import ReGrantParishAccessButton from "@/components/client-rej-by-server/district_admin/ReGrantParishAccessButton";
import RevokeParishAccessButton from "@/components/client-rej-by-server/district_admin/RevokeParishAccessButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Link } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LinearGradient } from "react-text-gradients";

const getKeys = (obj: any) => {
  return Object.keys(obj);
};
const headingKeys = ["first_name", "last_name", "sys_role", "image", 'agent_id'];

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

  if (key === "created_at" || key === 'granted_on') {
    const date = new Date(value);
    const time_with_offset_date = date.getTime() + 3 * 60 * 60 * 1000;
    const time_with_offset = new Date(time_with_offset_date);

    return `${getMonthName(time_with_offset.getMonth())} ${time_with_offset.getDate()}, ${time_with_offset.getFullYear()} at ${time_with_offset.getHours()}:${time_with_offset.getMinutes()}`;
  }

  if (value.includes("_")) {
    value = value.split("_").reduce((a: any, b: any) => `${a} ${b}`);
    return value.toLocaleUpperCase();
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
  const supabase = createClient();
  const [isMounted, setIsMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const currentDetailsJSON = localStorage.getItem("currentDetails");
  const currentDetails = currentDetailsJSON
    ? JSON.parse(currentDetailsJSON)
    : {};

  const keys = getKeys(currentDetails);
  const otherKeys = keys
    .filter((key) => !headingKeys.includes(key))
    .sort((a: string, b: string) => a.localeCompare(b));

  const columnArrays = generateColumnArrays(otherKeys);

  const makeAPIcall = () => {
    window.history.back();
    window.location.reload();
  };

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

  useEffect(() => {
    // Set the mounted state to true once the component is mounted
    setIsMounted(true);
  }, []);

  // Only render the content once the component is mounted
  if (!isMounted) {
    return null; // or return a loading spinner if desired
  }

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

          {role === "district_admin" && (
            <div className="w-full flex align-middle justify-center mt-3">
              {currentDetails.hasAccess ? (
                <div>
                  <RevokeParishAccessButton
                    refresh={makeAPIcall}
                    email={currentDetails.email!}
                  />
                </div>
              ) : (
                <div>
                  <ReGrantParishAccessButton
                    email={currentDetails.email!}
                    refresh={makeAPIcall}
                  />
                </div>
              )}
            </div>
          )}

          <div className="w-full flex align-middle justify-center">
            {currentDetails.sys_role === "district_admin" && (
              <a
                href={`/protected/district_email/${currentDetails.email}`}
                className="text-blue-500 flex align-middle justify-center py-2 gap-1"
              >
                {" "}
                <Link size={20} />
                See linked parish administrators
              </a>
            )}
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
