"use client";

import React from "react";

export default function DashboardPane({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex-1 basis-4/5 py-5 overflow-hidden">
      <div className=" pb-4">
        <h2 className="font-bold text-2xl text-center">{title}</h2>
      </div>

      <div className="border-t-2 p-4">{children}</div>
    </div>
  );
}
