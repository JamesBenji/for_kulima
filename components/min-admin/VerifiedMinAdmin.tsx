"use client";

import React, { useState } from "react";
import Dashboard from "@/components/protected_dashboard/dashboard";
import ViewAllFarmersButton from "../client-rej-by-server/parish_admin/ViewAllFarmersButton";
import ViewAllFarmsButton from "../client-rej-by-server/parish_admin/ViewAllFarmsButton";
import ViewParishAdminsButton from "../client-rej-by-server/district_admin/ViewParishAdminsButton";
import ViewDistrictAdminsButton from "../client-rej-by-server/ministry_admin/ViewDistrictAdminsButton";
import ViewAccessRequestsButton from "../client-rej-by-server/ministry_admin/ViewAccessRequestsButton";
import ViewAllParishAgentsButton from "../client-rej-by-server/parish_admin/ViewAllParishAgentsButton";
import StatsDashboard from "../dashboard/Dashboard";
import { Button } from "../ui/button";
import { DownloadAllFarmersReport } from "@/lib/shared/functions";
import toast from "react-hot-toast";


const ExportAllFarmers = () => {
  const [clicked, setClicked] = useState(false);

  const handleReportDownload = async () => {
    setClicked(true)
    
    const response = await DownloadAllFarmersReport();
    
    // if (response.error) {
    //   toast.error("Download failed", { duration: 3000 });
    //   setClicked(false)
    //   return;
    // }

    // // toast.success("Data downloaded");
    // setClicked(false)
    // return;
  };

  return <div className="w-full flex items-center justify-center">
  <Button
    className="bg-rose-600 my-4 rounded-lg w-full md:w-fit text-white hover:bg-rose-600/50 hover:ring-2 hover:ring-white"
    onClick={handleReportDownload}
  >
    {clicked ? "Downloading PDF" : 'Download data for all farmers (PDF)'}
  </Button>
</div>
}

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
    {
      name: "Export data",
      component: <ExportAllFarmers />,
    },
    
  ];

  return (
    <div className="w-full flex-1 flex flex-col h-full dark:bg-black">
      <Dashboard actions={actions} title="Ministry Administrator Dashboard" />
      {/* <div className="flex-1 flex flex-col h-full"> hello</div> */}
    </div>
  )
}

export default VerifiedMinAdmin;
