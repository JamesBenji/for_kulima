'use client'

import { useState } from 'react';

export default function GrantAccessButton() {
  const [isLoading, setIsLoading] = useState(false);

  const makeAPIcall = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/grant-access-district", {
        method: "POST",
        body: JSON.stringify({target_mail: 'applemirinda45@gmail.com'})
      });
      console.log({res});
      
    } catch (error) {
      console.error("API call failed:", error);
      alert("Failed to make API call");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={makeAPIcall} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Grant Access Button'}
    </button>
  );
}