"use client";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  role?: string;
  district?: string;
  parish?: string;
}

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const getCount = (data: { created_at: string }[]) => {
  const res: Array<{ month: number; count: number; label: string }> = [];
  let validMonths: number[] = [];

  if (!Array.isArray(data)) {
    console.warn("Input data is not an array. Returning empty result.");
    return [];
  }

  MONTHS.forEach((month) => {
    let count = 0;
    let year: number = 0;
    data?.forEach((point) => {
      const date = new Date(point.created_at);
      year = date.getFullYear();
      if (month === date.getMonth()) {
        count++;
        validMonths.push(date.getMonth());
      }
    });
    res.push({ month, count, label: `${month}/${year}` });
  });

  const filtered = res.filter((item) => validMonths.includes(item.month));

  return [{ month: 0, count: 0, label: "" }, ...filtered];
};

export default function GraphCard({
  data,
  y_axis,
  width,
  height,
  role,
  district,
  parish,
}: GraphCardProps) {
  const supabase = createClient();
  const [districtResponses, setDistrictResponses] = useState<{
    [key: string]: Array<{ created_at: string }>;
  } | null>(null);
  const [parishResponses, setParishResponses] = useState<{
    [key: string]: Array<{ created_at: string }>;
  } | null>(null);

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

  useEffect(() => {
    if (role === "district_admin") {
      const fetchDistrictData = async () => {
        // const responses: { [key: string]: Array<{ created_at: string }> } = {};
        const responses: any = {};
        const { data: ParishAdmins, error: ParishFetchError } = await supabase
          .from("parish_admin")
          .select("created_at")
          .eq("district", district)
          .order("created_at", { ascending: true });

        if (ParishFetchError)
          console.log("Error fetching district_count: ", ParishFetchError);

        if (ParishAdmins)
          responses["parish_admins"] = getCount(ParishAdmins) || [];

        const { data: FieldAgents, error: FieldAgentsError } = await supabase
          .from("field_agents")
          .select("created_at")
          .eq("district", district)
          .order("created_at", { ascending: true });

        if (FieldAgentsError) {
          console.log({ FieldAgentsError });
        }

        // district_count_field_agents = FieldAgents?.length!;
        if (FieldAgents)
          responses["field_agents"] = getCount(FieldAgents) || [];

        const { data: Farms, error: FarmsError } = await supabase
          .from("farms")
          .select("created_at")
          .eq("district", district)
          .order("created_at", { ascending: true });

        if (FarmsError) console.log({ FarmsError });

        // district_count_farms = Farms?.length!;
        if (Farms) responses["farms"] = getCount(Farms) || [];

        const { data: Farmers, error: FarmersError } = await supabase
          .from("farmers")
          .select("created_at")
          .eq("district", district)
          .order("created_at", { ascending: true });

        if (FarmersError) console.log({ FarmersError });

        // district_count_farmers = Farmers?.length!;
        if (Farmers) responses["farmers"] = getCount(Farmers) || [];

        setDistrictResponses(responses);
      };
      fetchDistrictData();
    }
    if (role === "parish_admin") {
      const fetchParishData = async () => {
        // const responses: { [key: string]: Array<{ created_at: string }> } = {};
        const responses: any = {};

        const { data: FieldAgents, error: FieldAgentsError } = await supabase
          .from("field_agents")
          .select("created_at")
          .eq("district", district)
          .eq("parish", parish)
          .order("created_at", { ascending: true });

        if (FieldAgentsError) {
          console.log({ FieldAgentsError });
        }

        // district_count_field_agents = FieldAgents?.length!;
        if (FieldAgents)
          responses["field_agents"] = getCount(FieldAgents) || [];

        const { data: Farms, error: FarmsError } = await supabase
          .from("farms")
          .select("created_at")
          .eq("district", district)
          .eq("parish", parish)
          .order("created_at", { ascending: true });

        if (FarmsError) console.log({ FarmsError });

        // district_count_farms = Farms?.length!;
        if (Farms) responses["farms"] = getCount(Farms) || [];

        const { data: Farmers, error: FarmersError } = await supabase
          .from("farmers")
          .select("created_at")
          .eq("district", district)
          .eq("parish", parish)
          .order("created_at", { ascending: true });

        if (FarmersError) console.log({ FarmersError });

        // district_count_farmers = Farmers?.length!;
        if (Farmers) responses["farmers"] = getCount(Farmers) || [];

        setParishResponses(responses);
      };
      fetchParishData();
    }
  }, []);

  if (role === "district_admin") {
    if (!districtResponses) {
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
        <AreaChart
          width={width - 10}
          height={height - 10}
          data={districtResponses[y_axis]}
          margin={{ left: 0 }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff00" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#00ff00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={"count"}
            stroke="#00ff00"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
          <XAxis dataKey={"label"} tick={false} />
          <YAxis domain={[0, "auto"]} />
          <Tooltip />
        </AreaChart>
      </div>
    );
  }
  if (role === "parish_admin") {
    if (!parishResponses) {
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
        <AreaChart
          width={width - 10}
          height={height - 10}
          data={parishResponses[y_axis]}
          margin={{ left: 0 }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff00" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#00ff00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={"count"}
            stroke="#00ff00"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
          <XAxis dataKey={"label"} tick={false} />
          <YAxis domain={[0, "auto"]} />
          <Tooltip />
        </AreaChart>
      </div>
    );
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
      {/* <LineChart
        width={width - 10}
        height={height - 10}
        data={data}
        margin={{ left: 0 }}
      >
        <Line type="monotone" dataKey={YAxisDataKey} stroke="#00ff00" />
        <XAxis dataKey={XAxisDataKey} />
        <YAxis />
        <Tooltip />
      </LineChart> */}

      <AreaChart
        width={width - 10}
        height={height - 10}
        data={data}
        margin={{ left: 0 }}
      >
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00ff00" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#00ff00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={YAxisDataKey}
          stroke="#00ff00"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
        <XAxis dataKey={XAxisDataKey} tick={false} />
        <YAxis />
        <Tooltip />
      </AreaChart>
    </div>
  );
}
