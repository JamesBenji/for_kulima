"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Dashboard from "@/components/protected_dashboard/dashboard";
import ViewAllFarmersButton from "../client-rej-by-server/parish_admin/ViewAllFarmersButton";
import ViewAllFarmsButton from "../client-rej-by-server/parish_admin/ViewAllFarmsButton";
import ViewParishAdminsButton from "../client-rej-by-server/district_admin/ViewParishAdminsButton";
import ViewParishAccessRequestsButton from "../client-rej-by-server/district_admin/ViewParishAccessRequestsButton";
import StatsDashboard from "../dashboard/Dashboard";
import { useAdminDetails } from "@/utils/global_state/Store";

const supabase = createClient();

function VerifiedDistrictAdmin() {
  const router = useRouter();
  const role = useAdminDetails((state) => state.role);
  const [myData, setMyData] = useState<AdminType | null>(null);
  const setAdminDetails = useAdminDetails((state) => state.setAdminDetails);
  const setRole = useAdminDetails((state) => state.setRole);

  useEffect(() => {
    setRole("district_admin");
  }, []);

  useEffect(() => {
    const channels = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "district_admin" },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.new.hasAccess === false) {
            supabase.auth.signOut().then(() => {
              return router.replace("/");
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  useEffect(() => {
    supabase
      .from(`${role}`)
      .select("*")
      .single()
      .then((response) => {
        setMyData(response.data);
      });
  }, [role]);

  useEffect(() => {
    setAdminDetails(myData ? myData : null);
  }, [myData]);

  const actions: Actions[] = [
    {
      name: "Dashboard",
      component: <StatsDashboard />,
    },
    {
      name: "View parish admins",
      component: <ViewParishAdminsButton />,
    },
    {
      name: "View access requests",
      component: <ViewParishAccessRequestsButton />,
    },
    {
      name: "View farmers",
      component: <ViewAllFarmersButton />,
    },
    {
      name: "View farms",
      component: <ViewAllFarmsButton />,
    },
    
  ];

  return (
    <div className="flex-1 flex flex-col h-full dark:bg-black">
      <Dashboard actions={actions} title="District Administrator Dashboard" location={{
          district: myData?.district,
          parish: myData?.parish,
          allocation: myData?.allocation
        }}/>
      {/* <div className="flex-1 flex flex-col h-full"> hello</div> */}
    </div>
  )
}

export default VerifiedDistrictAdmin;
