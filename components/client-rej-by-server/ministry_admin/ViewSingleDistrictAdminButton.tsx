"use client";

import { useState } from "react";

export default function ViewSingleDistrictAdminButton() {
  const [isLoading, setIsLoading] = useState(false);

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/view-selected-district-admin", {
        method: "POST",
        body: JSON.stringify({target_mail: 'applemirinda45@gmail.com'})
      });
    } catch (error) {
      alert("Failed to make API call");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button onClick={makeAPIcall} disabled={isLoading}>
      {isLoading ? "Fetching data..." : "View this district admin"}
    </button>
  );
}
