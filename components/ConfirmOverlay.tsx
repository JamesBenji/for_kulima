import { X } from "lucide-react";
import React from "react";

interface ConfirmOverlayProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  actionName: string;
  title: string;
  body: string;
  destructive?: boolean
}

export default function ConfirmOverlay({
  onClose,
  setState,
  actionName,
  title,
  body,
  destructive
}: ConfirmOverlayProps) {
  const onConfirm = () => {
    setState(true);
  };

  const containerSpacing = "py-4 px-5";
  const destructiveStyles = 'text-destructive bg-red-200 border-[1px] rounded-xl border-destructive'
  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 bg-[rgba(255,255,255,0.5)] backdrop-blur-md  border-black">
      <div className="bg-white shadow-md rounded-md border-2 md:w-[40%] h-fit md:mx-auto mt-[5%]">
        <div className=" py-1 px-2">
          <button
            className="text-blue-400 w-full flex flex-row justify-end text-right text-sm"
            onClick={() => onClose(false)}
          >
            <X className="m-2" />
          </button>
        </div>

        {/* <div className="w-full h-[0.5px] bg-black" /> */}

        <div className={`${containerSpacing}`}>
          <h2 className="text-2xl font-bold antialiased my-2">{title}</h2>
          <p className="my-2">{body}</p>
        </div>

        {/* <div className="w-full h-[0.5px] bg-black" /> */}

        <div
          className={`pt-2 pb-5 px-5 w-full flex flex-row justify-between align-middle `}
        >
          <div>
            <button
              className="border-2 px-3 py-2 rounded-lg"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
          </div>
          <div>
            <button
              className={`border-2 px-3 py-2 rounded-lg bg-green-500 ${destructive ? 'text-red-500' : 'text-white'} hover:underline ${destructive ? destructiveStyles : ''}`}
              onClick={onConfirm}
            >
              {actionName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
