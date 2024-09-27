"use client";

import { useState } from "react";

export default function ViewMyDistrictFieldAgentsButton() {
  const [isLoading, setIsLoading] = useState(false);

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/view-district-field-agents", {
        method: "GET",
      });
    } catch (error) {
      alert("Failed to make API call");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button onClick={makeAPIcall} disabled={isLoading}>
      {isLoading ? "Fetching data..." : "View field agents"}
    </button>
  );
}
