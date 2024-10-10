import { createClient } from "@/utils/supabase/client";
import { LucideMoveDown, LucideMoveUp, MinusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface InfoCardProps {
  data?: TrendsObject[] | undefined | null;
  role: string | undefined;
  item:
    | "farms"
    | "farmers"
    | "district_admins"
    | "parish_admins"
    | "field_agents";
  email?: string;
  district?: string;
  parish?: string;
}

interface Responses {
  field_agents: number;
  farms: number;
  farmers: number;
  parish_admins?: number;
}

export default function InfoCard({
  data,
  role,
  item,
  email,
  district,
  parish,
}: InfoCardProps) {
  const supabase = createClient();

  const farms = data?.[data?.length > 0 ? data?.length - 1 : 0]?.farms;
  const farmers = data?.[data?.length > 0 ? data?.length - 1 : 0]?.farmers;
  const district_admins =
    data?.[data?.length > 0 ? data?.length - 1 : 0]?.district_admins;
  const parish_admins =
    data?.[data?.length > 0 ? data?.length - 1 : 0]?.parish_admins;
  const field_agents =
    data?.[data?.length > 0 ? data?.length - 1 : 0]?.field_agents;
  const old_farms = data?.[data?.length > 1 ? data?.length - 2 : 0]?.farms;
  const old_farmers = data?.[data?.length > 1 ? data?.length - 2 : 0]?.farmers;
  const old_district_admins =
    data?.[data?.length > 1 ? data?.length - 2 : 0]?.district_admins;
  const old_parish_admins =
    data?.[data?.length > 1 ? data?.length - 2 : 0]?.parish_admins;
  const old_field_agents =
    data?.[data?.length > 1 ? data?.length - 2 : 0]?.field_agents;

  let displayTitle: string;
  let displayValue: number | undefined;
  let oldValue: number | undefined;

  switch (item) {
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
  switch (item) {
    case "district_admins":
      oldValue = old_district_admins;
      break;
    case "farmers":
      oldValue = old_farmers;
      break;
    case "farms":
      oldValue = old_farms;
      break;
    case "field_agents":
      oldValue = old_field_agents;
      break;
    case "parish_admins":
      oldValue = old_parish_admins;
      break;
    default:
      oldValue = old_district_admins;
  }
  switch (item) {
    case "district_admins":
      displayValue = district_admins;
      break;
    case "farmers":
      displayValue = farmers;
      break;
    case "farms":
      displayValue = farms;
      break;
    case "field_agents":
      displayValue = field_agents;
      break;
    case "parish_admins":
      displayValue = parish_admins;
      break;
    default:
      displayValue = district_admins;
  }

  const [responses, setResponses] = useState<{ [key: string]: number } | null>(
    null
  );

  useEffect(() => {
    if (role === "district_admin") {
      const fetchDistrictData = async () => {
        const responses: { [key: string]: number } = {};
        const { data: ParishAdmins, error: ParishFetchError } = await supabase
          .from("parish_admin")
          .select("email")
          .eq("district", district);

        if (ParishFetchError)
          console.log("Error fetching district_count: ", ParishFetchError);

        responses["parish_admins"] = ParishAdmins?.length!;

        const { data: FieldAgents, error: FieldAgentsError } = await supabase
          .from("field_agents")
          .select("email")
          .eq("district", district);

        if (FieldAgentsError) {
          console.log({ FieldAgentsError });
        }

        // district_count_field_agents = FieldAgents?.length!;
        responses["field_agents"] = FieldAgents?.length!;

        const { data: Farms, error: FarmsError } = await supabase
          .from("farms")
          .select("farm_uid")
          .eq("district", district);

        if (FarmsError) console.log({ FarmsError });

        // district_count_farms = Farms?.length!;
        responses["farms"] = Farms?.length!;

        const { data: Farmers, error: FarmersError } = await supabase
          .from("farmers")
          .select("farmer_uid")
          .eq("district", district);

        if (FarmersError) console.log({ FarmersError });

        // district_count_farmers = Farmers?.length!;
        responses["farmers"] = Farmers?.length!;


        setResponses(responses); //ignore error
      };
      fetchDistrictData();
    }

    if (role === "parish_admin") {
      const fetchParishData = async () => {
        const responses: { [key: string]: number } = {};
        const { data: FieldAgents, error: FieldAgentsError } = await supabase
          .from("field_agents")
          .select("email")
          .eq("district", district)
          .eq("parish", parish);

        if (FieldAgentsError)
          console.log("Error fetching district_count: ", FieldAgentsError);

        responses["field_agents"] = FieldAgents?.length!;

        const { data: Farms, error: FarmsError } = await supabase
          .from("farms")
          .select("farm_uid")
          .eq("district", district)
          .eq("parish", parish);

        if (FarmsError) console.log({ FarmsError });

        // district_count_farms = Farms?.length!;
        responses["farms"] = Farms?.length!;

        const { data: Farmers, error: FarmersError } = await supabase
          .from("farmers")
          .select("farmer_uid")
          .eq("district", district)
          .eq("parish", parish);

        if (FarmersError) console.log({ FarmersError });

        // district_count_farmers = Farmers?.length!;
        responses["farmers"] = Farmers?.length!;

        setResponses(responses);
      };

      fetchParishData();
    }
  }, []);

  if (role === "district_admin") {
    switch (item) {
      case "farmers":
        displayValue = responses?.farmers!;
        break;
      case "farms":
        displayValue = responses?.farms!;
        break;
      case "field_agents":
        displayValue = responses?.field_agents!;
        break;
      case "parish_admins":
        displayValue = responses?.parish_admins!;
        break;
      default:
        displayValue = 0;
    }

    return (
      <div className=" bg-gray-50 w-fit p-5 rounded-xl m-2">
        <div>
          <p className="font-semibold tracking-wide text-wrap text-center text-sm text-gray-700">
            {displayTitle}
          </p>
          <p className="text-center text-6xl font-semibold my-2 text-green-400">
            {displayValue}
          </p>
        </div>
      </div>
    );
  }

  if (role === "parish_admin") {
    switch (item) {
      case "farmers":
        displayValue = responses?.farmers!;
        break;
      case "farms":
        displayValue = responses?.farms!;
        break;
      case "field_agents":
        displayValue = responses?.field_agents!;
        break;
      default:
        displayValue = 0;
    }

    return (
      <div className=" bg-gray-50 w-fit p-5 rounded-xl m-2">
        <div>
          <p className="font-semibold tracking-wide text-wrap text-center text-sm text-gray-700">
            {displayTitle}
          </p>
          <p className="text-center text-6xl font-semibold my-2 text-green-400">
            {displayValue}
          </p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className=" bg-gray-50 w-fit p-5 rounded-xl m-2">
        <div>
          <p className="font-semibold tracking-wide text-wrap text-center text-sm text-gray-700">
            {displayTitle}
          </p>
          <p className="text-center text-6xl font-semibold my-2 text-green-400">
            {displayValue}
          </p>
          <div className="text-center">
            {displayValue && oldValue && (
              <div className="flex align-middle justify-center">
                {displayValue - oldValue === 0 ? (
                  <MinusIcon className="text-gray-400" />
                ) : displayValue - oldValue > 0 ? (
                  <LucideMoveUp className="text-green-600" />
                ) : (
                  <LucideMoveDown className="text-red-500" />
                )}
                <p className="text-gray-500">
                  {displayValue - oldValue} new users
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
