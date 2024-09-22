"use client";

import { useState } from "react";

export default function SearchUserButton() {
  const [isLoading, setIsLoading] = useState(false);

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/search-user", {
        method: "POST",
        // body: JSON.stringify({target_mail: 'applemirinda45@gmail.com'})
        body: JSON.stringify({target_mail: 'parish_test@gmail.com'})
      });
    } catch (error) {
      alert("Failed to make API call");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button onClick={makeAPIcall} disabled={isLoading}>
      {isLoading ? "Fetching data..." : "Search user"}
    </button>
  );
}
