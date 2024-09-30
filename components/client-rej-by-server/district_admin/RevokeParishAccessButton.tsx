'use client'

import ConfirmOverlay from '@/components/ConfirmOverlay';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function RevokeParishAccessButton({
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

      const response = await fetch("/api/revoke-access-parish", {
        method: "POST",
        body: JSON.stringify({target_mail: email})
      });

      toast.dismiss(loader);

      const data = await response.json();

      if (data.error) return toast.error(data.error);

      toast.success("Access revoked!");

      if(refresh) refresh()
      
      
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
          className="px-5 py-2 hover:bg-white rounded-lg w-full md:w-fit text-red-500 border-red-300 border-[2px] shadow-sm hover:underline bg-red-200 "
          onClick={() => setShowPopover(!showPopOver)}
          disabled={isLoading}
        >
          {isLoading ? (
            "Working..."
          ) : (
            <div className="flex flex-row align-middle justify-center md:justify-start gap-1 text-lg">
              <ShieldX size={20} className="text-red-500" />
              <span>&nbsp;Revoke Access</span>
            </div>
          )}
        </Button>
      {showPopOver && (
        <ConfirmOverlay
          onClose={setShowPopover}
          setState={setPopoverResponse}
          destructive={true}
          actionName="Revoke access"
          title={`Are you sure you want to block ${email} from using the system?`}
          body="This action is will unable the parish administrator from accessing this system. You can reverse this action by re-granting access. Do you want to continue?"
        />
      )}
    </div>
  );
}