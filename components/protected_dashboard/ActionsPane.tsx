"use client";
import React from "react";
import { LinearGradient } from "react-text-gradients";

export default function ActionsPane({
  children,
  hidden,
  titleRemoved,
}: {
  children: React.ReactNode;
  hidden?: boolean;
  titleRemoved?: boolean;
}) {
  return (
    <div
      className={`${hidden ? "hidden" : ""} md:flex flex-1  basis-1/5 flex-col overflow-y-scroll ${titleRemoved ? "" : "border-r-2"} py-5`}
    >
      <div className="pb-4 ">
        {!titleRemoved && (
          <h1 className="text-2xl font-bold px-10">
            <LinearGradient gradient={["to left", "#17acff ,#00ff00"]}>
              Actions
            </LinearGradient>
          </h1>
        )}
      </div>
      <div className={`flex flex-col ${titleRemoved ? "" : "border-t-2"} px-5`}>
        {children}
      </div>
    </div>
  );
}
