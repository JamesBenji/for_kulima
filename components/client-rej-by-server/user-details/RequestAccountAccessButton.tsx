"use client";

import { useState } from "react";

interface RequestAccountAccessProps {
  data: AccountApplicationData;
}

export default function RequestAccountAccessButton({
  data,
}: RequestAccountAccessProps) {
  const [isLoading, setIsLoading] = useState(false);

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/request-account-access", {
        method: "POST",
        body: JSON.stringify({ applicant_data: data }),
      });
      console.log({ res });
    } catch (error) {
      console.error("API call failed:", error);
      alert("Failed to make API call");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={makeAPIcall} disabled={isLoading}>
      {isLoading ? "Loading..." : "Apply for account btn"}
    </button>
  );
}
