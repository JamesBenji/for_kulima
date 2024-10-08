"use client";
import { Loader2 } from "lucide-react";
import React from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

interface GraphCardProps {
  data: TrendsObject[] | undefined | null;
  y_axis:
    | "farms"
    | "farmers"
    | "district_admins"
    | "parish_admins"
    | "field_agents";
  width: number;
  height: number;
}

export default function GraphCard({
  data,
  y_axis,
  width,
  height
}: GraphCardProps) {
  const XAxisDataKey = "created_at";
  let YAxisDataKey: string;
  let displayTitle: string;
  switch (y_axis) {
    case "district_admins":
      YAxisDataKey = "district_admins";
      break;
    case "farmers":
      YAxisDataKey = "farmers";
      break;
    case "farms":
      YAxisDataKey = "farms";
      break;
    case "field_agents":
      YAxisDataKey = "field_agents";
      break;
    case "parish_admins":
      YAxisDataKey = "parish_admins";
      break;
    default:
      YAxisDataKey = "district_admins";
  }

  switch (y_axis) {
    case "district_admins":
      displayTitle = "District administrators";
      break;
    case "farmers":
      displayTitle = "Trend of Farmers";
      break;
    case "farms":
      displayTitle = "Trend of Farms";
      break;
    case "field_agents":
      displayTitle = "Trend of Field agents";
      break;
    case "parish_admins":
      displayTitle = "Parish administrators";
      break;
    default:
      displayTitle = "District administrators";
  }


  if (!data) {
    return (
      <div>
        <div className="flex gap-2">
          <Loader2 className="animate-spin" />
          <span>Loading data ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 md:m-1 border-[1px] border-gray-400 shadow-md shadow-gray-300 rounded-lg pr-5 ">
      <p className="text-center font-semibold my-2">{displayTitle}</p>
      <LineChart width={width - 10} height={height - 10} data={data} margin={{left: 0}}>
        <Line type="monotone" dataKey={YAxisDataKey} stroke="#00ff00" />
        {/* <CartesianGrid stroke="#ccc" /> */}
        <XAxis dataKey={XAxisDataKey} />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}
