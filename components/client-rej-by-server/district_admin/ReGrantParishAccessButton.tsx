'use client'

import ConfirmOverlay from '@/components/ConfirmOverlay';
import { RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ReGrantParishAccessButton({
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

      const response = await fetch("/api/regrant-access-parish", {
        method: "POST",
        body: JSON.stringify({target_mail: email})
      });

      toast.dismiss(loader);

      const data = await response.json();

      if (data.error) return toast.error(data.error);

      toast.success("Access regranted!");

      refresh()
      
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
    <div className="bg-green-700 w-full md:w-fit p-[1.5px] rounded-lg">
      <button
        className="px-5 py-2 rounded-lg w-full md:w-fit text-green-700 border-white border-[1px] shadow-sm hover:underline bg-green-300 "
        onClick={() => setShowPopover(!showPopOver)}
        disabled={isLoading}
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <div className="flex flex-row justify-center md:justify-start align-middle">
            <RotateCw className="text-green-700" />
            &nbsp;&nbsp;<span>Re-grant access</span>
          </div>
        )}
      </button>
    </div>
    {showPopOver && (
      <ConfirmOverlay
        onClose={setShowPopover}
        setState={setPopoverResponse}
        destructive={false}
        actionName="Re-grant app access"
        title={`Are you sure you want to re-grant app access to ${email}`}
        body="This action is will enable the field agent to upload data to the Kulima database. You can reverse this action by revoking app access from this agent. Do you want to continue with this?"
      />
    )}
  </div>
  );
}