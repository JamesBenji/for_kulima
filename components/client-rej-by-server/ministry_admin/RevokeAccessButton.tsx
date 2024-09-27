"use client";

import ConfirmOverlay from "@/components/ConfirmOverlay";
import { ShieldX } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RevokeAccessButton({
  email,
  refresh,
}: {
  email?: string;
  refresh?: () => void;
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

      const response = await fetch("/api/revoke-access-district", {
        method: "POST",
        body: JSON.stringify({ target_mail: email }),
      });

      toast.dismiss(loader);

      const data = await response.json();

      if (data.error) return toast.error(data.error);

      toast.success("Access revoked!");

      if (refresh) refresh();
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
      <div className="bg-red-500 w-full md:w-fit p-[1.5px] rounded-lg">
        <button
          className="px-5 py-2 rounded-lg w-full md:w-fit text-red-500 border-white border-[1px] shadow-sm hover:underline bg-red-200 "
          onClick={() => setShowPopover(!showPopOver)}
          disabled={isLoading}
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <div className="flex flex-row justify-center md:justify-start align-middle ">
              <ShieldX className="text-red-500" />
              &nbsp;<span>Revoke Access</span>
            </div>
          )}
        </button>
      </div>
      {showPopOver && (
        <ConfirmOverlay
          onClose={setShowPopover}
          setState={setPopoverResponse}
          destructive={true}
          actionName="Revoke access"
          title={`Are you sure you want to block ${email} from using the mobile app?`}
          body="This action is will unable the field agent from uploading any data into the Kulima database. You can reverse this action by re-granting this agent access to the mobile app. Do you want to continue with this?"
        />
      )}
    </div>
    // <button onClick={makeAPIcall} disabled={isLoading}>
    //   {isLoading ? 'Loading...' : 'Revoke access'}
    // </button>
  );
}
