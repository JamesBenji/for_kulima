"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Dashboard from "@/components/protected_dashboard/dashboard";
import ViewAllFarmersButton from "../client-rej-by-server/parish_admin/ViewAllFarmersButton";
import ViewAllFarmsButton from "../client-rej-by-server/parish_admin/ViewAllFarmsButton";
import ViewParishAdminsButton from "../client-rej-by-server/district_admin/ViewParishAdminsButton";
import ViewParishAccessRequestsButton from "../client-rej-by-server/district_admin/ViewParishAccessRequestsButton";

const supabase = createClient();

function VerifiedDistrictAdmin() {
  const router = useRouter();

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

  const actions: Actions[] = [
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
      <Dashboard actions={actions} title="District Administrator Dashboard" />
      {/* <div className="flex-1 flex flex-col h-full"> hello</div> */}
    </div>
  )
}

export default VerifiedDistrictAdmin;
