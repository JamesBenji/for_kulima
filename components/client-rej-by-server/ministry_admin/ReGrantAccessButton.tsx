"use client";

import ConfirmOverlay from "@/components/ConfirmOverlay";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ReGrantAccessButton({
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
    setIsLoading(true);
    try {
      const loader = toast.loading("Processing your request", {
        duration: 10000,
      });

      const response = await fetch("/api/regrant-access-district", {
        method: "POST",
        body: JSON.stringify({ target_mail: email }),
      });
      toast.dismiss(loader);

      const data = await response.json();

      if (data.error) return toast.error(data.error);

      toast.success("Access regranted!");

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
      <Button
        asChild
        className="px-5 py-2 hover:bg-white rounded-lg w-full md:w-fit text-green-700 border-green-300 border-[2px] shadow-sm hover:underline bg-green-300 "
        onClick={() => setShowPopover(!showPopOver)}
        disabled={isLoading}
      >
        {isLoading ? (
          "Working..."
        ) : (
          <div className="flex flex-row align-middle justify-center md:justify-start gap-1 text-lg">
            <RotateCw className="text-green-700" />

            <span>&nbsp;Re-grant access</span>
          </div>
        )}
      </Button>
      {showPopOver && (
        <ConfirmOverlay
          onClose={setShowPopover}
          setState={setPopoverResponse}
          destructive={false}
          actionName="Re-grant app access"
          title={`Are you sure you want to re-grant app access to ${email}`}
          body="This action is will enable the district administrator to upload data to the Kulima database. You can reverse this action by revoking access from this user. Do you want to continue?"
        />
      )}
    </div>
    // <button onClick={makeAPIcall} disabled={isLoading}>
    //   {isLoading ? 'Loading...' : 'Re-grant access'}
    // </button>
  );
}
