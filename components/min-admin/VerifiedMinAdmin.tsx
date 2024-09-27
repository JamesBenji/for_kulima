"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Dashboard from "@/components/protected_dashboard/dashboard";
import ViewAllFarmersButton from "../client-rej-by-server/parish_admin/ViewAllFarmersButton";
import ViewAllFarmsButton from "../client-rej-by-server/parish_admin/ViewAllFarmsButton";
import ViewParishAdminsButton from "../client-rej-by-server/district_admin/ViewParishAdminsButton";
import ViewParishAccessRequestsButton from "../client-rej-by-server/district_admin/ViewParishAccessRequestsButton";
import ViewDistrictAdminsButton from "../client-rej-by-server/ministry_admin/ViewDistrictAdminsButton";
import ViewAccessRequestsButton from "../client-rej-by-server/ministry_admin/ViewAccessRequestsButton";

const supabase = createClient();

function VerifiedMinAdmin() {
  const router = useRouter();

  useEffect(() => {
    const channels = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "ministry_admin" },
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
      name: "View district admins",
      component: <ViewDistrictAdminsButton />,
    },
    {
      name: "View access requests",
      component: <ViewAccessRequestsButton />,
    },
    {
      name: "View parish admins",
      component: <ViewParishAdminsButton />,
    },
    {
      name: "View farmers",
      component: <ViewAllFarmersButton />,
    },
    {
      name: "View farms",
      component: <ViewAllFarmsButton />,
    },
    // view agents
    
  ];

  return (
    <div className="w-full flex-1 flex flex-col h-full dark:bg-black">
      <Dashboard actions={actions} title="Ministry Administrator Dashboard" />
      {/* <div className="flex-1 flex flex-col h-full"> hello</div> */}
    </div>
  )
}

export default VerifiedMinAdmin;
