"use client";

import ConfirmOverlay from "@/components/ConfirmOverlay";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function GrantAgentAccessButton({
  email,
  refresh,
}: {
  email: string;
  refresh: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPopOver, setShowPopover] = useState<boolean>(false);
  const [popOverResponse, setPopoverResponse] = useState<boolean>(false);

  const makeAPIcall = async () => {
    try {
      setIsLoading(true);
      if (!email)
        return alert(
          "Invalid email detected. Please review the applicant's email."
        );
      const loader = toast.loading("Processing your request", {
        duration: 10000,
      });
      const response = await fetch("/api/grant-access-agent", {
        method: "POST",
        body: JSON.stringify({ target_mail: email }),
      });
      
      toast.dismiss(loader);

      const data = await response.json();

      if (data.error) return toast.error(data.error);

      toast.success("Access granted successfully!");

      refresh();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (popOverResponse) {
      makeAPIcall().then(() => setPopoverResponse(false));
      setShowPopover(false);
    }
  }, [popOverResponse]);

  return (
    <div>
      <div className="bg-blue-800 mt-2 w-full md:w-fit p-px rounded-lg">
        <button
          className="bg-blue-800 px-5 py-2 w-full md:w-fit rounded-lg text-white/90 border-white border-2 shadow-sm hover:underline"
          onClick={() => setShowPopover(!showPopOver)}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Grant Agent Access"}
        </button>
      </div>
      {showPopOver && (
        <ConfirmOverlay
          onClose={setShowPopover}
          setState={setPopoverResponse}
          actionName="Grant access"
          title="Are you sure?"
          body="This user will gain access to the Kulima system. Do you want to continue?"
        />
      )}
    </div>
  );
}
