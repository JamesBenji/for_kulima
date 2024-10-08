"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ViewAllParishAgentsButton from "../client-rej-by-server/parish_admin/ViewAllParishAgentsButton";
import ViewAgentAccessRequestsButton from "../client-rej-by-server/parish_admin/ViewAgentAccessRequestsButton";
import Dashboard from "@/components/protected_dashboard/dashboard";
import ViewAllFarmersButton from "../client-rej-by-server/parish_admin/ViewAllFarmersButton";
import ViewAllFarmsButton from "../client-rej-by-server/parish_admin/ViewAllFarmsButton";
import StatsDashboard from "../dashboard/Dashboard";

const supabase = createClient();

function VerifiedParishAdmin() {
  const router = useRouter();

  useEffect(() => {
    const channels = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "parish_admin" },
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
      name: "Dashboard",
      component: <StatsDashboard />,
    },
    {
      name: "View your field agents",
      component: <ViewAllParishAgentsButton />,
    },
    {
      name: "View access requests",
      component: <ViewAgentAccessRequestsButton />,
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
      <Dashboard actions={actions} title="Parish Administrator Dashboard" />
      {/* <div className="flex-1 flex flex-col h-full"> hello</div> */}
    </div>
  )
}

export default VerifiedParishAdmin;
