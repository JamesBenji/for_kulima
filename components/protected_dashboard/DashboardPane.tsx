"use client";

import { useAdminDetails } from "@/utils/global_state/Store";
import React from "react";
interface AdminLocation {
  district: string | null | undefined;
  parish: string | null | undefined;
  allocation: string | null | undefined;
}

export default function DashboardPane({
  children,
  title,
  location
}: {
  children: React.ReactNode;
  title: string;
  location?: AdminLocation
}) {
  const role = useAdminDetails(state => state.role)
  return (
    <div className="flex-1 basis-4/5 py-5 overflow-hidden">
      <div className=" pb-4 px-1">
        <h2 className="font-bold text-2xl text-center">{title}</h2>
        {location && role === 'district_admin' && <h2 className="font-medium italic text-sm text-center">({location?.district} district)</h2>}
        {location && role === 'parish_admin' && <h2 className="font-medium italic text-sm text-center">({location?.district} district, {location?.parish} parish)</h2>}
      </div>

      <div className="border-t-2 p-4">{children}</div>
    </div>
  );
}
