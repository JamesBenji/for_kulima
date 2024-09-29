'use client'

import ConfirmOverlay from '@/components/ConfirmOverlay';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function GrantAccessButton({
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
        duration: 1000,
      });

      const response = await fetch("/api/grant-access-district", {
        method: "POST",
        body: JSON.stringify({target_mail: email})
      });

      
      toast.dismiss(loader);

      const data = await response.json();

      if (data.error) return toast.error(data.error);

      toast.success("Access granted successfully!");

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
    <div className="bg-green-500 w-fit p-px rounded-lg">
      <button
        className="bg-green-500 px-5 py-2 rounded-lg text-white/90 border-white border-2 shadow-sm hover:underline"
        onClick={() => setShowPopover(!showPopOver)}
        disabled={isLoading}
      >
        <span className="flex flex-row align-middle justify-center">
          <Check />&nbsp;<span>{isLoading ? "Loading..." : "Grant Access"}</span>
        </span>
      </button>
    </div>
    {showPopOver && (
      <ConfirmOverlay
        onClose={setShowPopover}
        setState={setPopoverResponse}
        actionName="Grant access"
        title="Are you sure?"
        body="This action will grant the administrator access to the Kulima system. Do you want to continue?"
      />
    )}
  </div>
    // <button onClick={makeAPIcall} disabled={isLoading}>
    //   {isLoading ? 'Loading...' : 'Grant Access Button'}
    // </button>
  );
}