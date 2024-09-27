"use client";

import { useState } from "react";

export default function ViewSingleAgentButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/view-selected-agent", {
        method: "POST",
        body: JSON.stringify({ target_mail: firstName }),
      });
    } catch (error) {
      alert("Failed to make API call");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>

      <div>
        <input type="text" name="first_name" placeholder="Enter the first name of the agent"  />
      </div>


      <button onClick={makeAPIcall} disabled={isLoading}>
        {isLoading ? "Fetching data..." : "View single parish admin"}
      </button>
    </div>
  );
}
