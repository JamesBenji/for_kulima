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
import { DownloadDistrictFarmersReport } from "@/lib/shared/functions";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

const ExportDistrictFarmers = () => {
  const [clicked, setClicked] = useState(false);
  const adminData = useAdminDetails((state) => state.admin_details);

  const handleReportDownload = async () => {
    if (adminData) {
      setClicked(true);
      const response = await DownloadDistrictFarmersReport(adminData.district);
      if (response.error) {
        toast.error("Download failed", { duration: 3000 });
        setClicked(false);
        return;
      }
      toast.success("Data downloaded");
      setClicked(false);
      return;
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <Button
        className="bg-rose-600 my-4 rounded-lg w-full md:w-fit text-white hover:bg-rose-600/50 hover:ring-2 hover:ring-white"
        onClick={handleReportDownload}
      >
        {clicked ? "Downloading PDF" : "Download data for all farmers (PDF)"}
      </Button>
    </div>
  );
};

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
    {
      name: "Export data",
      component: <ExportDistrictFarmers />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full dark:bg-black">
      <Dashboard
        actions={actions}
        title="District Administrator Dashboard"
        location={{
          district: myData?.district,
          parish: myData?.parish,
          allocation: myData?.allocation,
        }}
      />
      {/* <div className="flex-1 flex flex-col h-full"> hello</div> */}
    </div>
  );
}

export default VerifiedDistrictAdmin;
