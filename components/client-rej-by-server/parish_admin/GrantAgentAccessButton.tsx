"use client";

import ConfirmOverlay from "@/components/ConfirmOverlay";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

async function send_mail(email: string){
  const response = await fetch('/api/send-mail', {
    method: 'POST',
    body: JSON.stringify({email})
  })

  const res = await response.json()

  if(res.error){
    toast.error('Failed to send confirmation email')
    return;
  }

  toast.success('Confirmation email sent');
}

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

      await send_mail(email)

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
              <Check className="hover:text-green-500" />

              <span>&nbsp;Grant access</span>
            </div>
          )}
        </Button>
       
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
