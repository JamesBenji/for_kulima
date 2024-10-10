"use client";
import { getUserAccType } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import GraphCard from "./GraphCard";
import { useWindowSize } from "usehooks-ts";
import InfoCard from "./InfoCard";
import { Loader2 } from "lucide-react";

const MOBILE_BREAKPOINT = 768;

export default function StatsDashboard() {
  const supabase = createClient();
  const [role, setRole] = useState<string | undefined>(undefined);
  const [myDistrict, setMyDistrict] = useState<string | undefined>(undefined);
  const [myParish, setMyParish] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<boolean>(false);
  const [no_format_trends, setNoFormatTrends] = useState<
    Array<TrendsObject> | null | undefined
  >(undefined);
  const [trends, setTrends] = useState<Array<TrendsObject> | null | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string | undefined>("");
  const { width = 0, height = 0 } = useWindowSize();
  const divWidth = useMemo(() => 0.75 * width, []);
  const card_width: number = useMemo(() => {
    if (width < MOBILE_BREAKPOINT) return 300;
    return divWidth / 2 - 10;
  }, [divWidth]);
  const card_height: number = useMemo(() => {
    if (width < MOBILE_BREAKPOINT) return 250;
    return card_width / 2;
  }, [card_width]);

  //   setting user role
  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      if (response.error)
        toast.error("User fetch error. Your internet connection is slow.");

      const email = response.data.user?.email;
      setEmail(email);

      if (email)
        getUserAccType(email).then((res) => {
          setRole(res);
          setTracker(true);
        });
    });
  }, []);

  useEffect(() => {
    if (role !== "district_admin" && role !== "parish_admin") {
      const fetchStatsForMin = async () => {
        const { data, error } = await supabase
          .from("trends")
          .select(
            "id, created_at, farms, farmers, district_admins, parish_admins, field_agents"
          );
        if (error) console.log("error getting trends: ", error);
        setNoFormatTrends(data);
        return;
      };
      fetchStatsForMin();
    }

    if (role === "district_admin" || role === "parish_admin") {
      const fetchMyLocation = async () => {
        const { data, error } = await supabase
          .from(
            `${role === "district_admin" ? "district_admin" : "parish_admin"}`
          )
          .select("district, parish")
          .eq("email", email)
          .single();
        if (error) {
          toast.error("Error");
          console.log({ error });
        }

        setMyDistrict(data?.district);
        setMyParish(data?.parish);
      };

      fetchMyLocation();
    }
  }, [role, email]);

  useEffect(() => {
    if (no_format_trends) {
      const converttoEAT = () => {
        const sorted_trends = no_format_trends.sort(
          (a: TrendsObject, b: TrendsObject) => a.id - b.id
        );
        return sorted_trends.map((point) => {
          const _org_date = new Date(point.created_at);

          return {
            ...point,
            created_at: `${_org_date.getDate()}/${_org_date.getMonth()}/${_org_date.getFullYear().toString().slice(2)}`,
          };
        });
      };

      setTrends(converttoEAT());
    }
  }, [no_format_trends]);

  if (!tracker && !myDistrict) {
    return (
      <div>
        <div className="flex gap-2">
          <Loader2 className="animate-spin" />
          <span>Loading data ...</span>
        </div>
      </div>
    );
  }

  if (tracker && role === "district_admin") {
    return (
      <div>
        <span className="block uppercase text-xl font-semibold  my-3">
          Overview
        </span>

        {myDistrict && (
          <div className="flex flex-1 flex-wrap justify-evenly align-middle">
            <InfoCard
              data={trends}
              role={role}
              item="parish_admins"
              email={email}
              district={myDistrict}
            />
            <InfoCard
              data={trends}
              item="field_agents"
              role={role}
              email={email}
              district={myDistrict}
            />
            <InfoCard
              data={trends}
              role={role}
              item="farmers"
              email={email}
              district={myDistrict}
            />
            <InfoCard
              data={trends}
              role={role}
              item="farms"
              email={email}
              district={myDistrict}
            />
          </div>
        )}

        {myDistrict && (
          <div className="flex flex-1 flex-wrap align-middle justify-center">
            <div className="">
              <GraphCard
                data={trends}
                y_axis="farms"
                width={card_width}
                height={card_height}
                role={role}
                district={myDistrict}
              />
            </div>
            <div>
              <GraphCard
                data={trends}
                y_axis="farmers"
                width={card_width}
                height={card_height}
                role={role}
                district={myDistrict}
              />
            </div>

            <div>
              <GraphCard
                data={trends}
                y_axis="parish_admins"
                width={card_width}
                height={card_height}
                role={role}
                district={myDistrict}
              />
            </div>
            <div>
              <GraphCard
                data={trends}
                y_axis="field_agents"
                width={card_width}
                height={card_height}
                role={role}
                district={myDistrict}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (tracker && role === "parish_admin") {
    return (
      <div>
        <span className="block uppercase text-xl font-semibold  my-3">
          Overview
        </span>

        {myDistrict && myParish && (
          <div className="flex flex-1 flex-wrap justify-evenly align-middle">
            <InfoCard
              data={trends}
              item="field_agents"
              role={role}
              email={email}
              district={myDistrict}
              parish={myParish}
            />
            <InfoCard
              data={trends}
              role={role}
              item="farmers"
              email={email}
              district={myDistrict}
              parish={myParish}
            />
            <InfoCard
              data={trends}
              role={role}
              item="farms"
              email={email}
              district={myDistrict}
              parish={myParish}
            />
          </div>
        )}

        {myDistrict && myParish && (
          <div className="flex flex-1 flex-wrap align-middle justify-center">
            <div className="">
              <GraphCard
                data={trends}
                y_axis="farms"
                width={card_width}
                height={card_height}
                role={role}
                district={myDistrict}
                parish={myParish}
              />
            </div>
            <div>
              <GraphCard
                data={trends}
                y_axis="farmers"
                width={card_width}
                height={card_height}
                role={role}
                district={myDistrict}
                parish={myParish}
              />
            </div>

            <div>
              <GraphCard
                data={trends}
                y_axis="field_agents"
                width={card_width}
                height={card_height}
                role={role}
                district={myDistrict}
                parish={myParish}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (tracker && !role) {
    return (
      <div>
        <span className="block uppercase text-xl font-semibold  my-3">
          Overview
        </span>

        <div className="flex flex-1 flex-wrap justify-center align-middle">
          <InfoCard data={trends} role={role} item="district_admins" />
          <InfoCard data={trends} role={role} item="parish_admins" />
          <InfoCard data={trends} role={role} item="field_agents" />
          <InfoCard data={trends} role={role} item="farmers" />
          <InfoCard data={trends} role={role} item="farms" />
        </div>

        <div>
          <span className="block uppercase text-xl font-semibold  my-5">
            Trends
          </span>
          <div className="flex flex-1 flex-wrap align-middle justify-center">
            <div className="">
              <GraphCard
                data={trends}
                y_axis="farms"
                width={card_width}
                height={card_height}
              />
            </div>
            <div>
              <GraphCard
                data={trends}
                y_axis="farmers"
                width={card_width}
                height={card_height}
              />
            </div>
            <div>
              <GraphCard
                data={trends}
                y_axis="district_admins"
                width={card_width}
                height={card_height}
              />
            </div>
            <div>
              <GraphCard
                data={trends}
                y_axis="parish_admins"
                width={card_width}
                height={card_height}
              />
            </div>
            <div>
              <GraphCard
                data={trends}
                y_axis="field_agents"
                width={card_width}
                height={card_height}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
