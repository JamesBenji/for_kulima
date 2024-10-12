"use client";

// import { createClient } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";
import React from "react";
import Dashboard from "@/components/protected_dashboard/dashboard";
import ViewAllFarmersButton from "../client-rej-by-server/parish_admin/ViewAllFarmersButton";
import ViewAllFarmsButton from "../client-rej-by-server/parish_admin/ViewAllFarmsButton";
import ViewParishAdminsButton from "../client-rej-by-server/district_admin/ViewParishAdminsButton";
// import ViewParishAccessRequestsButton from "../client-rej-by-server/district_admin/ViewParishAccessRequestsButton";
import ViewDistrictAdminsButton from "../client-rej-by-server/ministry_admin/ViewDistrictAdminsButton";
import ViewAccessRequestsButton from "../client-rej-by-server/ministry_admin/ViewAccessRequestsButton";
import ViewAllParishAgentsButton from "../client-rej-by-server/parish_admin/ViewAllParishAgentsButton";
import StatsDashboard from "../dashboard/Dashboard";

function VerifiedMinAdmin() {

  const actions: Actions[] = [
    {
      name: "Dashboard",
      component: <StatsDashboard />,
    },
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
      name: "View field agents",
      component: <ViewAllParishAgentsButton />,
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
