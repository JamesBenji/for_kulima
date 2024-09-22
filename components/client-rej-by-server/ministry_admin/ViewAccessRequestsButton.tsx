"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient();

export default function ViewAccessRequestsButton() {
  const [isLoading, setIsLoading] = useState(false);

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/view-access-requests", {
        method: "GET",
      });
    } catch (error) {
      alert("Failed to make API call");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "district_account_requests" },
        (payload) => {
          console.log("Change received!", payload);
          makeAPIcall();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  return (
    <button onClick={makeAPIcall} disabled={isLoading}>
      {isLoading ? "Fetching data..." : "View access requests"}
    </button>
  );
}
